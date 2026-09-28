import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion, Pipeline


# Load training data
data = pd.read_csv("ml/training_data.csv")


# Use both word-level and character-level features
word_vectorizer = TfidfVectorizer(
    lowercase=True,
    ngram_range=(1, 2)
)

char_vectorizer = TfidfVectorizer(
    analyzer="char",
    lowercase=True,
    ngram_range=(2, 5)
)


model = Pipeline([
    (
        "features",
        FeatureUnion([
            ("word_features", word_vectorizer),
            ("char_features", char_vectorizer)
        ])
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=2000
        )
    )
])


# Train the model
model.fit(
    data["description"],
    data["category"]
)


def categorize_expense(description: str):

    probabilities = model.predict_proba([description])[0]

    best_index = probabilities.argmax()

    category = model.classes_[best_index]

    confidence = probabilities[best_index] * 100

    # Don't make low-confidence predictions silently
    if confidence < 50:
        category = "Other"

    return {
        "category": category,
        "confidence": round(confidence, 2)
    }