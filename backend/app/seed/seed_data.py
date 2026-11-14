from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import Profile
from app.models.skill import Skill, SkillCategory, UserSkill
from app.models.career import Career, CareerSkill
from app.models.resource import Resource, ResourceSkill
from app.models.assessment import Assessment, AssessmentQuestion
from app.core.security import get_password_hash

def seed_all(db: Session):
    if db.query(User).filter(User.email == "demo@skillpilot.ai").first():
        print("Database already seeded.")
        return

    # Categories
    cats = {}
    for name in ["Frontend", "Backend", "Data Science", "DevOps", "Soft Skills", "AI/ML", "Security"]:
        c = SkillCategory(name=name, description=f"{name} skills")
        db.add(c)
        cats[name] = c
    db.flush()

    # Skills
    skills_data = [
        # Frontend
        ("HTML", "html", "frontend", "Frontend", "technical"),
        ("CSS", "css", "frontend", "Frontend", "technical"),
        ("JavaScript", "javascript", "frontend", "Frontend", "technical"),
        ("TypeScript", "typescript", "frontend", "Frontend", "technical"),
        ("React", "react", "frontend", "Frontend", "technical"),
        ("Vue.js", "vuejs", "frontend", "Frontend", "technical"),
        ("Next.js", "nextjs", "frontend", "Frontend", "technical"),
        ("Tailwind CSS", "tailwind-css", "frontend", "Frontend", "technical"),
        ("Responsive Design", "responsive-design", "frontend", "Frontend", "technical"),
        # Backend
        ("Python", "python", "backend", "Backend", "technical"),
        ("Node.js", "nodejs", "backend", "Backend", "technical"),
        ("FastAPI", "fastapi", "backend", "Backend", "technical"),
        ("Express.js", "expressjs", "backend", "Backend", "technical"),
        ("REST APIs", "rest-apis", "backend", "Backend", "technical"),
        ("GraphQL", "graphql", "backend", "Backend", "technical"),
        ("SQL", "sql", "backend", "Backend", "technical"),
        ("PostgreSQL", "postgresql", "backend", "Backend", "technical"),
        ("MongoDB", "mongodb", "backend", "Backend", "technical"),
        ("Redis", "redis", "backend", "Backend", "technical"),
        # Data Science / AI
        ("Machine Learning", "machine-learning", "ai-ml", "AI/ML", "technical"),
        ("Deep Learning", "deep-learning", "ai-ml", "AI/ML", "technical"),
        ("TensorFlow", "tensorflow", "ai-ml", "AI/ML", "technical"),
        ("PyTorch", "pytorch", "ai-ml", "AI/ML", "technical"),
        ("Data Analysis", "data-analysis", "data-science", "Data Science", "technical"),
        ("Pandas", "pandas", "data-science", "Data Science", "technical"),
        ("NumPy", "numpy", "data-science", "Data Science", "technical"),
        ("Statistics", "statistics", "data-science", "Data Science", "technical"),
        ("Data Visualization", "data-visualization", "data-science", "Data Science", "technical"),
        # DevOps
        ("Docker", "docker", "devops", "DevOps", "technical"),
        ("Kubernetes", "kubernetes", "devops", "DevOps", "technical"),
        ("CI/CD", "cicd", "devops", "DevOps", "technical"),
        ("AWS", "aws", "devops", "DevOps", "technical"),
        ("Git", "git", "devops", "DevOps", "technical"),
        ("Linux", "linux", "devops", "DevOps", "technical"),
        # Security
        ("Network Security", "network-security", "security", "Security", "technical"),
        ("Ethical Hacking", "ethical-hacking", "security", "Security", "technical"),
        ("Cryptography", "cryptography", "security", "Security", "technical"),
        ("OWASP", "owasp", "security", "Security", "technical"),
        # Soft Skills
        ("Problem Solving", "problem-solving", "soft", "Soft Skills", "soft"),
        ("Communication", "communication", "soft", "Soft Skills", "soft"),
        ("Teamwork", "teamwork", "soft", "Soft Skills", "soft"),
        ("Critical Thinking", "critical-thinking", "soft", "Soft Skills", "soft"),
        # Design
        ("UI Design", "ui-design", "frontend", "Frontend", "technical"),
        ("UX Research", "ux-research", "frontend", "Frontend", "technical"),
        ("Figma", "figma", "frontend", "Frontend", "technical"),
    ]

    skill_map = {}
    for name, slug, icon, cat_name, stype in skills_data:
        s = Skill(name=name, slug=slug, icon=icon, category_id=cats[cat_name].id, skill_type=stype, is_active=True)
        db.add(s)
        skill_map[slug] = s
    db.flush()

    # Careers
    careers_data = [
        ("Full Stack Developer", "full-stack-developer", "Build end-to-end web applications", "💻", "Engineering", "$95,000 - $145,000", "high"),
        ("AI/ML Engineer", "ai-ml-engineer", "Build intelligent ML systems and models", "🤖", "AI/ML", "$120,000 - $180,000", "very_high"),
        ("Data Scientist", "data-scientist", "Analyze data and build predictive models", "📊", "Data", "$110,000 - $165,000", "high"),
        ("Cybersecurity Analyst", "cybersecurity-analyst", "Protect systems and networks from threats", "🔒", "Security", "$85,000 - $135,000", "high"),
        ("Cloud Engineer", "cloud-engineer", "Design and manage cloud infrastructure", "☁️", "DevOps", "$100,000 - $155,000", "high"),
        ("UI/UX Designer", "ui-ux-designer", "Design beautiful, user-centered interfaces", "🎨", "Design", "$75,000 - $120,000", "medium"),
    ]
    career_map = {}
    for name, slug, desc, icon, cat, salary, demand in careers_data:
        c = Career(name=name, slug=slug, description=desc, icon=icon, category=cat, avg_salary=salary, demand_level=demand, is_active=True)
        db.add(c)
        career_map[slug] = c
    db.flush()

    # Career skills
    cs_data = {
        "full-stack-developer": [
            ("html", 0.7, "required", 70), ("css", 0.7, "required", 70),
            ("javascript", 1.0, "required", 80), ("typescript", 0.8, "required", 65),
            ("react", 0.9, "required", 75), ("nodejs", 0.9, "required", 70),
            ("rest-apis", 0.8, "required", 70), ("sql", 0.7, "required", 65),
            ("git", 0.6, "required", 60), ("docker", 0.6, "preferred", 50),
            ("problem-solving", 0.8, "required", 70), ("communication", 0.5, "preferred", 60),
        ],
        "ai-ml-engineer": [
            ("python", 1.0, "required", 85), ("machine-learning", 1.0, "required", 80),
            ("deep-learning", 0.9, "required", 75), ("tensorflow", 0.8, "required", 70),
            ("pytorch", 0.8, "required", 70), ("statistics", 0.9, "required", 75),
            ("pandas", 0.7, "required", 70), ("numpy", 0.7, "required", 70),
            ("data-analysis", 0.8, "required", 75), ("sql", 0.6, "preferred", 60),
            ("git", 0.5, "required", 60), ("critical-thinking", 0.7, "required", 70),
        ],
        "data-scientist": [
            ("python", 0.9, "required", 80), ("statistics", 1.0, "required", 80),
            ("machine-learning", 0.9, "required", 75), ("pandas", 0.8, "required", 75),
            ("numpy", 0.8, "required", 70), ("data-analysis", 1.0, "required", 80),
            ("data-visualization", 0.8, "required", 70), ("sql", 0.9, "required", 75),
            ("communication", 0.7, "required", 65), ("critical-thinking", 0.8, "required", 70),
        ],
        "cybersecurity-analyst": [
            ("network-security", 1.0, "required", 80), ("ethical-hacking", 0.9, "required", 75),
            ("cryptography", 0.8, "required", 70), ("owasp", 0.9, "required", 75),
            ("linux", 0.8, "required", 70), ("python", 0.7, "preferred", 60),
            ("problem-solving", 0.9, "required", 75), ("critical-thinking", 0.8, "required", 70),
        ],
        "cloud-engineer": [
            ("aws", 1.0, "required", 80), ("docker", 0.9, "required", 75),
            ("kubernetes", 0.9, "required", 75), ("cicd", 0.8, "required", 70),
            ("linux", 0.8, "required", 70), ("python", 0.7, "preferred", 60),
            ("git", 0.7, "required", 65), ("problem-solving", 0.7, "required", 65),
        ],
        "ui-ux-designer": [
            ("ui-design", 1.0, "required", 80), ("ux-research", 0.9, "required", 75),
            ("figma", 1.0, "required", 80), ("css", 0.8, "required", 70),
            ("html", 0.7, "preferred", 60), ("responsive-design", 0.9, "required", 75),
            ("communication", 0.8, "required", 70), ("critical-thinking", 0.7, "required", 65),
        ],
    }

    for career_slug, skill_list in cs_data.items():
        career = career_map[career_slug]
        for skill_slug, importance, demand, min_prof in skill_list:
            skill = skill_map.get(skill_slug)
            if skill:
                cs = CareerSkill(career_id=career.id, skill_id=skill.id, importance=importance, demand=demand, min_proficiency=min_prof)
                db.add(cs)
    db.flush()

    # Resources
    resources_data = [
        ("The Complete JavaScript Course 2024", "Master JavaScript with projects", "https://udemy.com", "course", "Udemy", "beginner", 65.0, True, 4.7),
        ("React - The Complete Guide", "Build powerful React applications", "https://udemy.com", "course", "Udemy", "intermediate", 48.0, True, 4.8),
        ("Python for Everybody", "Python programming fundamentals", "https://coursera.org", "course", "Coursera", "beginner", 30.0, True, 4.9),
        ("Machine Learning Specialization", "Andrew Ng's ML course", "https://coursera.org", "course", "Coursera", "intermediate", 90.0, True, 4.9),
        ("Deep Learning Specialization", "Deep neural networks by deeplearning.ai", "https://coursera.org", "course", "Coursera", "advanced", 120.0, True, 4.9),
        ("The Web Developer Bootcamp", "Full stack web development", "https://udemy.com", "course", "Udemy", "beginner", 63.0, True, 4.8),
        ("Docker & Kubernetes: The Practical Guide", "Container orchestration", "https://udemy.com", "course", "Udemy", "intermediate", 22.0, True, 4.7),
        ("AWS Certified Solutions Architect", "Cloud architecture on AWS", "https://aws.amazon.com", "course", "AWS", "intermediate", 40.0, True, 4.6),
        ("SQL Masterclass", "SQL for data analysis", "https://udemy.com", "course", "Udemy", "beginner", 9.0, True, 4.7),
        ("TypeScript: The Complete Developer's Guide", "Master TypeScript", "https://udemy.com", "course", "Udemy", "intermediate", 27.5, True, 4.7),
        ("MDN JavaScript Guide", "Official JavaScript documentation", "https://developer.mozilla.org", "doc", "MDN", "beginner", 10.0, True, 4.9),
        ("React Official Documentation", "Official React documentation", "https://react.dev", "doc", "React", "intermediate", 8.0, True, 5.0),
        ("FastAPI Documentation", "Official FastAPI docs", "https://fastapi.tiangolo.com", "doc", "FastAPI", "intermediate", 5.0, True, 4.9),
        ("LeetCode JavaScript Problems", "Practice JS coding challenges", "https://leetcode.com", "exercise", "LeetCode", "intermediate", 20.0, True, 4.8),
        ("HackerRank Python Challenges", "Python practice problems", "https://hackerrank.com", "exercise", "HackerRank", "beginner", 15.0, True, 4.7),
        ("Kaggle ML Competitions", "Real-world ML challenges", "https://kaggle.com", "challenge", "Kaggle", "advanced", 40.0, True, 4.9),
        ("Build a React Todo App", "Mini project: React fundamentals", "https://react.dev", "project", "React", "beginner", 4.0, True, 4.8),
        ("Build a REST API with FastAPI", "Mini project: Backend API", "https://fastapi.tiangolo.com", "project", "FastAPI", "intermediate", 6.0, True, 4.7),
        ("Build a Data Dashboard", "Mini project: Data visualization", "https://plotly.com", "project", "Plotly", "intermediate", 8.0, True, 4.6),
        ("Cybersecurity: Ethical Hacking Course", "Ethical hacking fundamentals", "https://udemy.com", "course", "Udemy", "intermediate", 22.0, True, 4.7),
        ("Statistics for Data Science", "Statistics fundamentals", "https://coursera.org", "course", "Coursera", "beginner", 25.0, True, 4.6),
        ("Figma UI Design Tutorial", "Complete Figma course", "https://youtube.com", "video", "YouTube", "beginner", 8.0, True, 4.8),
        ("CSS Flexbox and Grid", "Modern CSS layout techniques", "https://css-tricks.com", "doc", "CSS-Tricks", "beginner", 3.0, True, 4.9),
        ("Node.js Documentation", "Official Node.js docs", "https://nodejs.org", "doc", "Node.js", "intermediate", 10.0, True, 4.8),
        ("Git & GitHub Crash Course", "Version control fundamentals", "https://youtube.com", "video", "YouTube", "beginner", 4.0, True, 4.7),
        ("Linux Command Line Basics", "Terminal and shell scripting", "https://linuxcommand.org", "doc", "Linux Foundation", "beginner", 10.0, True, 4.6),
        ("Kubernetes for Beginners", "Container orchestration basics", "https://kubernetes.io", "doc", "Kubernetes", "intermediate", 12.0, True, 4.7),
        ("OWASP Top 10 Guide", "Web security vulnerabilities", "https://owasp.org", "doc", "OWASP", "intermediate", 5.0, True, 4.9),
        ("Data Structures & Algorithms in Python", "DSA fundamentals", "https://udemy.com", "course", "Udemy", "intermediate", 20.0, True, 4.7),
        ("GraphQL Tutorial", "Learn GraphQL API design", "https://graphql.org", "doc", "GraphQL", "intermediate", 6.0, True, 4.7),
        ("MongoDB University", "MongoDB database fundamentals", "https://university.mongodb.com", "course", "MongoDB", "beginner", 20.0, True, 4.8),
        ("Redis Crash Course", "In-memory data store basics", "https://redis.io", "video", "Redis", "beginner", 2.0, True, 4.6),
    ]

    resource_skill_map = {
        0: ["javascript"], 1: ["react", "typescript"],
        2: ["python"], 3: ["machine-learning", "statistics"],
        4: ["deep-learning", "tensorflow"], 5: ["html", "css", "javascript"],
        6: ["docker", "kubernetes"], 7: ["aws"], 8: ["sql", "postgresql"],
        9: ["typescript"], 10: ["javascript"], 11: ["react"],
        12: ["fastapi", "rest-apis"], 13: ["javascript"],
        14: ["python"], 15: ["machine-learning", "data-analysis"],
        16: ["react", "javascript"], 17: ["fastapi", "rest-apis", "python"],
        18: ["data-visualization", "pandas"], 19: ["ethical-hacking", "network-security"],
        20: ["statistics", "data-analysis"], 21: ["figma", "ui-design"],
        22: ["css", "responsive-design"], 23: ["nodejs"],
        24: ["git"], 25: ["linux"], 26: ["kubernetes"],
        27: ["owasp", "network-security"], 28: ["python", "problem-solving"],
        29: ["graphql"], 30: ["mongodb"], 31: ["redis"],
    }

    resource_objs = []
    for title, desc, url, rtype, platform, diff, dur, free, rating in resources_data:
        r = Resource(title=title, description=desc, url=url, resource_type=rtype, platform=platform, difficulty=diff, duration_hours=dur, is_free=free, rating=rating, is_active=True)
        db.add(r)
        resource_objs.append(r)
    db.flush()

    for idx, r in enumerate(resource_objs):
        for slug in resource_skill_map.get(idx, []):
            s = skill_map.get(slug)
            if s:
                rs = ResourceSkill(resource_id=r.id, skill_id=s.id, relevance=1.0)
                db.add(rs)
    db.flush()

    # Assessments
    js_assessment = Assessment(
        title="JavaScript Fundamentals",
        description="Test your JavaScript closures, async patterns, and core syntax.",
        skill_id=skill_map["javascript"].id,
        difficulty="intermediate",
        time_limit_minutes=30,
        passing_score=70.0,
        is_active=True
    )
    db.add(js_assessment)
    db.flush()

    js_questions = [
        ("What is a closure in JavaScript?", "mcq", ["A function with access to its outer lexical scope", "A type of loop construct", "A method to close browser tabs", "An asynchronous callback handler"], "A function with access to its outer lexical scope", 1.0, 1, ["closures"]),
        ("What does `async/await` syntax provide in JavaScript?", "mcq", ["Multi-threaded processing", "Synchronous appearance for asynchronous Promises", "CPU acceleration", "Compiler optimization flags"], "Synchronous appearance for asynchronous Promises", 1.0, 2, ["async", "promises"]),
        ("What is the result of `typeof null` in standard JavaScript?", "mcq", ["null", "object", "undefined", "number"], "object", 1.0, 3, ["types"]),
        ("What does the strict equality operator `===` verify?", "mcq", ["Value only with coercion", "Value and data type without coercion", "Memory pointer address", "Object reference identity only"], "Value and data type without coercion", 1.0, 4, ["operators"]),
        ("What is DOM event bubbling?", "mcq", ["Events propagate upwards from target to ancestor elements", "Events propagate downwards from window to target", "Events get immediately cancelled", "Events are queued into localStorage"], "Events propagate upwards from target to ancestor elements", 1.0, 5, ["events", "dom"]),
    ]

    for qtext, qtype, opts, correct, points, order, tags in js_questions:
        q = AssessmentQuestion(assessment_id=js_assessment.id, question_text=qtext, question_type=qtype, options=opts, correct_answer=correct, points=points, order=order, topic_tags=tags)
        db.add(q)

    # Demo Users
    demo1 = User(email="demo@skillpilot.ai", full_name="Alex Chen", hashed_password=get_password_hash("demo1234"), role="student", is_active=True, is_verified=True)
    db.add(demo1)
    demo2 = User(email="student@skillpilot.ai", full_name="Priya Sharma", hashed_password=get_password_hash("student123"), role="student", is_active=True, is_verified=True)
    db.add(demo2)
    db.flush()

    # Profiles
    p1 = Profile(
        user_id=demo1.id,
        bio="Aspiring Full Stack Developer building modern web applications",
        location="San Francisco, CA",
        education_level="bachelor",
        institution="UC Berkeley",
        graduation_year=2024,
        target_career_id=career_map["full-stack-developer"].id,
        github_url="https://github.com/alexchen",
        onboarding_completed=True,
        weekly_study_hours=15,
        certifications=["AWS Cloud Practitioner"],
        completed_projects=["Personal Portfolio", "E-commerce App"]
    )
    p2 = Profile(
        user_id=demo2.id,
        bio="Data Science enthusiast transitioning from statistics",
        location="New York, NY",
        education_level="master",
        institution="Columbia University",
        graduation_year=2023,
        target_career_id=career_map["data-scientist"].id,
        github_url="https://github.com/priyasharma",
        onboarding_completed=True,
        weekly_study_hours=20,
        certifications=["Google Data Analytics"],
        completed_projects=["Sales Prediction Model"]
    )
    db.add(p1)
    db.add(p2)
    db.flush()

    # Skills for demo1
    demo1_skills = [
        ("html", 85, "strong"), ("css", 75, "strong"), ("javascript", 60, "intermediate"),
        ("react", 55, "intermediate"), ("python", 45, "beginner"), ("sql", 70, "intermediate"),
        ("git", 80, "strong"), ("nodejs", 40, "beginner"), ("typescript", 30, "beginner"),
        ("problem-solving", 80, "strong"), ("communication", 75, "strong"),
    ]
    for slug, prof, level in demo1_skills:
        s = skill_map.get(slug)
        if s:
            us = UserSkill(user_id=demo1.id, skill_id=s.id, proficiency=prof, level=level, source="manual")
            db.add(us)

    db.commit()
    print("Seed complete: Demo accounts created (demo@skillpilot.ai / demo1234).")

