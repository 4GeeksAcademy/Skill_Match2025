import React from "react";

export const Admin = () => {
    return (
        <div className="container-fluid d-flex justify-content-center">
            <div className="row border mt-5 mb-4 p-4 py-0" style={{width: "85rem"}}>
                <div className="col-7 pe-0">
                    <div>
                        <div className="text-center" style={{marginRight: "4rem"}}>
                            <h5 className="mt-3 mb-0">Bienvenido, Admin</h5>
                            <p className="opacity-75" style={{fontSize: "0.9rem"}}>Tu panel de administrador personal</p>
                        </div>
                    </div>
                    <div className="container-fluid row">
                        <div className="card text-bg-secondary mb-3 me-4 col-5" style={{maxWidth: "16.5rem", maxHeight: "21.3rem"}}>
                            <div className="card-body">
                                {/* <h5 class="card-title">Secondary card title</h5> */}
                                <div className="d-flex justify-content-between">
                                    <p className="card-text fs-4 ms-1 mt-1 mb-4">Perfil</p>
                                    <i className="fa-solid fa-gear fa-xl me-2" style={{marginTop: "1.4rem"}}></i>
                                </div>
                                <div className="d-flex justify-content-center mt-5">
                                    <i className="fa-solid fa-circle-user fa-2xl mt-4" style={{fontSize: "5rem"}}></i>
                                </div>
                                <p className="text-center mt-5 me-1 mb-0 fs-5">Admin Name</p>
                                <p className="text-center opacity-50" style={{fontSize: "0.9rem"}}>Administrador</p>
                            </div>
                        </div>
                        <ul className="ms-2 col-7 row nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="card text-bg-secondary mb-3 col-5 ms-4 nav-item" role="presentation" style={{marginRight: "0.8rem", height: "12.1rem"}}>
                                <div className="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    {/* <h5 class="card-title">Trabajos</h5> */}
                                    <div className="d-flex">
                                        <p className="card-text fs-1 ms-1 mb-0">3</p><p class="card-text ms-1 mt-4">Trabajos</p>
                                    </div>
                                </div>
                                <button 
                                    className="nav-link active mb-2" 
                                    id="pills-projects-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#pills-projects" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="pills-projects" 
                                    aria-selected="true"
                                >
                                    Trabajos
                                </button>
                            </li>
                            <li className="card text-bg-secondary mb-3 col-5 ms-4 nav-item" role="presentation" style={{height: "12.1rem"}}>
                                <div className="card-body p-0 ps-1 pt-2 mt-1 ms-1">
                                    {/* <h5 class="card-title">Usuarios</h5> */}
                                    <div className="d-flex">
                                        <p className="card-text fs-1 ms-1 mb-0">5</p><p class="card-text ms-1 mt-4">Usuarios</p>
                                    </div>
                                </div>
                                <button 
                                    className="nav-link mb-2" 
                                    id="pills-users-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#pills-users" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="pills-users" 
                                    aria-selected="false"
                                >
                                    Usuarios
                                </button>
                            </li>
                            <li className="card text-bg-secondary mb-3 col-11 ms-4 mt-1 nav-item" role="presentation" style={{width: "23.1rem"}}>
                                <div className="card-body p-0 ps-1 mt-1 ms-1">
                                    {/* <h5 class="card-title">Historial de Pagos</h5> */}
                                    <p className="card-text fs-4 ms-1 mt-3 mb-4">Historial de Pagos</p>
                                </div>
                                <button 
                                    className="nav-link mb-1" 
                                    id="pills-pay-tab" 
                                    data-bs-toggle="pill" 
                                    data-bs-target="#pills-pay" 
                                    type="button" 
                                    role="tab" 
                                    aria-controls="pills-pay" 
                                    aria-selected="false"
                                >
                                    Historial
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <div className="card text-bg-secondary mb-5 mt-3" style={{marginLeft: "0.7rem", marginRight: "3.3rem", height: "20rem", maxWidth: "45rem"}}>
                            <div className="card-body">
                                <h5 className="card-title">Secondary card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-5 border-start">
                    <div>
                        <div className="text-center" style={{marginLeft: "2rem"}}>
                            <h5 className="mt-4 mb-0">Menu Secundario</h5>
                        </div>
                    </div>
                    <div className="tab-content" id="pills-tabContent" style={{marginTop: "1.8rem"}}>
                        <div 
                            className="tab-pane fade show active" 
                            id="pills-projects" 
                            role="tabpanel" 
                            aria-labelledby="pills-projects-tab" 
                            tabindex="0"
                            style={{marginLeft: "2.3rem"}}
                        >
                            <div className="row">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Trabajo 1</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-danger mb-4 col-2"><i class="fa-solid fa-trash fa-2xl"></i></button>
                            </div>
                            <div className="row">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Trabajo 2</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-danger mb-4 col-2"><i class="fa-solid fa-trash fa-2xl"></i></button>
                            </div>
                            <div className="row">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Trabajo 3</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-danger mb-4 col-2"><i class="fa-solid fa-trash fa-2xl"></i></button>
                            </div>
                            <div className="row">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Trabajo 4</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-danger mb-4 col-2"><i class="fa-solid fa-trash fa-2xl"></i></button>
                            </div>
                        </div>
                        <div 
                            className="tab-pane fade" 
                            id="pills-users" 
                            role="tabpanel" 
                            aria-labelledby="pills-users-tab" 
                            tabindex="0"
                            style={{marginLeft: "2.5rem"}}
                        >
                            <div className="d-flex">
                                <div class="card text-bg-secondary mb-4 col-10" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">First User</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem", marginBottom: "0.8rem"}}><i class="fa-solid fa-pause fa-2xl"></i></button>
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem"}}><i class="fa-solid fa-trash fa-2xl"></i></button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div class="card text-bg-secondary mb-4 col-10" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">First User</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem", marginBottom: "0.8rem"}}><i class="fa-solid fa-pause fa-2xl"></i></button>
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem"}}><i class="fa-solid fa-trash fa-2xl"></i></button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div class="card text-bg-secondary mb-4 col-10" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">First User</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem", marginBottom: "0.8rem"}}><i class="fa-solid fa-pause fa-2xl"></i></button>
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem"}}><i class="fa-solid fa-trash fa-2xl"></i></button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div class="card text-bg-secondary mb-4 col-10" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">First User</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem", marginBottom: "0.8rem"}}><i class="fa-solid fa-pause fa-2xl"></i></button>
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem"}}><i class="fa-solid fa-trash fa-2xl"></i></button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div class="card text-bg-secondary mb-4 col-10" style={{width: ""}}>
                                    <div class="card-body">
                                        <h5 class="card-title">First User</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                                <div className="d-flex flex-column ms-3">
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem", marginBottom: "0.8rem"}}><i class="fa-solid fa-pause fa-2xl"></i></button>
                                    <button type="button" class="btn btn-outline-danger" style={{height: "3.2rem"}}><i class="fa-solid fa-trash fa-2xl"></i></button>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="tab-pane fade" 
                            id="pills-pay" 
                            role="tabpanel" 
                            aria-labelledby="pills-pay-tab" 
                            tabindex="0"
                        >
                            <div className="row d-flex justify-content-center">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: "29rem"}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Factura 1</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: "29rem"}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Factura 2</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: "29rem"}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Factura 3</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: "29rem"}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Factura 4</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div class="card text-bg-secondary ms-3 mb-4 col-9" style={{width: "29rem"}}>
                                    <div class="card-body">
                                        <h5 class="card-title">Factura 5</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="ms-2">
                        <div class="card text-bg-secondary ms-4 mb-3" style={{height: "41.2rem", marginTop: "1.9rem"}}>
                            <div class="card-body">
                                <h5 class="card-title">Secondary card title</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}