const BASE_URL = process.env.BACKEND_URL || "https://miniature-winner-pjpvr464jvpx2rxw9-3001.app.github.dev/api";


const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
			email: null,
			role: localStorage.getItem("role") || null,
			userId: localStorage.getItem("user_id") || null,
			isAuthenticated: !!localStorage.getItem("token"),
			user: [],
			users: [],
			projects: [],
			contacts: [],
			searchQuery: "",
			searchResults: {
				freelancers: [],
				projects: [],
				freelancers: [],
				projects: [],
				skills: [],
				filters: {}
			},



		},
		actions: {
			login: async (email, password) => {
				try {
					const res = await fetch(`${BASE_URL}/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					});

					const data = await res.json();
					console.log("🔍 Respuesta completa del backend en login:", data);


					if (res.ok) {
						localStorage.setItem("token", data.access_token);
						localStorage.setItem("role", data.role);
						localStorage.setItem("user_id", data.user_id);

						setStore({
							token: data.access_token,
							email: data.email,
							role: data.role,
							userId: data.user_id,
							isAuthenticated: true,
						});

						return { success: true };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error de conexión al servidor" };
				}
			},


			register: async (email, password, role, firstName, lastName) => {
				try {
					const res = await fetch(`${BASE_URL}/register`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email,
							password,
							role,
							first_name: firstName,
							last_name: lastName
						}),
					});

					const data = await res.json();

					if (res.ok) {
						localStorage.setItem("token", data.access_token);
						localStorage.setItem("role", data.role);
						localStorage.setItem("user_id", data.user_id);

						// Actualiza el store
						setStore({
							token: data.access_token,
							email: data.email,
							role: data.role,
							userId: data.user_id,
							isAuthenticated: false,
						});



						return { success: true };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			logout: () => {

				localStorage.removeItem("token");
				localStorage.removeItem("role");

				setStore({
					token: null,
					email: null,
					role: null,
					isAuthenticated: false
				});
			},

			getFreelancerProfile: async (userId) => {
				try {
					const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`);
					const data = await res.json();

					if (res.ok) {
						return { success: true, profile: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al obtener perfil de freelancer" };
				}
			},

			getEmployerProfile: async (userId) => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(
						`${BASE_URL}/employer/profile?user_id=${userId}`,
						{
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${token}`
							}
						}
					);

					const data = await res.json();

					if (res.ok) {
						return { success: true, profile: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al obtener perfil de employer" };
				}
			},

			createProject: async (formData) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/projects`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify({
							title: formData.title,
							description: formData.description,
							budget: formData.budget,
							category: formData.category,
							deadline: formData.deadline,
							skills: formData.skills,
							location: formData.location
						})
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, project: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error real:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			createProposal: async (proposalData) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/projects/${proposalData.project_id}/proposals`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({
							freelancer_id: proposalData.freelancer_id,
							message: proposalData.message,
							proposed_budget: proposalData.proposed_budget
						})
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, proposal: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error real:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},


			getEmployerProposals: async (employerId) => {
				const token = localStorage.getItem("token");

				try {
					const res = await fetch(`${BASE_URL}/employer/${employerId}/proposals`, {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + token
						}
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true, proposals: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("Error al ver Solicitudes:", error);
					return { success: false, error: "Error de conexión al servidor" };
				}
			},

			getCompletedProjects: async () => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/employer/completed-projects`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await res.json();
					if (res.ok) {
						return { success: true, projects: data };
					} else {
						return { success: false, error: data.msg || "Error desconocido" };
					}
				} catch (error) {
					return { success: false, error: "Error de conexión" };
				}
			},

			createOrUpdateProfile: async (userId, formData) => {
				try {

					const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user_id: userId,
							bio: formData.bio,
							profile_picture: formData.profile_picture,
							hourly_rate: formData.hourly_rate,
							career: formData.career,
							language: formData.language,
							location: formData.location,
							education: formData.education
						}),
					});

					if (res.ok) {
						const data = await res.json();
						console.log("Perfil actualizado:", data);
						return { success: true, profile: data };
					} else if (res.status === 404) {
						const createRes = await fetch(`${BASE_URL}/freelancer/profile`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								user_id: userId,
								bio: formData.bio,
								profile_picture: formData.profile_picture,
								hourly_rate: formData.hourly_rate,
								career: formData.career,
								language: formData.language,
								location: formData.location,
								education: formData.education
							}),
						});

						const createData = await createRes.json();
						if (createRes.ok) {
							console.log("Perfil creado:", createData);
							return { success: true, profile: createData };
						} else {
							return { success: false, error: createData.msg };
						}
					} else {
						const errorData = await res.json();
						return { success: false, error: errorData.msg };
					}
				} catch (error) {
					console.error("Error en 	createOrUpdateProfile::", error);
					return { success: false, error: "Error de red" };
				}
			},

			uploadEmployerPicture: async (userId, pictureUrl) => {
				try {
					const res = await fetch(`${BASE_URL}/employer/profile/picture`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ user_id: userId, profile_picture: pictureUrl })
					});

					if (res.ok) {
						const data = await res.json();
						localStorage.setItem("profile_picture", pictureUrl);
						return { success: true, picture: pictureUrl };
					} else {
						return { success: false, error: "No se pudo actualizar la imagen" };
					}
				} catch (err) {
					console.error(err);
					return { success: false, error: "Error de conexión" };
				}
			},

			uploadFreelancerPicture: async (userId, pictureUrl) => {
				try {
					const res = await fetch(`${BASE_URL}/freelancer/profile/picture`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ user_id: userId, profile_picture: pictureUrl })
					});

					if (res.ok) {
						const data = await res.json();
						localStorage.setItem("profile_picture", pictureUrl);
						return { success: true, picture: pictureUrl };
					} else {
						return { success: false, error: "No se pudo actualizar la imagen" };
					}
				} catch (err) {
					console.error(err);
					return { success: false, error: "Error de conexión" };
				}
			},

			getSkills: async () => {
				try {
					const res = await fetch(`${BASE_URL}/skills`);
					const data = await res.json();
					setStore({ skills: data })

					if (res.ok) {
						return { success: true, skills: data };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al obtener skills" };
				}
			},


			addFreelancerSkills: async (userId, skillIds) => {
				try {
					const res = await fetch(`${BASE_URL}/freelancer/skills`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							user_id: userId,
							skill_ids: skillIds
						})
					});

					const data = await res.json();

					if (res.ok) {
						return { success: true };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al asignar skills" };
				}
			},


			clearFreelancerSkills: async (userId) => {
				try {
					const res = await fetch(`${BASE_URL}/freelancer/profile?user_id=${userId}`);
					const data = await res.json();

					if (!res.ok || !data.skills) {
						return { success: false, error: "No se pudieron obtener las skills actuales." };
					}

					const deleteRequests = data.skills.map(fs => {
						const skillId = fs.id || fs.skill?.id;
						if (skillId) {
							return fetch(`${BASE_URL}/freelancer/skills/${skillId}?user_id=${userId}`, {
								method: "DELETE"
							});
						}
						return null;
					}).filter(Boolean);

					await Promise.all(deleteRequests);

					return { success: true };
				} catch (error) {
					return { success: false, error: "Error al limpiar skills." };
				}
			},

			createOrUpdateEmployerProfile: async (userId, formData) => {
				try {
					const token = localStorage.getItem("token");
					const payload = {
						bio: formData.bio,
						profile_picture: formData.profile_picture,
						industry: formData.industry,
						location: formData.location,
						website: formData.website,
						phone: formData.phone,
					};
					let res = await fetch(`${BASE_URL}/employer/profile`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify(payload),
					});

					if (res.status === 404) {
						res = await fetch(`${BASE_URL}/employer/profile`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${token}`
							},
							body: JSON.stringify(payload),
						});
					}

					const data = await res.json();
					return res.ok
						? { success: true, profile: data }
						: { success: false, error: data.msg };

				} catch (err) {
					console.error("Error al crear o actualizar perfil:", err);
					return { success: false, error: "Error de red" };
				}

			},

			getEmployerStats: async () => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/employer/stats`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await res.json();
					if (res.ok) {
						return { success: true, stats: data };
					} else {
						console.error("getEmployerStats error:", data.msg);
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("getEmployerStats network error:", error);
					return { success: false, error: error.message };
				}
			},

			getFreelancerStats: async () => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/freelancer/stats`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await res.json();
					if (res.ok) {
						return { success: true, stats: data };
					} else {
						console.error("getFreelancerStats error:", data.msg);
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("getFreelancerStats network error:", error);
					return { success: false, error: error.message };
				}
			},

			getFreelancerSentProposals: async (userId) => {
				try {
					const token = localStorage.getItem("token");
					const resp = await fetch(
						`${BASE_URL}/freelancer/${userId}/proposals`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`
							}
						}
					);
					const json = await resp.json();
					return { success: resp.ok, proposals: json.proposals || [] };
				} catch (error) {
					console.error("Error trayendo solicitudes enviadas:", error);
					return { success: false, proposals: [] };
				}
			},

			getEmployerProjects: async () => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/employer/projects`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await res.json();
					if (res.ok) {
						return { success: true, projects: data.offers };
					} else {
						console.error("getEmployerProjects error:", data.msg);
						return { success: false, error: data.msg };
					}
				} catch (error) {
					console.error("getEmployerProjects network error:", error);
					return { success: false, error: error.message };
				}
			},

			// deleteProject: async (projectId) => {
			// 	try {
			// 		const token = localStorage.getItem("token");
			// 		const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
			// 			method: "DELETE",
			// 			headers: {
			// 				"Authorization": `Bearer ${token}`
			// 			}
			// 		});
			// 		if (res.status === 204) {
			// 			return { success: true };
			// 		} else {
			// 			const data = await res.json();
			// 			return { success: false, error: data.msg };
			// 		}
			// 	} catch (error) {
			// 		console.error("deleteProject network error:", error);
			// 		return { success: false, error: error.message };
			// 	}
			// },
			deleteProject: async (projectId) => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					if (res.status === 204) {
						const updatedProjects = getStore().projects.filter(p => p.id !== projectId);
						setStore({ projects: updatedProjects });

						return { success: true };
					} else {
						const contentType = res.headers.get("content-type");
						if (contentType && contentType.includes("application/json")) {
							const data = await res.json();
							return { success: false, error: data.msg || "Error desconocido" };
						} else {
							const text = await res.text();
							return { success: false, error: text };
						}
					}
				} catch (error) {
					console.error("deleteProject network error:", error);
					return { success: false, error: error.message };
				}
			},


			// getUsers: async () => {    // Codigo que ya estaba (para hacer funcionar el dashboard)
			// 	try {
			// 		const res = await fetch(`${BASE_URL}/admin/users`)
			// 		const data = await res.json();
			// 		setStore({ user: data });
			// 	} catch (error) {
			// 		console.error(error)
			// 	}
			// },

			getUsers: async () => {    // Codigo nuevo (para hacer funcionar el map de admin)
				try {
					const res = await fetch(`${BASE_URL}/admin/users`);
					const data = await res.json();
					setStore({ users: data });
					return data; // Use 'users' instead of 'user' (es la unica diferencia entre ambos codigos ni idea de porque el resultado cambia)
				} catch (error) {
					console.error(error);
				}
			},


			getProjects: async () => {
				try {
					const res = await fetch(`${BASE_URL}/projects`)
					const data = await res.json();
					setStore({ projects: data });
				} catch (error) {
					console.error(error)
				}
			},

			getFreelancerCompletedProposals: async (fid) => {
				const resp = await fetch(`${BASE_URL}/freelancer/${fid}/completed-proposals`, {
					headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
				});
				const data = await resp.json();
				return { success: resp.ok, proposals: data.proposals, msg: data.msg };
			},

			createReview: async (payload) => {
				try {
					const resp = await fetch(`${BASE_URL}/reviews`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
						body: JSON.stringify(payload),
					});
					const data = await resp.json();
					if (resp.ok) {
						// devolvemos también el nuevo promedio para actualizar UI
						return { success: true, data, msg: data.msg };
					} else {
						return { success: false, msg: data.msg || "Error al crear review" };
					}
				} catch (error) {
					console.error("Error en createReview:", error);
					return { success: false, msg: "Error de red al crear review" };
				}
			},


			setSearchQuery: (query) => {
				setStore({ searchQuery: query });
			},

			searchBySkill: async (skillName) => {
				try {
					const res = await fetch(`${BASE_URL}/search/freelancers?skill=${encodeURIComponent(skillName)}`);
					const data = await res.json();

					if (res.ok) {
						setStore({
							searchResults: {
								freelancers: data.freelancers || [],
								projects: data.projects || [],
							}
						});

						return { success: true };
					} else {
						return { success: false, error: data.msg };
					}
				} catch (error) {
					return { success: false, error: "Error al buscar skill" };
				}
			},


			dashboardFilterBy: (category, rating, location, hourlyRate, skills) => {
				setStore({
					filters:
					{
						category: category,
						rating: rating,
						location: location,
						hourlyRate: hourlyRate,
						skills: skills
					}
				})
			},

			deleteUser: async (userId) => {
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					if (res.status === 204) {
						const updatedUsers = getStore().users.filter(user => user.id !== userId);
						setStore({ users: updatedUsers });
						return { success: true };
					} else {
						const contentType = res.headers.get("content-type");
						if (contentType && contentType.includes("application/json")) {
							const data = await res.json();
							return { success: false, error: data.msg || "Error desconocido" };
						} else {
							const text = await res.text();
							return { success: false, error: text };
						}
					}
				} catch (error) {
					console.error("Error deleting user:", error);
					return { success: false, error: error.message };
				}
			},

			getContacts: async () => {
				try {
					const userId = localStorage.getItem("user_id");
					if (!userId) {
						throw new Error("User ID is missing.");
					}
					const res = await fetch(`${BASE_URL}/contacts?user_id=${userId}`);
					if (!res.ok) {
						throw new Error("Failed to fetch contacts.");
					}
					const data = await res.json();
					const store = getStore();
					setStore({
						...store,
						contacts: data.contacts,
					});
				} catch (error) {
					console.error("Error al obtener los contactos:", error);
				}
			},

			addNewContact: async (contactId) => {
				try {
					const token = localStorage.getItem("token");
					const userId = localStorage.getItem("user_id");

					if (!token) {
						return { success: false, error: "Usuario no autenticado." };
					}


					if (contactId === userId) {
						return { success: false, error: "No puedes agregar a tu propio perfil como contacto." };
					}


					const store = getStore();
					const existingContact = store.contacts.find(contact => contact.id === contactId);

					if (existingContact) {
						return { success: false, error: "Este contacto ya está en tu lista." };
					}


					const res = await fetch(`${BASE_URL}/contacts`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({ contact_id: contactId }),
					});

					const data = await res.json();
					console.log("Contacto agregado:", data);

					if (res.ok) {
						return { success: true, message: data.message || "Contacto agregado correctamente." };
					} else {
						return { success: false, error: data.error || "Error al agregar el contacto." };
					}
				} catch (error) {
					console.error("Error al agregar el contacto:", error);
					return { success: false, error: "Error de red o del servidor." };
				}
			},











		}
	};
};

export default getState;
