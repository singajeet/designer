from flask import Flask, render_template
from flask_socketio import SocketIO
from oracle import DatabaseConnectionServer, DatabaseSchemaServer, DatabaseTableServer
from oracle import DatabaseViewServer, DatabaseIndexServer, DatabaseMaterializedViewServer
from oracle import DatabasePLSQLServer, DatabaseSequenceServer, DatabaseSynonymServer
from oracle import DatabaseLinkServer, DatabaseDirectoryServer, DatabaseQueueServer
from oracle import DatabaseSQLServer
from engineio.payload import Payload


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
Payload.max_decode_packets = 500
socketio = SocketIO(app, async_mode=None)


@app.route('/edit-table')
def edit_table():
	return render_template('dialogs/edit_table.html')


@app.route('/warehouse-config-wizard')
def warehouse_config_wizard():
    return render_template('dialogs/warehouse-config-wizard.html')


@app.route('/')
def index():
	return render_template('index.html')


def start_app():
    dc = DatabaseConnectionServer(socketio)
    ds = DatabaseSchemaServer(socketio, dc)
    dt = DatabaseTableServer(socketio, ds)
    dv = DatabaseViewServer(socketio, ds)
    di = DatabaseIndexServer(socketio, ds)
    dmv = DatabaseMaterializedViewServer(socketio, ds)
    dplsql = DatabasePLSQLServer(socketio, ds)
    dseq = DatabaseSequenceServer(socketio, ds)
    dsynm = DatabaseSynonymServer(socketio, ds)
    dblink = DatabaseLinkServer(socketio, ds)
    ddir = DatabaseDirectoryServer(socketio, ds)
    dq = DatabaseQueueServer(socketio, ds)
    dsql = DatabaseSQLServer(socketio, ds)
    socketio.run(app, debug=True)


if __name__ == '__main__':
    start_app()
