import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, User, Profile, Skill, FreelancerSkill, Project, Proposal, Review, Payment, ProjectSkill, Contact
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_cors import cross_origin
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import func
import stripe, json
from dotenv import load_dotenv
from datetime import datetime  

load_dotenv()

# --- Configuracion de Stripe ---
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

routes = Blueprint('routes', __name__)
api = Blueprint('api', __name__)

bcrypt = Bcrypt()


@routes.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    first_name=data.get('first_name')
    last_name=data.get('last_name')

    if not email or not password or role not in ['freelancer', 'employer','admin']:
        return jsonify({"msg": "Rellena todos los campos"}), 400
    if not first_name or not last_name:
        return jsonify({"msg": "Nombres y apellidos son obligatorios"}), 400

    

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({'msg': 'este email ya esta registrado'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password=password_hash, role=role,first_name=first_name, last_name= last_name)

    db.session.add(new_user)
    db.session.commit()

    user_id = new_user.id
    access_token = create_access_token(identity=str(user_id))

    return jsonify({
    "msg": "Usuario registrado exitosamente",
    "user_id": new_user.id,
    "email": new_user.email,
    "role": new_user.role,
    "access_token": access_token
}), 201


@routes.route('/login', methods=['POST'])
def login():

    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({'msg': 'error en email o password'}), 400

    current_user = User.query.filter_by(email=email).first()

    if not current_user:
        return jsonify({'msg': 'usuario no existe'}), 404

    pass_db = current_user.password
    true_or_false = bcrypt.check_password_hash(pass_db, password)

    if true_or_false:

        user_id = current_user.id
        access_token = create_access_token(
            identity=str(user_id))

        return jsonify({
            "msg": "Sesion iniciada",
            "access_token": access_token,
            "email": email,
            "role": current_user.role,
            "user_id": current_user.id
        }), 200

    else:
        return jsonify({"msg": "Usuario o contraseña invalido."}), 401


@routes.route('/private', methods=["GET"])
@jwt_required()
def home():

    current_user_id = get_jwt_identity()

    if current_user_id:
        users = User.query.all()
        user_list = []
        for user in users:
            user_act = {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active
            }
            user_list.append(user_act)

        return jsonify({"users": user_list}), 200

    else:
        return jsonify({"Error": "Error al iniciar sesion"}), 401

 # generar route para obtener el usuario todos los usuarios


# --- USUARIO ACTUAL ---

@routes.route('/users/me', methods=['GET'])
def get_current_user():
    user_id = request.args.get('user_id')

    if user_id:
        user = User.query.get(user_id)
    else:
        user = User.query.first()
        if not user:
            user = User(email="dev@example.com",
                        password=generate_password_hash("dev123"), role="admin")
            db.session.add(user)
            db.session.commit()

    return jsonify(user.serialize())


# --- PERFIL FREELANCER ---

@routes.route('/freelancer/profile', methods=['GET'])
def get_freelancer_profile():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"msg": "No se proporcionó user_id"}), 400
    profile = Profile.query.options(
        joinedload(Profile.skills).joinedload(FreelancerSkill.skill),
        joinedload(Profile.user)
    ).filter_by(user_id=user_id).first()


    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    user = profile.user  # relación a User

    freelancer_data = {
        "id": profile.id,
        "bio": profile.bio,
        "profile_picture": profile.profile_picture,
        "hourly_rate": profile.hourly_rate,
        "rating": profile.rating,
        "user": {
            "id": user.id if user else None,
            "first_name": user.first_name if user else None,
            "last_name": user.last_name if user else None,
            "email": user.email if user else None
        },
        "career": profile.career,
        "language": profile.language,
        "location": profile.location,
        "education": profile.education,
        "skills": [],
        "contacts": []
    }

    for fs in profile.skills:
        if fs.skill:
            freelancer_data["skills"].append({
                "id": fs.skill.id,
                "name": fs.skill.name
            })

    return jsonify(freelancer_data), 200


