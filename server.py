from flask import Flask, render_template
from flask_socketio import SocketIO
from oracle import DatabaseConnectionServer, DatabaseSchemaServer, DatabaseTableServer, DatabaseViewServer, DatabaseIndexServer
from engineio.payload import Payload


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
Payload.max_decode_packets = 500
socketio = SocketIO(app, async_mode=None)


@app.route('/')
def index():
    return render_template('index.html')


def start_app():
    dc = DatabaseConnectionServer(socketio)
    ds = DatabaseSchemaServer(socketio, dc)
    dt = DatabaseTableServer(socketio, ds)
    dv = DatabaseViewServer(socketio, ds)
    di = DatabaseIndexServer(socketio, ds)
    socketio.run(app, debug=True)


if __name__ == '__main__':
    start_app()
