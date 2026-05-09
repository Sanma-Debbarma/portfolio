from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', section='home')

@app.route('/about')
def about():
    return render_template('index.html', section='about')

@app.route('/projects')
def projects():
    return render_template('index.html', section='projects')

@app.route('/contact')
def contact():
    return render_template('index.html', section='contact')

if __name__ == '__main__':
<<<<<<< HEAD
    app.run(debug=True)
=======
      app.run(host="0.0.0.0", port=10000)
>>>>>>> fdd74ab18ef506df5f17be7d6f808ff4d310ee06