@routes.route('/freelancer/profile', methods=['POST'])
def create_profile():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        user = User.query.filter_by(role='freelancer').first()
        if not user:
            user = User(email="freelancer@example.com",
                        password=generate_password_hash("dev123"), role="freelancer")
            db.session.add(user)
            db.session.commit()
        user_id = user.id

    profile = Profile.query.filter_by(user_id=user_id).first()
    if profile:
        profile.bio = data.get('bio', profile.bio)
        profile.profile_picture = data.get(
            'profile_picture', profile.profile_picture)
        profile.hourly_rate = data.get('hourly_rate', profile.hourly_rate)
        profile.rating = data.get('rating', profile.rating)
        profile.career = data.get('career', profile.career)
        profile.language = data.get('language', profile.language)
        profile.location = data.get('location', profile.location)
        profile.education = data.get('education', profile.education)
    else:
        profile = Profile(
            user_id=user_id,
            bio=data.get('bio'),
            profile_picture=data.get('profile_picture'),
            hourly_rate=data.get('hourly_rate'),
            rating=data.get('rating', 0),
            career=data.get('career'),
            language=data.get('language'),
            location=data.get('location'),
            education=data.get('education')
        )
        db.session.add(profile)

    db.session.commit()
    return jsonify(profile.serialize()), 201



