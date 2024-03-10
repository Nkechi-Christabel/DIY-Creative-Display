from diy_app.models import db
from diy_app.models.base_model import Base

class Comment(Base):
    __tablename__ = "comments"
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)