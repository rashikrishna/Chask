import os
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []
chatrooms = ['default']
#messages = {}

@app.route("/")
def index():
    print(users)
    return render_template("index.html",chatrooms=chatrooms)

@app.route("/adduser", methods=["POST"])
def adduser():
    u = request.form.get("user")
    users.append(u)
    return u

@socketio.on("establish_connection")
def establish(data):
    socketio.emit("response",data)

@socketio.on("broadcast_message")
def enter(data):
    msg = data['message']
    user = data['user']
    #messages.add(mess)
    print(msg)
    socketio.emit('show_messages', {'message' : msg, 'user':user}, broadcast = True)

@socketio.on("create_chatroom")
def new_chatroom(data):
    chatroom = data['chatroom']
    chatrooms.append(chatroom)
    print(chatrooms)
    socketio.emit("show_chatroom",data,broadcast=True)
































if __name__=="__main__":
	socketio.run(app, debug=True)
