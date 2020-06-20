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


@app.route('/privileges-actions')
def privileges_actions():
    return render_template('dialogs/privileges/privileges-actions.html')


@app.route('/grant-privileges')
def grant_privileges():
    return render_template('dialogs/privileges/grant-privileges.html')


@app.route('/revoke-privileges')
def revoke_privileges():
    return render_template('dialogs/privileges/revoke-privileges.html')


@app.route('/statistics-actions')
def statistics_actions():
    return render_template('dialogs/statistics/statistics-actions.html')


@app.route('/validate-structure-statistics')
def validate_structure_statistics():
    return render_template('dialogs/statistics/validate-structure-statistics.html')


@app.route('/gather-statistics')
def gather_statistics():
    return render_template('dialogs/statistics/gather-statistics.html')


@app.route('/storage-actions')
def storage_actions():
    return render_template('dialogs/storage/storage-actions.html')


@app.route('/shrink-table-storage')
def shrink_table_storage():
    return render_template('dialogs/storage/shrink-table-storage.html')


@app.route('/row-movement-storage')
def row_movement_storage():
    return render_template('dialogs/storage/row-movement-storage.html')


@app.route('/compress-storage')
def compress_storage():
    return render_template('dialogs/storage/compress-storage.html')


@app.route('/no-compress-storage')
def no_compress_storage():
    return render_template('dialogs/storage/no-compress-storage.html')


@app.route('/move-storage')
def move_storage():
    return render_template('dialogs/storage/move-storage.html')


@app.route('/move-tablespace-storage')
def move_tablespace_storage():
    return render_template('dialogs/storage/move-tablespace-storage.html')


@app.route('/cache-storage')
def cache_storage():
    return render_template('dialogs/storage/cache-storage.html')


@app.route('/no-cache-storage')
def no_cache_storage():
    return render_template('dialogs/storage/no-cache-storage.html')


@app.route('/trigger-actions')
def trigger_actions():
    return render_template('dialogs/trigger/trigger-actions.html')


@app.route('/create-trigger')
def create_trigger():
    return render_template('dialogs/trigger/create-trigger.html')


@app.route('/create-pk-sequence-trigger')
def create_pk_sequence_trigger():
    return render_template('dialogs/trigger/create-pk-sequence-trigger.html')


@app.route('/disable-all-trigger')
def disable_all_trigger():
    return render_template('dialogs/trigger/disable-all-trigger.html')


@app.route('/disable-single-trigger')
def disable_single_trigger():
    return render_template('dialogs/trigger/disable-single-trigger.html')


@app.route('/enable-all-trigger')
def enable_all_trigger():
    return render_template('dialogs/trigger/enable-all-trigger.html')


@app.route('/enable-single-trigger')
def enable_single_trigger():
    return render_template('dialogs/trigger/enable-single-trigger.html')


@app.route('/drop-trigger')
def drop_trigger():
    return render_template('dialogs/trigger/drop-trigger.html')


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
