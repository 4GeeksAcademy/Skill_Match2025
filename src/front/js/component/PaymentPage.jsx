import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import logo from "./../../../../public/stripe-logo.png";

const BASE_URL = process.env.BACKEND_URL || "https://miniature-winner-pjpvr464jvpx2rxw9-3001.app.github.dev/api";

const PaymentPage = () => {
    const { proposalId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);

    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [payLoading, setPayLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
        show: false,        // si se muestra o no
        type: "",           // 'success' | 'danger' | 'warning' ...
        message: ""         // texto a mostrar
    });

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const res = await fetch(`${BASE_URL}/proposals/${proposalId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setProposal(data);
                } else {
                    console.error("Error al cargar la propuesta:", data.msg);
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProposal();
    }, [proposalId]);

    useEffect(() => {
        if (!proposal) return;
        const createIntent = async () => {
            try {
                const res = await fetch(`${BASE_URL}/create-payment-intent`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({ proposal_id: proposalId })
                });
                const data = await res.json();
                if (res.ok) {
                    setClientSecret(data.client_secret);
                    setPaymentId(data.payment_id);
                } else {
                    console.error("Error creando payment intent:", data.error);
                }
            } catch (error) {
                console.error("Error de conexión al crear intent:", error);
            }
        };
        createIntent();
    }, [proposal, proposalId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setPayLoading(true);
        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement)
                }
            });

            if (error) {
                setAlertInfo({
                    show: true,
                    type: "danger",
                    message: "Error al procesar la tarjeta: " + error.message
                });
            } else if (paymentIntent?.status === "succeeded") {
                await fetch(`${BASE_URL}/payments/${paymentId}/complete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                setAlertInfo({
                    show: true,
                    type: "success",
                    message: "¡Pago exitoso y status actualizado!"
                });
                // opcional: redirige con un pequeño delay para que lean la alerta
                setTimeout(() => navigate("/employerProfile"), 5000);
            }
        } catch (err) {
            console.error(err);
            setAlertInfo({
                show: true,
                type: "danger",
                message: "Ocurrió un error inesperado."
            });
        } finally {
            setPayLoading(false);
        }
    };

    if (loading) {
        return <div className="container mt-5 text-center">Cargando detalles de pago...</div>;
    }
    if (!proposal) {
        return <div className="container mt-5 text-center">No se encontró la propuesta.</div>;
    }

    return (
        <div className="container mt-5">
            {alertInfo.show && (
                <div
                    className={`alert alert-${alertInfo.type} alert-dismissible fade show mx-auto`}
                    style={{ maxWidth: "600px" }}
                    role="alert"
                >
                    {alertInfo.message}
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setAlertInfo({ ...alertInfo, show: false })}
                    />
                </div>
            )}
            <h2 className="text-center mb-5">Resumen de Pago</h2>

            <div className="row gx-4">
                <div className="col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Proyecto</h5>
                            <p><strong>Título:</strong> {proposal.project?.title || "—"}</p>
                            <p><strong>Freelancer:</strong> {proposal.freelancer?.first_name} {proposal.freelancer?.last_name}</p>
                            <p><strong>Mensaje:</strong> {proposal.message}</p>
                            <p><strong>Presupuesto:</strong> ${proposal.proposed_budget}</p>
                            <p><strong>Estado:</strong> {proposal.status}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img src={logo} alt="Stripe" style={{ height: 40 }} />
                            </div>

                            {!clientSecret ? (
                                <p>Cargando formulario de pago…</p>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="card-number" className="form-label">Número de tarjeta</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="bi bi-credit-card fs-5 text-secondary"></i>
                                            </span>
                                            <div
                                                id="card-number"
                                                className="form-control border-start-0 p-2"
                                                style={{ minHeight: "48px" }}
                                            >
                                                <CardNumberElement
                                                    options={{
                                                        style: {
                                                            base: { fontSize: "16px", color: "#212529", "::placeholder": { color: "#6c757d" } },
                                                            invalid: { color: "#dc3545" }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row gx-3 mb-4">
                                        <div className="col">
                                            <label htmlFor="card-expiry" className="form-label">Válido hasta</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0">
                                                    <i className="bi bi-calendar2-range fs-5 text-secondary"></i>
                                                </span>
                                                <div
                                                    id="card-expiry"
                                                    className="form-control border-start-0 p-2"
                                                    style={{ minHeight: "48px" }}
                                                >
                                                    <CardExpiryElement
                                                        options={{
                                                            style: {
                                                                base: { fontSize: "16px", color: "#212529", "::placeholder": { color: "#6c757d" } },
                                                                invalid: { color: "#dc3545" }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="card-cvc" className="form-label">CVC</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0">
                                                    <i className="bi bi-lock fs-5 text-secondary"></i>
                                                </span>
                                                <div
                                                    id="card-cvc"
                                                    className="form-control border-start-0 p-2"
                                                    style={{ minHeight: "48px" }}
                                                >
                                                    <CardCvcElement
                                                        options={{
                                                            style: {
                                                                base: { fontSize: "16px", color: "#212529", "::placeholder": { color: "#6c757d" } },
                                                                invalid: { color: "#dc3545" }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success w-100 py-2"
                                        disabled={!stripe || payLoading}
                                    >
                                        {payLoading ? "Procesando…" : `Pagar $${proposal.proposed_budget}`}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
