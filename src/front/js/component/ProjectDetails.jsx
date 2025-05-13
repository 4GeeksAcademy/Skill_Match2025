import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const BASE_URL = process.env.BACKEND_URL || "https://miniature-winner-pjpvr464jvpx2rxw9-3001.app.github.dev/api";
        const res = await fetch(`${BASE_URL}/projects/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProject(data);
        } else {
          console.error("Error cargando proyecto", data.msg);
        }
      } catch (error) {
        console.error("Error al conectar con el backend", error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div className="text-center mt-5">Cargando proyecto...</div>;
  }

  const employer = project.employer_info;

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4" style={{ backgroundColor: "#f9f9f9" }}>
        <h2 className="fw-bold text-primary mb-3">{project.title}</h2>

        <div className="mb-3">
          <p className="text-dark">{project.description}</p>
        </div>

        {employer && (
          <div className="mb-3">
            <p className="text-muted mb-1">
              <strong>Publicado por:</strong> {employer.first_name} {employer.last_name}
            </p>
            <p className="text-muted mb-0">
              <strong>Email:</strong> {employer.email}
            </p>
          </div>
        )}

        <hr />

        <div className="row mb-3">
          <div className="col-md-4">
            <p><strong>Presupuesto:</strong> ${project.budget}</p>
          </div>
          <div className="col-md-4">
            <p><strong>Estado:</strong> {project.status}</p>
          </div>
          <div className="col-md-4">
            <p><strong>Fecha límite:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No especificada"}</p>
          </div>
        </div>

        <div className="mb-4">
          <strong>Habilidades requeridas:</strong>
          <div className="mt-2">
            {project.skills.length > 0 ? (
              project.skills.map((s, i) => (
                <span key={i} className="badge bg-dark text-light me-2 mb-1">{s.name}</span>
              ))
            ) : (
              <span className="text-muted">No especificadas</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 mt-4">
          <button className="btn btn-outline-primary px-4">Enviar mensaje</button>
          <button className="btn btn-secondary ms-auto" onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
