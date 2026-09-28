from collections import defaultdict


def predict_next_month_spending(expenses):
    """
    Predict next month's spending using historical
    monthly and category-wise spending.
    """

    # Group total spending by month
    monthly_spending = defaultdict(float)

    # Group spending by category and month
    category_monthly_spending = defaultdict(lambda: defaultdict(float))

    for expense in expenses:
        month_key = (expense.date.year, expense.date.month)

        monthly_spending[month_key] += expense.amount

        category_monthly_spending[
            expense.category
        ][month_key] += expense.amount

    # Need at least 2 months of history
    if len(monthly_spending) < 2:
        return {
            "prediction_available": False,
            "message": "Not enough monthly spending history for prediction.",
            "predicted_amount": None,
            "category_predictions": {}
        }

    # Calculate overall monthly average
    monthly_totals = list(monthly_spending.values())

    predicted_amount = sum(monthly_totals) / len(monthly_totals)

    # Calculate category-wise predictions
    category_predictions = {}

    for category, monthly_data in category_monthly_spending.items():

        category_totals = list(monthly_data.values())

        # Average spending for this category
        category_average = sum(category_totals) / len(category_totals)

        category_predictions[category] = round(
            category_average,
            2
        )

    return {
        "prediction_available": True,
        "predicted_amount": round(predicted_amount, 2),
        "months_analyzed": len(monthly_spending),
        "category_predictions": category_predictions,
        "message": (
            f"Your predicted spending for next month is "
            f"₹{predicted_amount:.2f}."
        )
    }