@routes.route('/freelancer/profile', methods=['PATCH'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        user = User.query.filter_by(role='freelancer').first()
        if not user:
            return jsonify({"msg": "No hay usuarios freelancer"}), 404
        user_id = user.id

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    profile.bio = data.get('bio', profile.bio)
    profile.hourly_rate = data.get('hourly_rate', profile.hourly_rate)
    profile.profile_picture = data.get(
        'profile_picture', profile.profile_picture)
    profile.career = data.get('career', profile.career)
    profile.language = data.get('language', profile.language)
    profile.location = data.get('location', profile.location)
    profile.education = data.get('education', profile.education)
    db.session.commit()
    return jsonify(profile.serialize())


# --- SKILLS ---

@routes.route('/skills', methods=['GET'])
def list_skills():
    skills = Skill.query.all()

    if not skills:
        default_skills = [
            "JavaScript", "Python", "React", "Node.js",
            "Angular", "Vue.js", "Django", "Flask",
            "SQL", "MongoDB", "AWS", "Docker"
        ]
        for skill_name in default_skills:
            skill = Skill(name=skill_name)
            db.session.add(skill)
        db.session.commit()
        skills = Skill.query.all()

    return jsonify([skill.serialize() for skill in skills])


@routes.route('/skills', methods=['POST'])
def create_skill():
    data = request.json
    skill = Skill(name=data.get('name'))
    db.session.add(skill)
    db.session.commit()
    return jsonify(skill.serialize()), 201

@routes.route('/skills/reset-and-seed', methods=['POST'])
def reset_and_seed_skills():
    # 1. Eliminar relaciones con freelancers
    db.session.query(FreelancerSkill).delete()
    db.session.commit()

    # 2. Eliminar skills existentes
    db.session.query(Skill).delete()
    db.session.commit()

    # 3. Lista nueva de skills
    new_skills = [
        "JavaScript", "Python", "React", "Vue.js", "Angular", "Node.js", "Django",
        "Flask", "SQL", "MongoDB", "TypeScript", "PostgreSQL", "MySQL", "Express.js",
        "Java", "C#", "PHP", "Laravel", "Ruby on Rails", "Swift", "Kotlin", "AWS",
        "Docker", "Kubernetes", "Git", "CI/CD", "Figma", "Adobe XD", "UI/UX Design",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Science",
        "Data Analysis", "Web Scraping", "Next.js", "Nuxt.js", "Firebase", "Redux",
        "Tailwind CSS", "Bootstrap", "GraphQL", "REST APIs", "Jest", "Cypress",
        "Selenium", "Scrum", "Agile", "Trello", "Notion", "WordPress", "Shopify"
    ]

    # 4. Insertarlas
    for name in new_skills:
        db.session.add(Skill(name=name))

    db.session.commit()

    return jsonify({"msg": f"{len(new_skills)} skills cargadas exitosamente"}), 200



@routes.route('/freelancer/skills', methods=['POST'])
def add_freelancer_skills():
    data = request.json
    user_id = data.get('user_id')
    skill_ids = data.get('skill_ids', [])

    if not user_id:
        user = User.query.filter_by(role='freelancer').first()
        if not user:
            user = User(email="freelancer@example.com",
                        password=generate_password_hash("dev123"), role="freelancer")
            db.session.add(user)
            db.session.commit()
        user_id = user.id

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = Profile(
            user_id=user_id,
            bio="Perfil de desarrollo para pruebas",
            profile_picture="https://via.placeholder.com/150",
            hourly_rate=25.0,
            rating=4.5
        )
        db.session.add(profile)
        db.session.commit()

    for skill_id in skill_ids:
        existing = FreelancerSkill.query.filter_by(
            profile_id=profile.id, skill_id=skill_id).first()
        if not existing:
            fs = FreelancerSkill(profile_id=profile.id, skill_id=skill_id)
            db.session.add(fs)

    db.session.commit()
    return jsonify({"msg": "Skills agregadas", "profile_id": profile.id, "skill_ids": skill_ids}), 201


@routes.route('/freelancer/skills/<int:skill_id>', methods=['DELETE'])
def remove_freelancer_skill(skill_id):
    user_id = request.args.get('user_id')

    if not user_id:
        user = User.query.filter_by(role='freelancer').first()
        if not user:
            return jsonify({"msg": "No hay usuarios freelancer"}), 404
        user_id = user.id

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    fs = FreelancerSkill.query.filter_by(
        profile_id=profile.id, skill_id=skill_id).first()
    if fs:
        db.session.delete(fs)
        db.session.commit()
        return jsonify({"msg": "Skill eliminada"}), 200
    return jsonify({"msg": "Skill no encontrada"}), 404


# --- PROJECTS ---

@routes.route('/projects', methods=['GET'])
def get_all_projects():
    projects = Project.query.filter(Project.status != 'cancelled').all()
    

    if not projects:
        employer = User.query.filter_by(role='employer').first()
        if not employer:
            employer = User(email="employer@example.com",
                            password=generate_password_hash("dev123"), role="employer")
            db.session.add(employer)
            db.session.commit()

        example_projects = []

        for p_data in example_projects:
            deadline = datetime.strptime(p_data["deadline"], "%Y-%m-%d") 
            project = Project(
                employer_id=employer.id,
                title=p_data["title"],
                description=p_data["description"],
                category=p_data["category"],
                budget=p_data["budget"],
                 deadline=deadline,
                status=p_data["status"]
            )
            db.session.add(project)

        db.session.commit()
        projects = Project.query.filter(Project.status != 'cancelled').all()

    return jsonify([p.serialize() for p in projects])


@routes.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    employer = User.query.get(current_user_id)
    if not employer or employer.role != "employer":
        return jsonify({"msg": "Solo los empleadores pueden crear proyectos."}), 403

    deadline_str = data.get('deadline')
    deadline = None
    if deadline_str:
        try:
            from datetime import datetime
            deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"msg": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

    # Crea el proyecto
    project = Project(
        employer_id=current_user_id,
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        budget=data.get('budget'),
        deadline=deadline,
        location=data.get('location'),
        status="open"
    )

    db.session.add(project)
    db.session.flush()  # ← Necesario para obtener el ID antes de commit

    # Relacionar skills si vienen en el payload
    skill_ids = data.get("skills", [])
    print("Skill IDs recibidos:", skill_ids)  # ← DEBUG

    for skill_id in skill_ids:
        print(f"Agregando skill_id {skill_id} al proyecto {project.id}")  # ← DEBUG
        project_skill = ProjectSkill(project_id=project.id, skill_id=skill_id)
        db.session.add(project_skill)



    db.session.commit()
    return jsonify(project.serialize()), 201


@routes.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user = int(get_jwt_identity())
    project = Project.query.get(project_id)
    print(">>> get_jwt_identity():", current_user, type(current_user))
    print(">>> project.employer_id:", project.employer_id, type(project.employer_id))

    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404


    project.status = 'cancelled'
    db.session.commit()
    return '', 204


@routes.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = Project.query.get(id)
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404
    return jsonify(project.serialize())

@routes.route('/proposals/<int:proposal_id>', methods=['GET'])
@jwt_required()
def get_proposal_by_id(proposal_id):
    proposal = Proposal.query.get(proposal_id)

    if not proposal:
        return jsonify({"msg": "Propuesta no encontrada."}), 404

    return jsonify(proposal.serialize()), 200


# --- PROPOSALS ---

@routes.route('/projects/<int:project_id>/proposals', methods=['POST'])
def submit_proposal(project_id):
    data = request.json
    freelancer_id = data.get('freelancer_id')

    if not freelancer_id:
        freelancer = User.query.filter_by(role='freelancer').first()
        if not freelancer:
            freelancer = User(email="freelancer@example.com",
                              password=generate_password_hash("dev123"), role="freelancer")
            db.session.add(freelancer)
            db.session.commit()
        freelancer_id = freelancer.id

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404

    proposal = Proposal(
        project_id=project_id,
        freelancer_id=freelancer_id,
        message=data.get('message'),
        proposed_budget=data.get('proposed_budget')
    )
    db.session.add(proposal)
    db.session.commit()
    return jsonify(proposal.serialize()), 201


@routes.route('/projects/<int:project_id>/proposals', methods=['GET'])
def list_proposals_for_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404

    return jsonify([p.serialize() for p in project.proposals])


@routes.route('/employer/<int:employer_id>/proposals', methods=['GET'])
@jwt_required()
def get_employer_proposals(employer_id):
    projects = Project.query.filter_by(employer_id=employer_id).all()

    proposals = []
    for project in projects:
        for proposal in project.proposals:
            proposals.append(proposal.serialize())

    return jsonify(proposals), 200


@routes.route('/freelancer/proposals', methods=['GET'])
def get_my_proposals():
    freelancer_id = request.args.get('freelancer_id')
    if not freelancer_id:
        freelancer = User.query.filter_by(role='freelancer').first()
        if not freelancer:
            return jsonify([])
        freelancer_id = freelancer.id

    proposals = Proposal.query.filter_by(freelancer_id=freelancer_id).all()
    return jsonify([p.serialize() for p in proposals])


# --- ADMIN ---

@routes.route('/admin/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users])


# --- STRIPE ---

@routes.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = request.json
        proposal_id = data.get('proposal_id')

        proposal = Proposal.query.get(proposal_id)
        if not proposal:
            return jsonify({"error": "Proposal not found"}), 404

        # Crea un Pago en Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(proposal.proposed_budget * 100),
            currency='usd',
            payment_method_types=["card"],
        )

        # Guarda el intento en tu base de datos (opcional)
        payment = Payment(
            proposal_id=proposal_id,
            amount=proposal.proposed_budget,
            status="pending"
        )
        db.session.add(payment)
        db.session.commit()

        return jsonify({
            "client_secret": intent.client_secret,
            "payment_id": payment.id
        }), 200

    except Exception as e:
        return jsonify(error=str(e)), 500
    

@routes.route('/payments/<int:payment_id>/complete', methods=['POST'])
@jwt_required()
def complete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"error": "Pago no encontrado"}), 404

    payment.status = "completed"
    proposal = payment.proposal
    proposal.status = "in_progress"  # Cambiado a in_progress para indicar que el trabajo está en curso
    project = proposal.project
    project.status = "in_progress"  # Cambiado a in_progress para indicar que el trabajo está en curso

    db.session.commit()
    return jsonify(payment.serialize()), 200
    

