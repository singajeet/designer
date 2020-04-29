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
        # ########## Get Oracle Version ################
        version_str = ""
        query = "SELECT version FROM PRODUCT_COMPONENT_VERSION WHERE product LIKE '%Oracle%'"
        cursor.execute(query)
        for result in cursor:
            version_str = result[0]
        version_array = version_str.split('.')
        version = int(version_array[0])
        # ######### Get Procedures ######################
        if version <= 10:
            query = """
                    SELECT
                        a.object_name
                    FROM
                        SYS.user_procedures a,
                        SYS.user_objects b
                    WHERE
                        a.object_name = b.object_name
                        AND b.object_type='PROCEDURE'
                    """
        else:
            query = """
                    SELECT
                        object_name
                    FROM
                        SYS.user_procedures
                    WHERE
                        object_type='PROCEDURE'
                    """
        cursor = db_conn.cursor()
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('procedures_result', result_array, namespace=self._namespace_url)

    def on_get_functions(self):
        """For internal use only: will be called when 'get_functions' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        # ########## Get Oracle Version ################
        version_str = ""
        query = "SELECT version FROM PRODUCT_COMPONENT_VERSION WHERE product LIKE '%Oracle%'"
        cursor.execute(query)
        for result in cursor:
            version_str = result[0]
        version_array = version_str.split('.')
        version = int(version_array[0])
        # ######### Get Functions ######################
        if version <= 10:
            query = """
                    SELECT
                        a.object_name
                    FROM
                        SYS.user_procedures a,
                        SYS.user_objects b
                    WHERE
                        a.object_name = b.object_name
                        AND b.object_type='FUNCTION'
                    """
        else:
            query = """
                    SELECT
                        object_name
                    FROM
                        SYS.user_procedures
                    WHERE
                        object_type='FUNCTION'
                    """
        cursor = db_conn.cursor()
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('functions_result', result_array, namespace=self._namespace_url)

    def on_get_packages(self):
        """For internal use only: will be called when 'get_packages' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        # ########## Get Oracle Version ################
        version_str = ""
        query = "SELECT version FROM PRODUCT_COMPONENT_VERSION WHERE product LIKE '%Oracle%'"
        cursor.execute(query)
        for result in cursor:
            version_str = result[0]
        version_array = version_str.split('.')
        version = int(version_array[0])
        # ######### Get Functions ######################
        if version <= 10:
            query = """
                    SELECT
                        a.object_name
                    FROM
                        SYS.user_procedures a,
                        SYS.user_objects b
                    WHERE
                        a.object_name = b.object_name
                        AND b.object_type='PACKAGE'
                    """
        else:
            query = """
                    SELECT
                        object_name
                    FROM
                        SYS.user_procedures
                    WHERE
                        object_type='PACKAGE'
                    """
        cursor = db_conn.cursor()
        cursor.execute(query)
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
                            THEN a.data_type || '(' || a.data_length || ' ' || decode(a.char_used, 'B', 'BYTE', 'C', 'CHAR', a.char_used) || ')'
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

    def on_get_column_headers(self, table_name):
        """For internal use only: will be called when 'get_column_headers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT a.column_name
                FROM SYS.user_tab_columns a
                WHERE
                    a.table_name='%s'
                ORDER BY
                    a.column_id
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'field': result[0],
                                 'caption': result[0],
                                 'size': '100px'})
        emit('column_headers_result', result_array, namespace=self._namespace_url)

    def on_get_data(self, table_name):
        """For internal use only: will be called when 'get_data' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT a.column_name
                FROM SYS.user_tab_columns a
                WHERE
                    a.table_name='%s'
                ORDER BY
                    a.column_id
                """ % table_name
        cursor.execute(query)
        column_headers = []
        for result in cursor:
            column_headers.append(result[0])
        header_string = 'ROWNUM'
        for header in column_headers:
            header_string += ', ' + header
        query = """
                SELECT %s
                FROM %s
                """ % (header_string, table_name)
        cursor = db_conn.cursor()
        cursor.execute(query)
        result_array = []
        for result in cursor:
            row = {}
            for i in range(0, column_headers.__len__() + 1):
                if i == 0:
                    row['recid'] = result[i]
                else:
                    row[column_headers[i - 1]] = str(result[i])
            result_array.append(row)
        emit('data_result', result_array, namespace=self._namespace_url)

    def on_get_constraints(self, table_name):
        """For internal use only: will be called when 'get_constraints' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    a.constraint_name,
                    decode(a.constraint_type, 'P', 'Primary_Key', 'R', 'Foreign_Key', 'C', 'Check', 'U', 'Unique', a.constraint_type) AS constraint_type,
                    a.search_condition,
                    a.r_owner,
                    b.table_name AS r_table_name,
                    a.r_constraint_name,
                    a.delete_rule,
                    a.status,
                    a.deferrable,
                    a.validated,
                    a.generated,
                    a.bad,
                    a.rely,
                    to_char(a.last_change, 'MM/DD/YYYY') AS last_change,
                    a.index_owner,
                    a.index_name,
                    a.invalid,
                    a.view_related
                FROM
                    SYS.user_constraints a,
                    SYS.user_constraints b
                WHERE
                    a.r_constraint_name = b.constraint_name(+)
                    AND a.table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'constraintName': result[1],
                                 'constraintType': result[2],
                                 'searchCondition': result[3],
                                 'rOwner': result[4],
                                 'rTablename': result[5],
                                 'rConstraintName': result[6],
                                 'deleteRule': result[7],
                                 'status': result[8],
                                 'deferrable': result[9],
                                 'validated': result[10],
                                 'generated': result[11],
                                 'bad': result[12],
                                 'rely': result[13],
                                 'lastChange': result[14],
                                 'indexOwner': result[15],
                                 'indexName': result[16],
                                 'invalid': result[17],
                                 'viewRelated': result[18]
                                 })
        emit('constraints_result', result_array, namespace=self._namespace_url)

    def on_get_constraint_details(self, props):
        """For internal use only: will be called when 'get_constraint_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        table_name = props['tableName']
        constraint_name = props['constraintName']
        query = """
                SELECT
                    ROWNUM,
                    column_name,
                    position
                FROM
                    SYS.user_cons_columns
                WHERE
                    table_name='%s'
                    AND constraint_name='%s'
                """ % (table_name, constraint_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'columnName': result[1],
                                 'columnPosition': result[2]
                                 })
        emit('constraint_details_result', result_array, namespace=self._namespace_url)

    def on_get_grants(self, table_name):
        """For internal use only: will be called when 'get_grants' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    privilege,
                    grantee,
                    grantable,
                    grantor,
                    table_name
                FROM
                    SYS.user_tab_privs
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'privilege': result[1],
                                 'grantee': result[2],
                                 'grantable': result[3],
                                 'grantor': result[4],
                                 'objectName': result[5]
                                 })
        emit('grants_result', result_array, namespace=self._namespace_url)

    def on_get_statistics(self, table_name):
        """For internal use only: will be called when 'get_statistics' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM (
                SELECT 'NUM_ROWS' AS Name, to_char(num_rows) AS Value FROM SYS.user_tab_statistics WHERE table_name='%s'
                UNION
                SELECT 'BLOCKS' AS Name, to_char(blocks) AS Value FROM SYS.user_tab_statistics WHERE table_name='%s'
                UNION
                SELECT 'AVG_ROW_LEN' AS Name, to_char(avg_row_len) AS Value FROM SYS.user_tab_statistics WHERE table_name='%s'
                UNION
                SELECT 'SAMPLE_SIZE' AS Name, to_char(sample_size) AS Value FROM SYS.user_tab_statistics WHERE table_name='%s'
                UNION
                SELECT 'LAST_ANALYZED' AS Name, to_char(last_analyzed) AS Value FROM SYS.user_tab_statistics WHERE table_name='%s'
                ) a ORDER BY Name
                """ % (table_name, table_name, table_name, table_name, table_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]
                                 })
        emit('statistics_result', result_array, namespace=self._namespace_url)

    def on_get_statistics_details(self, table_name):
        """For internal use only: will be called when 'get_statistics_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    table_name,
                    column_name,
                    num_distinct,
                    substr(low_value, 1) AS low_value,
                    substr(high_value, 1) AS high_value,
                    density,
                    num_nulls,
                    num_buckets,
                    to_char(last_analyzed) AS last_analyzed,
                    sample_size,
                    global_stats,
                    user_stats,
                    avg_col_len,
                    histogram
                FROM
                    SYS.user_tab_columns
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'tableName': result[1],
                                 'columnName': result[2],
                                 'numDistinct': result[3],
                                 'lowValue': result[4],
                                 'highValue': result[5],
                                 'density': result[6],
                                 'numNulls': result[7],
                                 'numBuckets': result[8],
                                 'lastAnalyzed': result[9],
                                 'sampleSize': result[10],
                                 'globalStats': result[11],
                                 'userStats': result[12],
                                 'avgColLen': result[13],
                                 'histogram': result[14],
                                 })
        emit('statistics_details_result', result_array, namespace=self._namespace_url)

    def on_get_triggers(self, table_name):
        """For internal use only: will be called when 'get_triggers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    trigger_name,
                    trigger_type,
                    table_owner as trigger_owner,
                    triggering_event,
                    status,
                    table_name
                FROM
                    SYS.user_triggers
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'triggerName': result[1],
                                 'triggerType': result[2],
                                 'triggerOwner': result[3],
                                 'triggeringEvent': result[4],
                                 'status': result[5],
                                 'tableName': result[6]
                                 })
        emit('triggers_result', result_array, namespace=self._namespace_url)

    def on_get_trigger_body(self, trigger_name):
        """For internal use only: will be called when 'get_trigger_body' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    text
                FROM
                    SYS.user_source
                WHERE
                    name='%s'
                    AND type='TRIGGER'
                ORDER BY line
                """ % trigger_name
        cursor.execute(query)
        result_string = ""
        for result in cursor:
            result_string += result[0]
        emit('trigger_body_result', result_string, namespace=self._namespace_url)

    def on_get_dependencies(self, table_name):
        """For internal use only: will be called when 'get_dependencies' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    name,
                    type,
                    referenced_owner,
                    referenced_name,
                    referenced_type
                FROM
                    SYS.user_dependencies
                WHERE
                    referenced_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'type': result[2],
                                 'referencedOwner': result[3],
                                 'referencedName': result[4],
                                 'referencedType': result[5]
                                 })
        emit('dependencies_result', result_array, namespace=self._namespace_url)

    def on_get_dependencies_details(self, table_name):
        """For internal use only: will be called when 'get_dependencies_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    name,
                    type,
                    referenced_owner,
                    referenced_name,
                    referenced_type
                FROM
                    SYS.user_dependencies
                WHERE
                    name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'type': result[2],
                                 'referencedOwner': result[3],
                                 'referencedName': result[4],
                                 'referencedType': result[5]
                                 })
        emit('dependencies_details_result', result_array, namespace=self._namespace_url)

    def on_get_indexes(self, table_name):
        """For internal use only: will be called when 'get_indexes' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        # ########## Get Oracle Version ################
        version_str = ""
        query = "SELECT version FROM PRODUCT_COMPONENT_VERSION WHERE product LIKE '%Oracle%'"
        cursor.execute(query)
        for result in cursor:
            version_str = result[0]
        version_array = version_str.split('.')
        version = int(version_array[0])
        # ######### Get Indexes based on version #####################
        cursor = db_conn.cursor()
        if version <= 10:
            query = """
                SELECT
                    ROWNUM,
                    a.index_name,
                    a.uniqueness,
                    a.status,
                    a.index_type,
                    a.temporary,
                    a.partitioned,
                    a.funcidx_status,
                    a.join_index,
                    b.columns
                FROM
                    SYS.user_indexes a,
                    (SELECT
                        index_name,
                        rtrim(xmlagg(xmlelement(e, column_name ||', ')).extract('//text()'), ', ') AS columns
                    FROM
                        SYS.user_ind_columns
                    GROUP BY index_name) b
                WHERE
                    a.index_name = b.index_name
                    AND a.table_name='%s'
                """ % table_name
        else:
            query = """
                    SELECT
                        ROWNUM,
                        a.index_name,
                        a.uniqueness,
                        a.status,
                        a.index_type,
                        a.temporary,
                        a.partitioned,
                        a.funcidx_status,
                        a.join_index,
                        b.columns
                    FROM
                        SYS.user_indexes a,
                        (SELECT
                            index_name,
                            LISTAGG(column_name,', ')
                                WITHIN GROUP
                                (ORDER BY index_name)
                            AS columns
                        FROM
                            SYS.user_ind_columns
                        GROUP BY index_name) b
                    WHERE
                        a.index_name = b.index_name
                        AND a.table_name='%s'
                    """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'indexName': result[1],
                                 'uniqueness': result[2],
                                 'status': result[3],
                                 'indexType': result[4],
                                 'temporary': result[5],
                                 'partitioned': result[6],
                                 'funcIdxStatus': result[7],
                                 'joinIndex': result[8],
                                 'columns': result[9]
                                 })
        emit('indexes_result', result_array, namespace=self._namespace_url)

    def on_get_indexes_details(self, props):
        """For internal use only: will be called when 'get_indexes_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        table_name = props['tableName']
        index_name = props['indexName']
        query = """
                SELECT
                    ROWNUM,
                    a.index_name,
                    a.table_owner,
                    a.table_name,
                    b.column_name,
                    b.column_position,
                    b.column_length,
                    b.char_length,
                    b.descend,
                    c.column_expression
                FROM
                    SYS.user_indexes a,
                    SYS.user_ind_columns b,
                    sys.user_ind_expressions c
                WHERE
                    a.index_name = b.index_name (+)
                    AND a.table_name = b.table_name (+)
                    AND a.index_name = c.index_name (+)
                    AND a.table_name = c.table_name (+)
                    AND a.table_name='%s'
                    AND a.index_name='%s'
                """ % (table_name, index_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'indexName': result[1],
                                 'tableOwner': result[2],
                                 'tableName': result[3],
                                 'columnName': result[4],
                                 'columnPosition': result[5],
                                 'columnLength': result[6],
                                 'charLength': result[7],
                                 'descend': result[8],
                                 'columnExpression': result[9]
                                 })
        emit('indexes_details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, table_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('TABLE', '%s')) FROM dual
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        sql += ';\n\n'
        # ########## Get comments on columns if available ##########
        cursor = db_conn.cursor()
        query = """
                SELECT
                    'COMMENT ON COLUMN ' ||
                    '"' || sys_context( 'userenv', 'current_schema' ) ||
                    '"."' || table_name ||
                    '"."' || column_name ||
                    '" IS ''' || comments || ''';'
                FROM
                    SYS.user_col_comments
                WHERE
                    table_name='%s'
                    AND comments IS NOT NULL
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += '  ' + result[0] + '\n'
        # ########## Get comments on table if available ##########
        cursor = db_conn.cursor()
        query = """
                SELECT
                    'COMMENT ON TABLE ' ||
                    '"' || sys_context( 'userenv', 'current_schema' ) ||
                                    '"."' || table_name ||
                                    '" IS ''' || comments || ''';'
                FROM
                    SYS.user_tab_comments
                WHERE
                    table_name='%s'
                    AND comments IS NOT NULL
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += '  ' + result[0] + '\n'
        # ########## Get indexes if available #################
        cursor = db_conn.cursor()
        query = """
                SELECT
                    to_char(dbms_metadata.get_ddl('INDEX', index_name))
                FROM
                    SYS.user_indexes
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += result[0] + '\n'
        # ########## Get Triggers if available ##############
        cursor = db_conn.cursor()
        query = """
                SELECT
                    to_char(dbms_metadata.get_ddl('TRIGGER', trigger_name))
                FROM
                    SYS.user_triggers
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += result[0] + '\n'
        emit('sql_result', sql, namespace=self._namespace_url)


class DatabaseViewServer(Namespace):
    """Class to interact with the database view available under schema
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
        Namespace.__init__(self, '/oracle_db_view')
        self._namespace_url = '/oracle_db_view'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_columns(self, view_name):
        """For internal use only: will be called when 'get_columns' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    a.column_name,
                    CASE
                        WHEN a.data_type IN ('VARCHAR2', 'CHAR', 'VARCHAR')
                            THEN a.data_type || '(' || a.data_length || ' ' || decode(a.char_used, 'B', 'BYTE', 'C', 'CHAR', a.char_used) || ')'
                        ELSE a.data_type
                    END AS data_type,
                    a.nullable,
                    a.data_default,
                    a.column_id,
                    c.comments,
                    b.insertable,
                    b.updatable,
                    b.deletable
                FROM
                    SYS.all_tab_cols a,
                    SYS.user_updatable_columns b,
                    SYS.user_col_comments c
                WHERE
                    a.table_name = b.table_name (+)
                    AND a.column_name = b.column_name (+)
                    AND a.table_name = c.table_name (+)
                    AND a.column_name = c.column_name (+)
                    AND a.table_name='%s'
                ORDER BY a.column_id
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'columnName': result[1],
                                 'dataType': result[2],
                                 'nullable': result[3],
                                 'dataDefault': result[4],
                                 'columnId': result[5],
                                 'comments': result[6],
                                 'insertable': result[7],
                                 'updatable': result[8],
                                 'deletable': result[9]})
        emit('columns_result', result_array, namespace=self._namespace_url)

    def on_get_column_headers(self, view_name):
        """For internal use only: will be called when 'get_column_headers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT a.column_name
                FROM SYS.user_tab_columns a
                WHERE
                    a.table_name='%s'
                ORDER BY
                    a.column_id
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'field': result[0],
                                 'caption': result[0],
                                 'size': '100px'})
        emit('column_headers_result', result_array, namespace=self._namespace_url)

    def on_get_data(self, view_name):
        """For internal use only: will be called when 'get_data' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT a.column_name
                FROM SYS.user_tab_columns a
                WHERE
                    a.table_name='%s'
                ORDER BY
                    a.column_id
                """ % view_name
        cursor.execute(query)
        column_headers = []
        for result in cursor:
            column_headers.append(result[0])
        header_string = 'ROWNUM'
        for header in column_headers:
            header_string += ', ' + header
        query = """
                SELECT %s
                FROM %s
                """ % (header_string, view_name)
        cursor = db_conn.cursor()
        cursor.execute(query)
        result_array = []
        for result in cursor:
            row = {}
            for i in range(0, column_headers.__len__() + 1):
                if i == 0:
                    row['recid'] = result[i]
                else:
                    row[column_headers[i - 1]] = str(result[i])
            result_array.append(row)
        emit('data_result', result_array, namespace=self._namespace_url)

    def on_get_grants(self, view_name):
        """For internal use only: will be called when 'get_grants' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    privilege,
                    grantee,
                    grantable,
                    grantor,
                    table_name
                FROM
                    SYS.user_tab_privs
                WHERE
                    table_name='%s'
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'privilege': result[1],
                                 'grantee': result[2],
                                 'grantable': result[3],
                                 'grantor': result[4],
                                 'objectName': result[5]
                                 })
        emit('grants_result', result_array, namespace=self._namespace_url)

    def on_get_triggers(self, view_name):
        """For internal use only: will be called when 'get_triggers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    trigger_name,
                    trigger_type,
                    table_owner as trigger_owner,
                    triggering_event,
                    status,
                    table_name
                FROM
                    SYS.user_triggers
                WHERE
                    table_name='%s'
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'triggerName': result[1],
                                 'triggerType': result[2],
                                 'triggerOwner': result[3],
                                 'triggeringEvent': result[4],
                                 'status': result[5],
                                 'viewName': result[6]
                                 })
        emit('triggers_result', result_array, namespace=self._namespace_url)

    def on_get_trigger_body(self, trigger_name):
        """For internal use only: will be called when 'get_trigger_body' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    text
                FROM
                    SYS.user_source
                WHERE
                    name='%s'
                    AND type='TRIGGER'
                ORDER BY line
                """ % trigger_name
        cursor.execute(query)
        result_string = ""
        for result in cursor:
            result_string += result[0]
        emit('trigger_body_result', result_string, namespace=self._namespace_url)

    def on_get_dependencies(self, view_name):
        """For internal use only: will be called when 'get_dependencies' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    name,
                    type,
                    referenced_owner,
                    referenced_name,
                    referenced_type
                FROM
                    SYS.user_dependencies
                WHERE
                    referenced_name='%s'
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'type': result[2],
                                 'referencedOwner': result[3],
                                 'referencedName': result[4],
                                 'referencedType': result[5]
                                 })
        emit('dependencies_result', result_array, namespace=self._namespace_url)

    def on_get_dependencies_details(self, view_name):
        """For internal use only: will be called when 'get_dependencies_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    name,
                    type,
                    referenced_owner,
                    referenced_name,
                    referenced_type
                FROM
                    SYS.user_dependencies
                WHERE
                    name='%s'
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'type': result[2],
                                 'referencedOwner': result[3],
                                 'referencedName': result[4],
                                 'referencedType': result[5]
                                 })
        emit('dependencies_details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, table_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of view ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('VIEW', '%s')) FROM dual
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        sql += ';\n\n'
        # ########## Get comments on columns if available ##########
        cursor = db_conn.cursor()
        query = """
                SELECT
                    'COMMENT ON COLUMN ' ||
                    '"' || sys_context( 'userenv', 'current_schema' ) ||
                    '"."' || table_name ||
                    '"."' || column_name ||
                    '" IS ''' || comments || ''';'
                FROM
                    SYS.user_col_comments
                WHERE
                    table_name='%s'
                    AND comments IS NOT NULL
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += '  ' + result[0] + '\n'
        # ########## Get comments on view if available ##########
        cursor = db_conn.cursor()
        query = """
                SELECT
                    'COMMENT ON TABLE ' ||
                    '"' || sys_context( 'userenv', 'current_schema' ) ||
                                    '"."' || table_name ||
                                    '" IS ''' || comments || ''';'
                FROM
                    SYS.user_tab_comments
                WHERE
                    table_name='%s'
                    AND comments IS NOT NULL
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += '  ' + result[0] + '\n'
        # ########## Get Triggers if available ##############
        cursor = db_conn.cursor()
        query = """
                SELECT
                    to_char(dbms_metadata.get_ddl('TRIGGER', trigger_name))
                FROM
                    SYS.user_triggers
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        for result in cursor:
            sql += result[0] + '\n'
        emit('sql_result', sql, namespace=self._namespace_url)

    def on_get_errors(self, view_name):
        """For internal use only: will be called when 'get_errors' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    attribute,
                    line || ':' || position,
                    text
                FROM
                    SYS.user_errors
                WHERE
                    name='%s'
                """ % view_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'attribute': result[1],
                                 'linePosition': result[2],
                                 'text': result[3]
                                 })
        emit('errors_result', result_array, namespace=self._namespace_url)


class DatabaseIndexServer(Namespace):
    """Class to interact with the database index available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseIndexServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_index')
        self._namespace_url = '/oracle_db_index'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_columns(self, index_name):
        """For internal use only: will be called when 'get_columns' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    a.index_name,
                    a.table_owner,
                    a.table_name,
                    b.column_name,
                    b.column_position,
                    b.descend
                FROM
                    SYS.user_indexes a,
                    SYS.user_ind_columns b
                WHERE
                    a.index_name = b.index_name (+)
                    AND a.table_name = b.table_name (+)
                    AND a.index_name='%s'
                """ % index_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'indexName': result[1],
                                 'tableOwner': result[2],
                                 'tableName': result[3],
                                 'columnName': result[4],
                                 'columnPosition': result[5],
                                 'descend': result[6]})
        emit('columns_result', result_array, namespace=self._namespace_url)

    def on_get_statistics(self, index_name):
        """For internal use only: will be called when 'get_statistics' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.*
                FROM
                (
                    SELECT 'INDEX_NAME', INDEX_NAME FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'TABLE_OWNER', TABLE_OWNER FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'TABLE_NAME', TABLE_NAME FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'PARTITION_NAME', PARTITION_NAME FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'PARTITION_POSITION', to_char(PARTITION_POSITION) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'SUBPARTITION_NAME', SUBPARTITION_NAME FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'SUBPARTITION_POSITION', to_char(SUBPARTITION_POSITION) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'OBJECT_TYPE', OBJECT_TYPE FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'BLEVEL', to_char(BLEVEL)  FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'LEAF_BLOCKS', to_char(LEAF_BLOCKS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'DISTINCT_KEYS', to_char(DISTINCT_KEYS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'AVG_LEAF_BLOCKS_PER_KEY', to_char(AVG_LEAF_BLOCKS_PER_KEY) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'AVG_DATA_BLOCKS_PER_KEY', to_char(AVG_DATA_BLOCKS_PER_KEY) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'CLUSTERING_FACTOR', to_char(CLUSTERING_FACTOR) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'NUM_ROWS', to_char(NUM_ROWS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'AVG_CACHED_BLOCKS', to_char(AVG_CACHED_BLOCKS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'AVG_CACHE_HIT_RATIO', to_char(AVG_CACHE_HIT_RATIO) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'SAMPLE_SIZE', to_char(SAMPLE_SIZE) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'LAST_ANALYZED', to_char(LAST_ANALYZED) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'GLOBAL_STATS', to_char(GLOBAL_STATS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'USER_STATS', to_char(USER_STATS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'STATTYPE_LOCKED', to_char(STATTYPE_LOCKED) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                    UNION
                    SELECT 'STALE_STATS', to_char(STALE_STATS) FROM SYS.user_ind_statistics WHERE index_name='{0}'
                ) a
                """.format(index_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('statistics_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, index_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('INDEX', '%s')) FROM dual
                """ % index_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        emit('sql_result', sql, namespace=self._namespace_url)
