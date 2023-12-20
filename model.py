import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, LSTM, Dense
from sklearn.model_selection import train_test_split

# Load the dataset
df = pd.read_csv("bad-words.csv")

# Tokenize the text
max_words = 10000
max_len = 100
tokenizer = Tokenizer(num_words=max_words, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=True)
tokenizer.fit_on_texts(df['jigaboo'])

# Convert text to sequences
sequences = tokenizer.texts_to_sequences(df['jigaboo'])
X = pad_sequences(sequences, maxlen=max_len)

# Create labels
y = np.zeros((len(df),))
y[df['jigaboo'].str.contains('bad_word')] = 1

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the model
model = Sequential()
model.add(Embedding(max_words, 32, input_length=max_len))
model.add(Bidirectional(LSTM(64)))
model.add(Dense(1, activation='sigmoid'))
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=5, batch_size=32, validation_split=0.2)

# Evaluate the model
accuracy = model.evaluate(X_test, y_test)[1]
print(f"Model Accuracy: {accuracy}")

# User input for testing
user_input = input("Enter a text to check for abusive words: ")
user_sequence = tokenizer.texts_to_sequences([user_input])
user_padded = pad_sequences(user_sequence, maxlen=max_len)

# Predict using the trained model
prediction = model.predict(user_padded)[0][0]

# Display the result
if prediction > 0.5:
    print("Warning: Abusive words detected in the input.")
else:
    print("No abusive words detected in the input.")