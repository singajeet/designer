"""
This module provides the classes necessary to interact with the database.
Each class exposes an Flask-SocketIO based websockets to interact
with oracle database

Author: Ajeet Singh
Date: 11/04/2020
"""
import logging
from flask_socketio import emit, Namespace
import cx_Oracle


class DatabaseConnectionServer(Namespace):
    """DatabaseConnection class provides methods to connect to Oracle DB
    and provides the connection instance to be used by other classes
    """

    _connection_string = None
    _username = None
    _password = None
    _db = None
    _socket_io = None
    _namespace_url = None
    _logger = None

    def __init__(self, socket_io):
        """Default constructor for DatabaseConnectionServer class

            Args:
                socket_io (SocketIO, required): An instance of SocketIO class
        """
        Namespace.__init__(self, '/oracle_db_connection')
        self._namespace_url = '/oracle_db_connection'
        self._socket_io = socket_io
        socket_io.on_namespace(self)
        self._logger = logging.getLogger(__name__)

    def on_db_connect(self, props):
        """For internal user only: This method is called by websocket when
            'db_connect' event is raised

            Args:
                props (dict): contains the parameters to connect to db
        """
        conn_str = props['connectionString']
        if conn_str is not None:
            self._connection_string = conn_str
        user = props['username']
        if user is not None:
            self._username = user
        passw = props['password']
        if passw is not None:
            self._password = passw
        try:
            self._db = cx_Oracle.connect(self._username, self._password, self._connection_string)
            emit('connected', namespace=self._namespace_url)
            print("Connected to database version: " + self._db.version)
        except Exception as e:
            print("Error: " + str(e))
            msg = "Cannot connect to database: " + str(e)
            emit('failed', {'status': False, 'message': msg},
                 namespace=self._namespace_url)

    def get_connection(self):
        """Returns the instance of the cx_Oracle
        """
        return self._db


class DatabaseSchemaServer(Namespace):
    """Class to interact with any given schema
    """

    _socket_io = None
    _schema_name = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, db_connection):
        """Default constructor for DatabaseSchemaServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                connection (DatabaseConnection): An instance of DatabaseConnection Class
        """
        Namespace.__init__(self, '/oracle_db_schema')
        self._namespace_url = '/oracle_db_schema'
        self._socket_io = socket_io
        self._db_connection = db_connection
        socket_io.on_namespace(self)

    def get_connection(self):
        """Returns the instance of the cx_Oracle
        """
        return self._db_connection

    def on_set_schema(self, schema_name):
        """For internal use only: will be called when 'set_schema' event will be emitted

            Args:
                schema_name (string): Name of the db schema
        """
        print("DatabaseSchema: Setting up schema name: " + schema_name)
        self._schema_name = schema_name

    def get_schema_name(self):
        """Returns the name of the schema set through 'set_schema' websocket event
        """
        return self._schema_name

    def on_get_tables(self):
        """For internal use only: will be called when 'get_tables' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT table_name FROM sys.user_tables")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('tables_result', result_array, namespace=self._namespace_url)

    def on_get_views(self):
        """For internal use only: will be called when 'get_views' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT view_name FROM sys.user_views")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('views_result', result_array, namespace=self._namespace_url)

    def on_get_indexes(self):
        """For internal use only: will be called when 'get_indexes' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT index_name FROM sys.user_indexes")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('indexes_result', result_array, namespace=self._namespace_url)

    def on_get_mviews(self):
        """For internal use only: will be called when 'get_mviews' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT mview_name FROM sys.user_mviews")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('mviews_result', result_array, namespace=self._namespace_url)

    def on_get_procedures(self):
        """For internal use only: will be called when 'get_procedures' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT object_name FROM SYS.user_procedures WHERE object_type='PROCEDURE'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('procedures_result', result_array, namespace=self._namespace_url)

    def on_get_functions(self):
        """For internal use only: will be called when 'get_functions' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT object_name FROM SYS.user_procedures WHERE object_type='FUNCTION'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('functions_result', result_array, namespace=self._namespace_url)

    def on_get_packages(self):
        """For internal use only: will be called when 'get_packages' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT object_name FROM SYS.user_procedures WHERE object_type='PACKAGE'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('packages_result', result_array, namespace=self._namespace_url)

    def on_get_sequences(self):
        """For internal use only: will be called when 'get_sequences' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT sequence_name FROM sys.user_sequences")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('sequences_result', result_array, namespace=self._namespace_url)

    def on_get_synonyms(self):
        """For internal use only: will be called when 'get_synonyms' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT synonym_name FROM sys.user_synonyms")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('synonyms_result', result_array, namespace=self._namespace_url)

    def on_get_public_synonyms(self):
        """For internal use only: will be called when 'get_public_synonyms' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT synonym_name FROM sys.all_synonyms")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('public_synonyms_result', result_array, namespace=self._namespace_url)

    def on_get_triggers(self):
        """For internal use only: will be called when 'get_triggers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT trigger_name FROM sys.user_triggers")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('triggers_result', result_array, namespace=self._namespace_url)

    def on_get_types(self):
        """For internal use only: will be called when 'get_types' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT type_name FROM sys.user_types")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('types_result', result_array, namespace=self._namespace_url)

    def on_get_queues(self):
        """For internal use only: will be called when 'get_queues' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT name FROM sys.user_queues")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('queues_result', result_array, namespace=self._namespace_url)

    def on_get_dblinks(self):
        """For internal use only: will be called when 'get_dblinks' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT db_link FROM sys.user_db_links")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('dblinks_result', result_array, namespace=self._namespace_url)

    def on_get_public_dblinks(self):
        """For internal use only: will be called when 'get_public_dblinks' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT db_link FROM sys.all_db_links WHERE owner='PUBLIC'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('public_dblinks_result', result_array, namespace=self._namespace_url)

    def on_get_directories(self):
        """For internal use only: will be called when 'get_directories' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT directory_name FROM sys.all_directories")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('directories_result', result_array, namespace=self._namespace_url)


class DatabaseTableServer(Namespace):
    """Class to interact with the database table available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseTableServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_table')
        self._namespace_url = '/oracle_db_table'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_columns(self, table_name):
        """For internal use only: will be called when 'get_columns' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.column_name,
                    CASE
                        WHEN a.data_type IN ('VARCHAR2', 'CHAR', 'VARCHAR')
                            THEN a.data_type || '(' || a.data_length || ' ' || decode(a.char_used, 'B', 'BYTE', 'C', 'CHAR') || ')'
                        ELSE a.data_type
                    END AS data_type,
                    a.nullable,
                    a.data_default,
                    a.column_id,
                    b.comments
                FROM SYS.user_tab_columns a,
                    SYS.user_col_comments b
                WHERE
                    a.table_name = b.table_name (+)
                    AND a.column_name = b.column_name (+)
                    AND a.table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'columnName': result[1],
                                 'dataType': result[2],
                                 'nullable': result[3],
                                 'dataDefault': result[4],
                                 'columnId': result[5],
                                 'comments': result[6]})
        emit('columns_result', result_array, namespace=self._namespace_url)