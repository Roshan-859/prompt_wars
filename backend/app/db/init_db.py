from app.db.session import engine, SessionLocal
from app.db.base import Base
import app.models  # noqa
from app.seed.seed_data import seed_all

def init_db():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized.")

    db = SessionLocal()
    try:
        print("Seeding demo data...")
        seed_all(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

