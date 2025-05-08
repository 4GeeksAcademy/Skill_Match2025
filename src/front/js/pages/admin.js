import React from "react";
import { Link } from "react-router-dom";

export const Admin = () => {
    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="row border mt-5 mb-4 p-4 py-0" style={{width: "85rem"}}>
                <div className="col-8 pe-0">
                    <div>
                        <div className="text-center" style={{marginRight: "4rem"}}>
                            <h5 className="mt-3 mb-0">Bienvenido, Admin</h5>
                            <p className="opacity-75" style={{fontSize: "0.9rem"}}>Tu panel de administrador personal</p>
                        </div>
                    </div>
                    <div className="container-fluid row">
                        <div class="card text-bg-secondary mb-3 col-5" style={{maxWidth: ""}}>
                            <div class="card-body">
                                {/* <h5 class="card-title">Secondary card title</h5> */}
                                <div className="d-flex justify-content-between">
                                    <p class="card-text fs-4 ms-1 mt-1 mb-4">Perfil</p>
                                    <i class="fa-solid fa-gear fa-xl me-2" style={{marginTop: "1.4rem"}}></i>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <i class="fa-solid fa-circle-user fa-2xl mt-4" style={{fontSize: "5rem"}}></i>
                                </div>
                                <p className="text-center mt-5 me-1 mb-0 fs-5">Admin Name</p>
                                <p className="text-center opacity-50" style={{fontSize: "0.9rem"}}>Administrador</p>
                            </div>
                        </div>
                        <div className="ms-2 col-7 row">
                            <div class="card text-bg-secondary mb-3 col-5 ms-4" style={{marginRight: "0.8rem", height: "12.1rem"}}>
                                <div class="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    {/* <h5 class="card-title">Trabajos</h5> */}
                                    <div className="d-flex">
                                        <p class="card-text fs-1 ms-1 mb-0">3</p><p class="card-text ms-1 mt-4">Trabajos</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card text-bg-secondary mb-3 col-5 ms-4" style={{height: "12.1rem"}}>
                                <div class="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    {/* <h5 class="card-title">Usuarios</h5> */}
                                    <div className="d-flex">
                                        <p class="card-text fs-1 ms-1 mb-0">5</p><p class="card-text ms-1 mt-4">Usuarios</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card text-bg-secondary mb-3 col-11 ms-4 mt-1" style={{maxWidth: ""}}>
                                <div class="card-body p-0 ps-1 mt-1 ms-1">
                                    {/* <h5 class="card-title">Historial de Pagos</h5> */}
                                    <p class="card-text fs-4 ms-1 mt-3 mb-4">Historial de Pagos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div class="card text-bg-secondary mb-5 mt-3" style={{marginLeft: "0.7rem", marginRight: "3.3rem", height: "20rem"}}>
                            <div class="card-body">
                                <h5 class="card-title">Secondary card title</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4 border-start">
                    <div>
                        <div className="text-center" style={{marginLeft: "2rem"}}>
                            <h5 className="mt-4 mb-0">Lista de Reportes</h5>
                        </div>
                    </div>
                    <div className="ms-2">
                        <div class="card text-bg-secondary ms-4 mb-3" style={{height: "41.2rem", marginTop: "1.9rem"}}>
                            <div class="card-body">
                                <h5 class="card-title">Secondary card title</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}