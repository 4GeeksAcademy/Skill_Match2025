import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="footer-section bg-dark text-light py-4 mt-5">
            <div className="container">
                <div className="row align-items-center">
                    {/* Logo y nombre */}
                    <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
                        <h4 className="mb-0 text-white">SkillMatch</h4>
                        <small>Conectando talento y oportunidades</small>
                    </div>

                    {/* Menú de navegación */}
                    <div className="col-md-4 mb-3 mb-md-0">
                        <ul className="nav justify-content-center">
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/dashboardProjects">Proyectos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/dashboardFreelancer">Freelancers</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/admin">Admin</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Redes Sociales */}
                    <div className="col-md-4 text-center text-md-end">
                        <a href="#" className="text-light me-3">
                            <i className="fab fa-facebook fa-lg"></i>
                        </a>
                        <a href="#" className="text-light me-3">
                            <i className="fab fa-twitter fa-lg"></i>
                        </a>
                        <a href="#" className="text-light">
                            <i className="fab fa-linkedin fa-lg"></i>
                        </a>
                    </div>
                </div>

                <hr className="my-3" />

                {/* Derechos de autor */}
                <div className="text-center small">
                    © {new Date().getFullYear()} SkillMatch. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};