@routes.route('/employer/profile', methods=['GET'])
def get_employer_profile():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"msg": "No se proporcionó user_id"}), 400

    profile = Profile.query.options(joinedload(Profile.user)).filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    return jsonify({
        "id": profile.id,
        "bio": profile.bio,
        "profile_picture": profile.profile_picture,
        "industry": profile.industry,
        "location": profile.location,
        "website": profile.website,
        "phone": profile.phone,
        "user": {
            "first_name": profile.user.first_name,
            "last_name": profile.user.last_name,
            "email": profile.user.email
        }
    }), 200


@routes.route('/employer/profile', methods=['POST'])
@jwt_required()
def create_employer_profile():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    # No permitimos crear si ya existe
    if Profile.query.filter_by(user_id=user_id).first():
        return jsonify({"msg": "El perfil ya existe"}), 400

    profile = Profile(
        user_id= user_id,
        bio= data.get('bio'),
        profile_picture= data.get('profile_picture'),
        industry= data.get('industry'),
        location= data.get('location'),
        website= data.get('website'),
        phone= data.get('phone'),
        rating= 0
    )

    db.session.add(profile)
    db.session.commit()
    return jsonify(profile.serialize()), 201


@routes.route('/employer/profile', methods=['PATCH'])
@jwt_required()
def update_employer_profile():
    data    = request.get_json()
    user_id = int(get_jwt_identity())

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    profile.bio             = data.get('bio',             profile.bio)
    profile.profile_picture = data.get('profile_picture', profile.profile_picture)
    profile.industry        = data.get('industry',        profile.industry)
    profile.location        = data.get('location',        profile.location)
    profile.website         = data.get('website',         profile.website)
    profile.phone           = data.get('phone',           profile.phone)

    db.session.commit()
    return jsonify(profile.serialize()), 200


