from sqlalchemy import Column, Integer, Float, String, Date
from database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=True)
    date = Column(Date, nullable=False)
    payment_method = Column(String, nullable=True)
    is_subscription = Column(Integer, default=0)