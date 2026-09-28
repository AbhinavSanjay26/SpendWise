from datetime import date

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Expense
from ml.categorization import categorize_expense
from analysis.spending_analysis import detect_unusual_spending
from analysis.subscription_detection import detect_subscriptions
from analysis.spending_prediction import predict_next_month_spending
from analysis.spending_patterns import analyze_spending_patterns
from analysis.what_if import simulate_spending

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Expense Intelligence System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExpenseCreate(BaseModel):
    amount: float
    description: str
    date: date
    payment_method: str


@app.get("/")
def home():
    return {
        "message": "Personal Expense Intelligence System API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/expenses")
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()
    return expenses


@app.post("/expenses")
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    # 1. Predict category using ML
    prediction = categorize_expense(expense.description)

    category = prediction["category"]

    # 2. Get previous expenses BEFORE adding the new one
    previous_expenses = db.query(Expense).all()

    # 3. Check whether this expense is unusual
    unusual_result = detect_unusual_spending(
        previous_expenses,
        expense.amount,
        category
    )

    # 4. Create new expense
    new_expense = Expense(
        amount=expense.amount,
        description=expense.description,
        date=expense.date,
        payment_method=expense.payment_method,
        category=category,
        is_subscription=0
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    # 5. Return complete result
    return {
        "id": new_expense.id,
        "amount": new_expense.amount,
        "description": new_expense.description,
        "date": new_expense.date,
        "payment_method": new_expense.payment_method,
        "category": new_expense.category,
        "category_confidence": prediction["confidence"],
        "is_subscription": new_expense.is_subscription,

        "unusual_spending": unusual_result
    }

@app.get("/subscriptions")
def get_subscriptions(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()

    subscriptions = detect_subscriptions(expenses)

    return {
        "subscriptions": subscriptions
    }

@app.get("/prediction")
def get_spending_prediction(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()

    prediction = predict_next_month_spending(expenses)

    return prediction

@app.get("/patterns")
def get_spending_patterns(db: Session = Depends(get_db)):
    expenses = db.query(Expense).all()

    patterns = analyze_spending_patterns(expenses)

    return patterns

@app.get("/what-if")
def what_if_spending(
    amount: float,
    category: str,
    db: Session = Depends(get_db)
):
    expenses = db.query(Expense).all()

    result = simulate_spending(
        expenses,
        amount,
        category
    )

    return result