@routes.route('/employer/profile/picture', methods=['PATCH'])
def update_employer_picture():
    data = request.json
    user_id = data.get("user_id")
    picture_url = data.get("profile_picture")

    if not user_id or not picture_url:
        return jsonify({"msg": "Faltan datos"}), 400

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    profile.profile_picture = picture_url
    db.session.commit()

    return jsonify({ "success": True, "picture": picture_url }), 200

@routes.route('/freelancer/profile/picture', methods=['PATCH'])
def update_freelancer_picture():
    data = request.json
    user_id = data.get("user_id")
    picture_url = data.get("profile_picture")

    if not user_id or not picture_url:
        return jsonify({"msg": "Faltan datos"}), 400

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"msg": "Perfil no encontrado"}), 404

    profile.profile_picture = picture_url
    db.session.commit()

    return jsonify({ "success": True, "picture": picture_url }), 200


@routes.route('/employer/stats', methods=['GET'])
@jwt_required()
def get_employer_stats():
    user_id = int(get_jwt_identity())
    offers     = Project.query.filter_by(employer_id=user_id).count()
    proposals  = Proposal.query.join(Project).filter(Project.employer_id==user_id).count()
    completed  = Project.query.filter_by(employer_id=user_id, status="completed").count()
    avg_rating = db.session.query(func.avg(Profile.rating)).filter(Profile.user_id==user_id).scalar() or 0
    return jsonify({
      "offers": offers,
      "proposals": proposals,
      "completed": completed,
      "rating": round(avg_rating,2)
    }), 200


@routes.route('/employer/projects', methods=['GET'])
@jwt_required()
def get_employer_projects():
    user_id = int(get_jwt_identity())
    projects = Project.query \
        .filter(Project.employer_id == user_id, Project.status != 'cancelled') \
        .all()
    data = []
    for p in projects:
        count = Proposal.query.filter_by(project_id=p.id).count()
        data.append({
          "id": p.id,
          "title": p.title,
          "budget": p.budget,
          "created_at": p.created_at.isoformat(),
          "proposals_count": count
        })
    return jsonify({ "offers": data }), 200

