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
	return render_template('dialogs/table/edit_table.html')


@app.route('/warehouse-config-wizard')
def warehouse_config_wizard():
    return render_template('dialogs/warehouse-config-wizard.html')


@app.route('/table-actions')
def table_actions():
    return render_template('dialogs/table/table-actions.html')


@app.route('/rename-table')
def rename_table():
    return render_template('dialogs/table/rename-table.html')


@app.route('/copy-table')
def copy_table():
    return render_template('dialogs/table/copy-table.html')


@app.route('/drop-table')
def drop_table():
    return render_template('dialogs/table/drop-table.html')


@app.route('/truncate-table')
def truncate_table():
    return render_template('dialogs/table/truncate-table.html')


@app.route('/lock-table')
def lock_table():
    return render_template('dialogs/table/lock-table.html')


@app.route('/comment-table')
def comment_table():
    return render_template('dialogs/table/comment-table.html')


@app.route('/parallel-table')
def parallel_table():
    return render_template('dialogs/table/parallel-table.html')


@app.route('/logging-table')
def logging_table():
    return render_template('dialogs/table/logging-table.html')


@app.route('/no-parallel-table')
def no_parallel_table():
    return render_template('dialogs/table/no-parallel-table.html')


@app.route('/count-rows-table')
def count_rows_table():
    return render_template('dialogs/table/count-rows-table.html')


@app.route('/column-actions')
def column_actions():
    return render_template('dialogs/column/column-actions.html')


@app.route('/comment-column')
def comment_column():
    return render_template('dialogs/column/comment-column.html')


@app.route('/rename-column')
def rename_column():
    return render_template('dialogs/column/rename-column.html')


@app.route('/add-column')
def add_column():
    return render_template('dialogs/column/add-column.html')


@app.route('/drop-column')
def drop_column():
    return render_template('dialogs/column/drop-column.html')


@app.route('/normalize-column')
def normalize_column():
    return render_template('dialogs/column/normalize-column.html')


@app.route('/constraint-actions')
def constraint_actions():
    return render_template('dialogs/constraint/constraint-actions.html')


@app.route('/enable-foreign-keys-constraint')
def enable_foreign_keys_constraint():
    return render_template('dialogs/constraint/enable-foreign-keys-constraint.html')


@app.route('/disable-foreign-keys-constraint')
def disable_foreign_keys_constraint():
    return render_template('dialogs/constraint/disable-foreign-keys-constraint.html')


@app.route('/enable-all-constraint')
def enable_all_constraint():
    return render_template('dialogs/constraint/enable-all-constraint.html')


@app.route('/disable-all-constraint')
def disable_all_constraint():
    return render_template('dialogs/constraint/disable-all-constraint.html')


@app.route('/enable-single-constraint')
def enable_single_constraint():
    return render_template('dialogs/constraint/enable-single-constraint.html')


@app.route('/disable-single-constraint')
def disable_single_constraint():
    return render_template('dialogs/constraint/disable-single-constraint.html')


@app.route('/rename-single-constraint')
def rename_single_constraint():
    return render_template('dialogs/constraint/rename-single-constraint.html')


@app.route('/drop-constraint')
def drop_constraint():
    return render_template('dialogs/constraint/drop-constraint.html')


@app.route('/add-check-constraint')
def add_check_constraint():
    return render_template('dialogs/constraint/add-check-constraint.html')


@app.route('/add-primary-key-constraint')
def add_primary_key_constraint():
    return render_template('dialogs/constraint/add-primary-key-constraint.html')


@app.route('/add-foreign-key-constraint')
def add_foreign_key_constraint():
    return render_template('dialogs/constraint/add-foreign-key-constraint.html')


@app.route('/add-unique-constraint')
def add_unique_constraint():
    return render_template('dialogs/constraint/add-unique-constraint.html')


@app.route('/index-actions')
def index_actions():
    return render_template('dialogs/index/index-actions.html')


@app.route('/create-index')
def create_index():
    return render_template('dialogs/index/create-index.html')


@app.route('/drop-index')
def drop_index():
    return render_template('dialogs/index/drop-index.html')


@app.route('/rebuild-index')
def rebuild_index():
    return render_template('dialogs/index/rebuild-index.html')


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
