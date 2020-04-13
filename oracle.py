"""
This module provides the classes necessary to interact with the database.
Each class exposes an Flask-SocketIO based websockets to interact
with oracle database

Author: Ajeet Singh
Date: 11/04/2020
"""
from flask_socketio import emit, Namespace
import cx_Oracle

class DatabaseConnection(Namespace):
    """DatabaseConnection class provides methods to connect to Oracle DB
    and provides the connection instance to be used by other classes
    """

    _connection_string = None
    _username = None
    _password = None
    _db = None
    _socket_io = None
    _namespace_url = None

    def __init__(self, socket_io):
        """Default constructor for DatabaseConnection class

            Args:
                socket_io (SocketIO, required): An instance of SocketIO class
        """
        Namespace.__init__(self, '/oracle_db_connection')
        self._namespace_url = '/oracle_db_connection'
        self._socket_io = socket_io
        socket_io.on_namespace(self)

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
        except Exception as e:
            print("DatabaseConnection: Error: " + str(e))
            msg = "Cannot connect to database: " + str(e)
            emit('failed',{'status': False, 'message': msg},
                 namespace=self._namespace_url)

    def get_connection(self):
        return self._db


class DatabaseSchema(Namespace):
    """Class to interact with any given schema
    """

    _socket_io = None
    _schema_name = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, db_connection):
        """Default constructor for DatabaseSchema class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                connection (DatabaseConnection): An instance of DatabaseConnection Class
        """
        Namespace.__init__(self, '/oracle_db_schema')
        self._namespace_url = '/oracle_db_schema'
        self._socket_io = socket_io
        self._db_connection = db_connection
        print("DatabaseSchema: Object created with db instance: " + str(self._db_connection))
        socket_io.on_namespace(self)

    def on_set_schema(self, schema_name):
        """For internal use only: will be called when 'set_schema' event will be emitted

            Args:
                schema_name (string): Name of the db schema
        """
        print("DatabaseSchema: Setting up schema name: " + schema_name)
        self._schema_name = schema_name

    def on_get_tables(self):
        """For internal use only: will be called when 'get_tables' event will be emitted
        """
        print("DatabaseSchema: Connecting to DB using instance: " + str(self._db_connection))
        db_conn = self._db_connection.get_connection()
        print("DatabaseSchema: CX Oracle instance: " + str(db_conn))
        cursor = db_conn.cursor()
        cursor.execute("SELECT table_name FROM sys.dba_tables WHERE owner='" + self._schema_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('tables_result', result_array, namespace=self._namespace_url)