@routes.route("/search/freelancers", methods=["GET"])
def search_freelancers_by_skill():
    skill_names = request.args.get("skill", "").split(",")
    if not skill_names:
        return jsonify({"msg": "Skill no proporcionada"}), 400

    skills = Skill.query.filter(Skill.name.in_(skill_names)).all()
    if not skills:
        return jsonify({"freelancers": [], "projects": []}), 200

    skill_ids = [s.id for s in skills]

    # ---------- FREELANCERS ----------
    freelancer_skills = FreelancerSkill.query.filter(FreelancerSkill.skill_id.in_(skill_ids)).all()
    profile_ids = list(set(fs.profile_id for fs in freelancer_skills))

    profiles = Profile.query.filter(Profile.id.in_(profile_ids)).options(
        joinedload(Profile.skills).joinedload(FreelancerSkill.skill),
        joinedload(Profile.user)
    ).all()

    freelancer_results = []
    for profile in profiles:
        skills = [
            {"id": fs.skill.id, "name": fs.skill.name}
            for fs in profile.skills if fs.skill
        ]
        freelancer_results.append({
            "id": profile.id,
            "bio": profile.bio,
            "hourly_rate": profile.hourly_rate,
            "profile_picture": profile.profile_picture,
            "rating": profile.rating,
            "user": {
                "id": profile.user.id,
                "first_name": profile.user.first_name,
                "last_name": profile.user.last_name,
                "email": profile.user.email
            },
            "skills": skills
        })

    # ---------- PROJECTS ----------
    project_skills = ProjectSkill.query.filter(ProjectSkill.skill_id.in_(skill_ids)).all()
    project_ids = list(set(ps.project_id for ps in project_skills))

    projects = Project.query.filter(Project.id.in_(project_ids)).options(
        joinedload(Project.skills).joinedload(ProjectSkill.skill),
        joinedload(Project.employer)
    ).all()

    project_results = [p.serialize() for p in projects]

    return jsonify({
        "freelancers": freelancer_results,
        "projects": project_results
    }), 200



@routes.route('/employer/completed-projects', methods=['GET'])
@jwt_required()
def get_employer_completed_projects():
    user_id = int(get_jwt_identity())

    completed_projects = (
        db.session.query(Project)
        .join(Proposal, Proposal.project_id == Project.id)
        .join(Payment, Payment.proposal_id == Proposal.id)
        .filter(
            Project.employer_id == user_id,
            Payment.status == "completed"
        )
        .all()
    )

    result = [p.serialize_basic() for p in completed_projects]
    return jsonify(result), 200


def recalculate_profile_rating(user_id: int):
    avg = (
        db.session.query(func.avg(Review.rating))
        .filter(Review.reviewee_id == user_id)
        .scalar()
        or 0)
    
    profile = Profile.query.filter_by(user_id=user_id).first()
    if profile:
        profile.rating = float(avg)


