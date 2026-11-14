import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.skill import Skill, UserSkill
from app.models.career import Career, CareerSkill
from app.models.user import User
from app.services.skill_gap import calculate_skill_gap, calculate_readiness_score
from app.core.security import get_password_hash

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSession = sessionmaker(bind=engine)

@pytest.fixture
def db():
    import app.models  # noqa
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

def test_readiness_score_zero_when_no_skills(db):
    career = Career(name="Full Stack Developer", slug="fsd", is_active=True)
    db.add(career)
    db.flush()

    skill = Skill(name="JavaScript", slug="js", skill_type="technical", is_active=True)
    db.add(skill)
    db.flush()

    cs = CareerSkill(career_id=career.id, skill_id=skill.id, importance=1.0, demand="required", min_proficiency=80)
    db.add(cs)
    db.commit()

    score = calculate_readiness_score(db, user_id=999, career_id=career.id)
    assert score == 0.0

def test_readiness_score_calculated_with_user_skills(db):
    career = Career(name="AI Engineer", slug="ai", is_active=True)
    db.add(career)
    db.flush()

    user = User(email="test@skillpilot.ai", full_name="Test User", hashed_password=get_password_hash("pass"), role="student")
    db.add(user)
    db.flush()

    skill = Skill(name="Python", slug="python", skill_type="technical", is_active=True)
    db.add(skill)
    db.flush()

    cs = CareerSkill(career_id=career.id, skill_id=skill.id, importance=1.0, demand="required", min_proficiency=80)
    db.add(cs)

    us = UserSkill(user_id=user.id, skill_id=skill.id, proficiency=80, level="strong", source="manual")
    db.add(us)
    db.commit()

    score = calculate_readiness_score(db, user_id=user.id, career_id=career.id)
    assert score == 100.0

    gaps = calculate_skill_gap(db, user_id=user.id, career_id=career.id)
    assert len(gaps) == 1
    assert gaps[0].status == "strong"
    assert gaps[0].gap == 0

