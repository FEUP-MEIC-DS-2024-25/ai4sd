from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello from superhero-08-05! :O"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
