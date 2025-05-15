import React from 'react';

export const About = () => {
    return (
        <div className="container mt-5 font">
            <div className="text-center border bg-dark p-5 rounded-pill mb-5">
                <h1 className="display-4 text-light mb-2">Acerca de SkillMatch</h1>
                <p className="lead text-light fs-5">Conectando talento con oportunidad.</p>
            </div>
            <div className="row text-center mb-5" style={{marginTop: "5rem"}}>
                <div className="col-md-6 mb-4 mb-md-0">
                    <h3 className="display-5">Nuestra Misión</h3>
                    <p className="" style={{fontSize: "1.1rem"}}>
                        En SkillMatch, creemos que el talento no tiene fronteras. Nuestra misión es construir un puente entre freelancers altamente capacitados y empleadores visionarios, creando oportunidades reales para ambos lados del mercado laboral.
                    </p>
                </div>
                <div className="col-md-6">
                    <h3 className="display-5">¿Qué es SkillMatch?</h3>
                    <p className="" style={{fontSize: "1.1rem"}}>
                        SkillMatch es una plataforma intuitiva que permite a empleadores publicar proyectos y a freelancers ofrecer sus servicios en distintas áreas como desarrollo web, diseño gráfico, redacción, marketing y más. Facilitamos el proceso de conexión, comunicación y colaboración para que cada proyecto sea un éxito.
                    </p>
                </div>
            </div>
            <div className="row text-center">
                <div className="col-md-6 mb-4 mb-md-0">
                    <h3 className="display-5">Para Freelancers</h3>
                    <p className="" style={{fontSize: "1.1rem"}}>
                        Crea tu perfil, muestra tus habilidades, y encuentra proyectos que se ajusten a tu experiencia y pasión. Nuestra comunidad te permite crecer profesionalmente y construir relaciones laborales duraderas.
                    </p>
                </div>
                <div className="col-md-6">
                    <h3 className="display-5">Para Empleadores</h3>
                    <p className="" style={{fontSize: "1.1rem"}}>
                        Publica ofertas de trabajo, descubre profesionales calificados y lleva tus proyectos al siguiente nivel. SkillMatch te ayuda a encontrar el freelancer ideal en cuestión de minutos.
                    </p>
                </div>
            </div>
            <div className="text-center pb-2 px-5" style={{marginTop: "4rem"}}>
                <h4 className="display-6">Únete a la comunidad SkillMatch</h4>
                <p className="fs-5">
                    Ya sea que estés buscando tu próximo desafío o al profesional perfecto, SkillMatch es el lugar para comenzar. Nuestro objetivo es facilitar el encuentro entre el talento y la necesidad.
                </p>
            </div>
        </div>
    );
};