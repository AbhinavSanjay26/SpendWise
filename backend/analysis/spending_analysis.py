import statistics


def detect_unusual_spending(expenses, new_amount, category):
    """
    Check whether a new expense is unusually high
    compared with the user's previous spending in the same category.
    """

    # Get previous expenses from the same category
    category_expenses = [
        expense.amount
        for expense in expenses
        if expense.category == category
    ]

    # Not enough history
    if len(category_expenses) < 3:
        return {
            "is_unusual": False,
            "message": "Not enough spending history to determine unusual spending.",
            "average": None,
            "threshold": None
        }

    average = statistics.mean(category_expenses)
    standard_deviation = statistics.stdev(category_expenses)

    # Define an unusual spending threshold
    threshold = average + (2 * standard_deviation)

    is_unusual = new_amount > threshold

    if is_unusual:
        message = (
            f"₹{new_amount:.2f} is unusually high for {category}. "
            f"Your average spending in this category is "
            f"₹{average:.2f}."
        )
    else:
        message = (
            f"₹{new_amount:.2f} is within your normal "
            f"{category} spending range."
        )

    return {
        "is_unusual": is_unusual,
        "message": message,
        "average": round(average, 2),
        "threshold": round(threshold, 2)
    }