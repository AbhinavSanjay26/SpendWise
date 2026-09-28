def simulate_spending(expenses, additional_amount, category):
    """
    Simulate the effect of an additional expense
    on the user's current spending.
    """

    if additional_amount <= 0:
        return {
            "simulation_available": False,
            "message": "Additional spending must be greater than zero."
        }

    # Current total spending
    current_total = sum(
        expense.amount for expense in expenses
    )

    # Current category spending
    current_category_total = sum(
    expense.amount
    for expense in expenses
    if expense.category.lower() == category.lower()

    )

    # Projected values
    projected_total = current_total + additional_amount
    projected_category_total = (
        current_category_total + additional_amount
    )

    # Current category percentage
    if current_total > 0:
        current_percentage = (
            current_category_total / current_total
        ) * 100
    else:
        current_percentage = 0

    # Projected category percentage
    projected_percentage = (
        projected_category_total / projected_total
    ) * 100

    return {
        "simulation_available": True,

        "category": category.title(),

        "additional_spending": round(
            additional_amount,
            2
        ),

        "current_total_spending": round(
            current_total,
            2
        ),

        "projected_total_spending": round(
            projected_total,
            2
        ),

        "current_category_spending": round(
            current_category_total,
            2
        ),

        "projected_category_spending": round(
            projected_category_total,
            2
        ),

        "current_category_percentage": round(
            current_percentage,
            2
        ),

        "projected_category_percentage": round(
            projected_percentage,
            2
        ),

        "message": (
            f"If you spend ₹{additional_amount:.2f} "
            f"on {category}, your total spending would "
            f"increase to ₹{projected_total:.2f}."
        )
    }