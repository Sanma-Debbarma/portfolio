from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
import os

app = Flask(__name__)
app.secret_key = "supersecretkey" # In production, use an environment variable
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in environment variables")

client = MongoClient(MONGO_URI)
db = client["contact_db"]
collection = db["contacts"]

@app.route('/')
def index():
    return render_template('index.html', section='home')

@app.route('/about')
def about():
    return render_template('index.html', section='about')

@app.route('/projects')
def projects():
    return render_template('index.html', section='projects')

@app.route('/contact', methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        message = request.form.get("message")

        collection.insert_one({
            "name": name,
            "email": email,
            "phone": phone,
            "message": message
        })
        flash("Message sent successfully!", "success")
        return redirect('/')
    return render_template('index.html', section='contact')

if __name__ == '__main__':
      app.run(host="0.0.0.0", port=10000)
