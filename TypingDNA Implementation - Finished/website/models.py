from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
import uuid


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    typing_id = db.Column(db.String(100), default=str(uuid.uuid4()))

