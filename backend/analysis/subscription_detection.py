from collections import defaultdict
from datetime import timedelta


def detect_subscriptions(expenses):
    """
    Detect recurring expenses based on similar descriptions,
    amounts, and transaction intervals.
    """

    grouped_expenses = defaultdict(list)

    # Group expenses by description
    for expense in expenses:
        description = expense.description.strip().lower()
        grouped_expenses[description].append(expense)

    subscriptions = []

    for description, transactions in grouped_expenses.items():

        # Need at least 3 transactions to identify a recurring pattern
        if len(transactions) < 3:
            continue

        # Sort by date
        transactions.sort(key=lambda x: x.date)

        # Calculate intervals between transactions
        intervals = []

        for i in range(1, len(transactions)):
            previous_date = transactions[i - 1].date
            current_date = transactions[i].date

            interval = (current_date - previous_date).days
            intervals.append(interval)

        average_interval = sum(intervals) / len(intervals)

        # Check whether payments are approximately monthly
        monthly_intervals = [
            25 <= interval <= 35
            for interval in intervals
        ]

        monthly_match = sum(monthly_intervals) / len(monthly_intervals)

        if monthly_match >= 0.66:

            amounts = [expense.amount for expense in transactions]

            average_amount = sum(amounts) / len(amounts)

            subscriptions.append({
                "description": description,
                "frequency": "Monthly",
                "average_amount": round(average_amount, 2),
                "transaction_count": len(transactions),
                "confidence": round(monthly_match * 100, 2)
            })

    return subscriptions