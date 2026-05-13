from flask import Flask, render_template,request
from pymongo import MongoClient

app = Flask(__name__)
app.config['MONGO_URL'] = "mongodb+srv://lala:lalakicho@cluster0.1exk2c0.mongodb.net/"
client = MongoClient(app.config['MONGO_URL'])
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

        send = {
            "name": name,
            "email": email,
            "phone": phone,
            "message": message
        }
        collection.insert_one(send)
        return redirect(url_for('contact'))
    return render_template('index.html', section='contact')

if __name__ == '__main__':
      app.run(host="0.0.0.0", port=10000)
