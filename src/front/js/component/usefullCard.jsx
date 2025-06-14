import React from "react";
import { Link } from "react-router-dom";

export const UsefullCard = () => {
    return (
        <div>
            <div className="card mt-4 mt-1 shadow-sm border border-0 background" style={{maxWidth: "22rem"}}>
                    <div className="card-body">
                        <Link to={"/Contact"}><h5>Contactanos</h5></Link>
                        <Link to={"/PaymentHistory"}><h5 className="my-4">Historial de Pagos</h5></Link>
                    </div>
            </div>
        </div>
    );
};