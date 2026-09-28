from collections import defaultdict
from statistics import mean


def analyze_spending_patterns(expenses):
    """
    Analyze the user's overall spending patterns.
    """

    if not expenses:
        return {
            "analysis_available": False,
            "message": "No expenses available for analysis."
        }

    total_spending = sum(expense.amount for expense in expenses)

    # -----------------------------
    # Category-wise spending
    # -----------------------------

    category_spending = defaultdict(float)

    for expense in expenses:
        category_spending[expense.category] += expense.amount

    category_percentages = {}

    for category, amount in category_spending.items():
        category_percentages[category] = round(
            (amount / total_spending) * 100,
            2
        )

    highest_category = max(
        category_spending,
        key=category_spending.get
    )

    # -----------------------------
    # Average spending
    # -----------------------------

    amounts = [expense.amount for expense in expenses]

    average_expense = mean(amounts)

    # -----------------------------
    # Monthly spending
    # -----------------------------

    monthly_spending = defaultdict(float)

    for expense in expenses:
        month = f"{expense.date.year}-{expense.date.month:02d}"
        monthly_spending[month] += expense.amount

    # -----------------------------
    # Most expensive transaction
    # -----------------------------

    highest_expense = max(
        expenses,
        key=lambda expense: expense.amount
    )

    # -----------------------------
    # Final result
    # -----------------------------

    return {
        "analysis_available": True,

        "total_spending": round(total_spending, 2),

        "average_expense": round(
            average_expense,
            2
        ),

        "highest_spending_category": highest_category,

        "highest_category_amount": round(
            category_spending[highest_category],
            2
        ),

        "category_spending": {
            category: round(amount, 2)
            for category, amount in category_spending.items()
        },

        "category_percentages": category_percentages,

        "monthly_spending": {
            month: round(amount, 2)
            for month, amount in monthly_spending.items()
        },

        "highest_expense": {
            "description": highest_expense.description,
            "amount": highest_expense.amount,
            "category": highest_expense.category
        },

        "total_transactions": len(expenses)
    }