# --- REVIEWS ---
@routes.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    data = request.get_json()
    reviewer_id = int(get_jwt_identity())

    # 1) Valida que existe la propuesta
    proposal = Proposal.query.get(data.get('proposal_id'))
    if not proposal:
        return jsonify({"msg": "Propuesta no encontrada"}), 404

    # 2) Valida que el proyecto está completado
    if proposal.project.status != 'completed':
        return jsonify({"msg": "Solo puedes calificar proyectos completados"}), 400

    # 3) Valida que el usuario participó en el trabajo
    employer_id = proposal.project.employer_id
    if reviewer_id not in (proposal.freelancer_id, employer_id):
        return jsonify({"msg": "No autorizado para calificar esta propuesta"}), 403

    # 4) Valida si ya este usuario dejo una calificacion de ese trabajo
    exists = Review.query.filter_by(
        proposal_id=proposal.id,
        reviewer_id=reviewer_id
    ).first()
    if exists:
        return jsonify({"msg": "Ya has calificado esta propuesta"}), 400

    # 5) Crea el review
    rev = Review(
        reviewer_id=reviewer_id,
        reviewee_id=data.get("reviewee_id"),
        proposal_id=proposal.id,
        rating=data.get("rating"),
        comment=data.get("comment")
    )
    db.session.add(rev)
    db.session.flush() #envía las operaciones al motor sin cerrar la transacción

    recalculate_profile_rating(data.get("reviewee_id"))
    db.session.commit()

    return jsonify({
        "msg": "Calificación creada",
        "review": {
            "id": rev.id,
            "rating": rev.rating,
            "comment": rev.comment,
            "created_at": rev.created_at.isoformat()
        },
        "new_average": Profile.query.filter_by(user_id=data.get("reviewee_id")).first().rating
    }), 201


@routes.route('/freelancer/<int:fid>/completed-proposals', methods=['GET'])
@jwt_required()
def get_completed_proposals(fid):
    # filtra donde Proposal.freelancer_id == fid y Project.status == 'completed'
    props = Proposal.query.join(Proposal.project)\
        .filter(Proposal.freelancer_id==fid, Project.status=='completed')\
        .all()
    result = []
    for p in props:
        result.append({
          "id": p.id,
          "project": {
            "title": p.project.title,
            "employer_id": p.project.employer_id,
            "employer_name": p.project.employer.first_name
          },
          "reviewed": Review.query.filter_by(proposal_id=p.id, reviewer_id=fid).first() != None
        })
    return jsonify({"proposals": result, "success": True}), 200



@routes.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()  
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()
    return '', 204


@routes.route("/freelancer/<int:user_id>/proposals", methods=["GET"])
def get_freelancer_proposals(user_id):
 
    proposals = Proposal.query.filter_by(freelancer_id=user_id).all()
 
    result = [p.serialize() for p in proposals]
    return jsonify({ "proposals": result }), 200



@routes.route("/contacts", methods=["GET"])
def get_contacts():
    requested_user_id = request.args.get("user_id", type=int)

    # Si no se pasa un `user_id` en la query, se usa el ID del usuario actual
    if requested_user_id is None:
        return jsonify({"message": "user_id query parameter is required"}), 400

    # Obtener los contactos del usuario solicitado
    contacts = Contact.query.filter_by(user_id=requested_user_id).all()

    contact_list = []
    for contact in contacts:
        contact_user = contact.contact  # Este es el User del contacto
        contact_profile = contact_user.profile  # Acceder al Profile del contacto

        contact_list.append({
            "id": contact_user.id,
            "first_name": contact_user.first_name,
            "last_name": contact_user.last_name,
            "email": contact_user.email,
            "career": contact_profile.career if contact_profile else None,
            "profile_picture": contact_profile.profile_picture
        })

    return jsonify({"contacts": contact_list}), 200



@routes.route("/contacts", methods=["POST"])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()  # Obtén el user_id del JWT
    contact_id = request.json.get("contact_id")  # Obtén el ID del contacto a agregar

    if not contact_id:
        return jsonify({"error": "No se proporcionó un ID de contacto"}), 400

    # Evitar que un usuario se agregue a sí mismo como contacto
    if user_id == contact_id:
        return jsonify({"error": "No puedes agregar a ti mismo como contacto"}), 400

    # Verificar si el contacto ya existe
    existing_contact = Contact.query.filter(
        (Contact.user_id == user_id) & (Contact.contact_id == contact_id)
    ).first()

    if existing_contact:
        return jsonify({"message": "El contacto ya está en tu lista de contactos"}), 200

    # Crear el nuevo contacto
    new_contact = Contact(user_id=user_id, contact_id=contact_id)
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"message": "Contacto agregado correctamente"}), 201