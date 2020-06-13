"""
This module provides the classes necessary to interact with the database.
Each class exposes an Flask-SocketIO based websockets to interact
with oracle database

Author: Ajeet Singh
Date: 11/04/2020
"""
import logging
import json
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
        cursor.execute("SELECT table_name FROM sys.user_tables ORDER BY table_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('tables_result', result_array, namespace=self._namespace_url)

    def on_get_views(self):
        """For internal use only: will be called when 'get_views' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT view_name FROM sys.user_views ORDER BY view_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('views_result', result_array, namespace=self._namespace_url)

    def on_get_indexes(self):
        """For internal use only: will be called when 'get_indexes' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT index_name FROM sys.user_indexes ORDER BY index_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('indexes_result', result_array, namespace=self._namespace_url)

    def on_get_mviews(self):
        """For internal use only: will be called when 'get_mviews' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT mview_name FROM sys.user_mviews ORDER BY mview_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('mviews_result', result_array, namespace=self._namespace_url)

    def on_get_procedures(self):
        """For internal use only: will be called when 'get_procedures' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        query = """
                SELECT
                    object_name
                FROM
                    SYS.user_objects
                WHERE
                    object_type='PROCEDURE'
                ORDER BY object_name
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
        query = """
                SELECT
                    object_name
                FROM
                    SYS.user_objects
                WHERE
                    object_type='FUNCTION'
                ORDER BY object_name
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
        query = """
                    SELECT
                        object_name
                    FROM
                        SYS.user_objects
                    WHERE
                        object_type='PACKAGE'
                ORDER BY object_name
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
        cursor.execute("SELECT sequence_name FROM sys.user_sequences ORDER BY sequence_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('sequences_result', result_array, namespace=self._namespace_url)

    def on_get_synonyms(self):
        """For internal use only: will be called when 'get_synonyms' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT synonym_name FROM sys.user_synonyms ORDER BY synonym_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('synonyms_result', result_array, namespace=self._namespace_url)

    def on_get_public_synonyms(self):
        """For internal use only: will be called when 'get_public_synonyms' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT synonym_name FROM sys.all_synonyms ORDER BY synonym_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('public_synonyms_result', result_array, namespace=self._namespace_url)

    def on_get_triggers(self):
        """For internal use only: will be called when 'get_triggers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT trigger_name FROM sys.user_triggers ORDER BY trigger_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('triggers_result', result_array, namespace=self._namespace_url)

    def on_get_types(self):
        """For internal use only: will be called when 'get_types' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT type_name FROM sys.user_types ORDER BY type_name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('types_result', result_array, namespace=self._namespace_url)

    def on_get_queues(self):
        """For internal use only: will be called when 'get_queues' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT name FROM sys.user_queues ORDER BY name")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('queues_result', result_array, namespace=self._namespace_url)

    def on_get_dblinks(self):
        """For internal use only: will be called when 'get_dblinks' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT db_link FROM sys.user_db_links ORDER BY db_link")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('dblinks_result', result_array, namespace=self._namespace_url)

    def on_get_public_dblinks(self):
        """For internal use only: will be called when 'get_public_dblinks' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT db_link FROM sys.all_db_links WHERE owner='PUBLIC' ORDER BY db_link")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('public_dblinks_result', result_array, namespace=self._namespace_url)

    def on_get_directories(self):
        """For internal use only: will be called when 'get_directories' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT directory_name FROM sys.all_directories ORDER BY directory_name")
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
                        WHEN a.data_type IN ('VARCHAR2', 'CHAR', 'VARCHAR', 'CHAR VARYING', 'CHARACTER', 'CHARACTER VARYING')
                            THEN a.data_type || '(' || a.data_length || ' ' || decode(a.char_used, 'B', 'BYTE', 'C', 'CHAR', a.char_used) || ')'
                        WHEN a.data_type IN ('NUMBER', 'DEC', 'DECIMAL', 'NUMERIC') AND a.data_precision IS NOT NULL AND a.data_scale IS NOT NULL
                            THEN a.data_type || '(' || a.data_precision || ', ' || a.data_scale || ')'
                        WHEN a.data_type IN ('NUMBER', 'DEC', 'DECIMAL', 'NUMERIC') AND a.data_precision IS NOT NULL AND a.data_scale IS NULL
                            THEN a.data_type || '(' || a.data_precision || ')'
                        WHEN a.data_type IN ('NATIONAL CHAR', 'NATIONAL CHAR VARYING', 'NATIONAL CHARACTER', 'NATIONAL CHARACTER VARYING', 'NCHAR', 'NCHAR VARYING', 'NVARCHAR2', 'RAW', 'UROWID') AND a.char_length IS NOT NULL
                            THEN a.data_type || '(' || a.char_length || ' CHAR)'
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

    def on_get_columns_to_edit(self, table_name):
        """For internal use only: will be called when 'get_columns_to_edit' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    b.column_id,
                    CASE
                        WHEN b.column_name = d.column_name THEN '<img src="/static/icons/primarykey.png" />'
                        ELSE ''
                    END AS pk,
                    b.column_name,
                    b.data_type,
                    CASE 
                        WHEN b.data_type IN ('VARCHAR2', 'CHAR', 'VARCHAR', 'CHAR VARYING', 'CHARACTER', 'CHARACTER VARYING')
                            THEN b.data_length
                        WHEN b.data_type IN ('NUMBER', 'DEC', 'DECIMAL', 'NUMERIC')
                            THEN b.data_precision
                        WHEN b.data_type IN ('NATIONAL CHAR', 'NATIONAL CHAR VARYING', 'NATIONAL CHARACTER', 'NATIONAL CHARACTER VARYING', 'NCHAR', 'NCHAR VARYING', 'NVARCHAR2', 'RAW', 'UROWID')
                            THEN b.char_length
                        ELSE CAST(NULL AS NUMBER)
                    END AS data_length,
                    decode(b.nullable, 'N', 'true', 'Y', 'false', b.nullable) AS not_null,
                    b.data_default,
                    e.comments,
                    b.data_precision,
                    b.data_scale,
                    decode(b.char_used, 'C', 'CHAR', 'B', 'BYTE', b.char_used) AS unit,
                    f.segment_name,
                    f.chunk,
                    f.freepools,
                    decode(f.cache, 'YES', 'CACHE', 'NO', 'NO CACHE', 'CACHEREADS', 'CACHE READS', f.cache) AS cache,
                    decode(f.in_row, 'YES', 'Enabled', 'NO', 'Disabled', f.in_row) AS in_row,
                    f.pctversion,
                    decode(f.retention, 900, 'true', 'false') AS retention,
                    g.virtual_column,
                    b.data_type_owner AS schema,
                    CASE
                        WHEN b.column_name = d.column_name THEN d.constraint_name
                        ELSE ''
                    END AS constraint_name,
                    CASE
                        WHEN b.column_name = d.column_name THEN c.index_name
                        ELSE ''
                    END AS index_name,
                    CASE
                        WHEN b.column_name = d.column_name THEN 'EXISTING'
                        ELSE ''
                    END AS pk_type,
                    CASE 
                        WHEN f.segment_name IS NOT NULL THEN 'true'
                        ELSE 'false'
                    END AS lob_storage_enabled
                FROM
                    SYS.user_tables a,
                    SYS.user_tab_columns b,
                    SYS.user_constraints c,
                    SYS.user_cons_columns d,
                    SYS.user_col_comments e,
                    SYS.user_lobs f,
                    SYS.user_tab_cols g
                WHERE
                    a.table_name = b.table_name
                    AND a.table_name = c.table_name (+)
                    AND c.table_name = d.table_name (+)
                    AND c.constraint_name = d.constraint_name (+)
                    AND b.table_name = e.table_name (+)
                    AND b.column_name = e.column_name (+)
                    AND b.table_name = f.table_name (+)
                    AND b.column_name = f.column_name (+)
                    AND b.table_name = g.table_name (+)
                    AND b.column_name = g.column_name (+)
                    AND a.table_name = '%s'
                    AND c.constraint_type (+)= 'P'
                ORDER BY
                    b.column_id
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'pk': result[1],
                                 'columnName': result[2],
                                 'dataType': result[3],
                                 'size': result[4],
                                 'notNull': json.loads(result[5]),
                                 'default': result[6],
                                 'comments': result[7],
                                 'precision': result[8],
                                 'scale': result[9],
                                 'unit': result[10],
                                 'lobSegmentName': result[11],
                                 'lobChunk': result[12],
                                 'lobFreePools': result[13],
                                 'lobCache': result[14],
                                 'lobStorageInRow': result[15],
                                 'lobPctVersion': result[16],
                                 'lobRetention': json.loads(result[17]),
                                 'virtual': result[18],
                                 'schema': result[19],
                                 'pkConstraintName': result[20],
                                 'pkIndexName': result[21],
                                 'pkType': result[22],
                                 'lobStorageEnabled': json.loads(result[23])})
        emit('columns_result_to_edit', result_array, namespace=self._namespace_url)

    def on_get_column_constraints(self, props):
        """For internal use only: will be called when 'get_column_constraints' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        table_name = props['tableName']
        column_name = props['columnName']
        query = """
                SELECT
                    ROWNUM,
                    a.constraint_name,
                    decode(a.constraint_type,
                            'P', '<img src="/static/icons/primarykey.png" /> Primary Key',
                            'R', '<img src="/static/icons/foreignkey.png" /> Foreign Key',
                            'U', '<img src="/static/icons/key.png" /> Unique',
                            'C', '<img src="/static/icons/constraint.png" /> Check',
                            a.constraint_type) AS constraint_type
                FROM
                    SYS.user_constraints a,
                    SYS.user_cons_columns b
                WHERE
                    a.constraint_name = b.constraint_name
                    AND a.table_name = b.table_name
                    AND a.table_name='%s'
                    AND b.column_name='%s'
                """ % (table_name, column_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'constraintName': result[1],
                                 'constraintType': result[2]
                                 })
        emit('column_constraints_result', result_array, namespace=self._namespace_url)

    def on_get_column_indexes(self, props):
        """For internal use only: will be called when 'get_column_indexes' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        table_name = props['tableName']
        column_name = props['columnName']
        query = """
                SELECT
                    ROWNUM,
                    a.index_name,
                    decode(a.uniqueness,
                            'UNIQUE', 'Unique',
                            'NONUNIQUE', 'Non-Unique',
                            a.uniqueness) AS index_type
                FROM
                    SYS.user_indexes a,
                    SYS.user_ind_columns b
                WHERE
                    a.index_name = b.index_name
                    AND a.table_name = b.table_name
                    AND a.table_name='%s'
                    AND b.column_name='%s'
                """ % (table_name, column_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'indexName': result[1],
                                 'indexType': result[2]
                                 })
        emit('column_indexes_result', result_array, namespace=self._namespace_url)

    def on_get_identity_column_details(self, props):
        """For internal use only: will be called when 'get_identity_column_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        table_name = props['tableName']
        column_name = props['columnName']
        query = """
                SELECT /*OracleDictionaryQueries.ALL_TABLE_COLSEQ_TRIGGERS_QUERY*/
                       S.NAME AS TRG,
                       SUBSTR(
                            TRIM(S.TEXT), INSTR(TRIM(S.TEXT), 'SELECT ') + 7, 
                            LENGTH(SUBSTR(TRIM(S.TEXT), INSTR(TRIM(S.TEXT), 'SELECT ') + 7)) - 
                            LENGTH(SUBSTR(TRIM(S.TEXT), INSTR(TRIM(S.TEXT), '.NEXTVAL ')))
                            ) AS SEQ
                FROM   SYS.ALL_SOURCE S
                WHERE  S.OWNER = SYS_CONTEXT( 'userenv', 'current_schema' ) 
                AND    S.TYPE = 'TRIGGER'
                AND EXISTS (SELECT 1
                            FROM   SYS.ALL_TRIGGERS T
                            WHERE  T.OWNER = S.OWNER
                            AND    T.TABLE_NAME = '%s' 
                            AND    T.TRIGGER_NAME = S.NAME
                            AND    T.TABLE_OWNER = S.OWNER
                            AND    T.BASE_OBJECT_TYPE = 'TABLE'
                            AND    T.TRIGGER_TYPE LIKE '%%EACH ROW'
                            AND    T.TRIGGERING_EVENT LIKE '%%INSERT%%'
                            AND EXISTS (SELECT 1
                                        FROM   SYS.ALL_SOURCE S2
                                        WHERE  S2.OWNER = S.OWNER
                                        AND    S2.NAME = S.NAME
                                        AND    S2.TYPE = S2.TYPE
                                        AND    S2.TEXT LIKE '%%COLUMN_SEQUENCES%%'
                                        )
                             )
                AND S.TEXT LIKE '%%NEXTVAL%%'
                AND S.TEXT LIKE '%%:NEW.%s%%'
                ORDER BY S.NAME, S.LINE
                """ % (table_name, column_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'triggerName': result[0],
                                 'sequenceName': result[1]
                                 })
        emit('identity_column_details_result', result_array, namespace=self._namespace_url)

    def on_get_sequences_list(self, schema_name):
        """For internal use only: will be called when 'get_sequences_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT sequence_name FROM sys.all_sequences WHERE sequence_owner='" + schema_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('sequences_list_result', result_array, namespace=self._namespace_url)

    def on_get_triggers_list(self):
        """For internal use only: will be called when 'get_triggers_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT trigger_name FROM sys.user_triggers")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('triggers_list_result', result_array, namespace=self._namespace_url)

    def on_get_schemas_list(self):
        """For internal use only: will be called when 'get_schemas_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT username FROM SYS.all_users")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('schemas_list_result', result_array, namespace=self._namespace_url)

    def on_get_types_list(self, schema_name):
        """For internal use only: will be called when 'get_types_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT type_name FROM SYS.all_types WHERE owner='" + schema_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('types_list_result', result_array, namespace=self._namespace_url)

    def on_get_constraints_to_edit(self, table_name):
        """For internal use only: will be called when 'get_constraints_to_edit' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    CASE a.constraint_type
                        WHEN 'P' THEN '<img src="/static/icons/primarykey.png" /> Primary Key'
                        WHEN 'R' THEN '<img src="/static/icons/foreignkey.png" /> Foreign Key'
                        WHEN 'U' THEN '<img src="/static/icons/key.png" /> Unique'
                        WHEN 'C' THEN '<img src="/static/icons/constraint.png" /> Check'
                    END AS constraint_type,
                    a.constraint_name AS name,
                    decode(a.status, 'ENABLED', 'true', 'false') AS enabled,
                    decode(a.deferrable,
                            'INITIALLY IMMEDIATE', 'Initially Immediate',
                            'NOT DEFERRABLE', 'Not Deferrable',
                            'INITIALLY DEFERRED', 'Initially Deferred',
                            a.deferrable) as deferrable_state,
                    a.constraint_type,
                    a.search_condition AS check_condition,
                    a.r_owner,
                    b.table_name,
                    a.r_constraint_name,
                    decode(a.delete_rule, 'NO ACTION', 'No Action', 'CASCADE', 'Cascade', 'SET NULL', 'Set Null', a.delete_rule) AS delete_rule,
                    a.index_name,
                    a.constraint_name AS constraintName
                FROM
                    SYS.user_constraints a,
                    SYS.user_constraints b
                WHERE
                    a.r_constraint_name = b.constraint_name (+)
                    AND a.table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'type': result[1],
                                 'name': result[2],
                                 'enabled': json.loads(result[3]),
                                 'deferrableState': result[4],
                                 'constraintType': result[5],
                                 'checkCondition': result[6],
                                 'refOwner': result[7],
                                 'refTable': result[8],
                                 'refConstraintName': result[9],
                                 'deleteRule': result[10],
                                 'indexName': result[11],
                                 'constraintName': result[12]
                                 })
        emit('constraints_result_to_edit', result_array, namespace=self._namespace_url)

    def on_get_tables_list(self, schema_name):
        """For internal use only: will be called when 'get_tables_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT table_name FROM SYS.all_tables WHERE owner='" + schema_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('tables_list_result', result_array, namespace=self._namespace_url)

    def on_get_ref_constraints_list(self, table_name):
        """For internal use only: will be called when 'get_ref_constraints_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("""SELECT constraint_name
                            FROM SYS.all_constraints
                            WHERE table_name='""" + table_name + "' " + """
                            AND constraint_type in ('P', 'U')""")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('ref_constraints_list_result', result_array, namespace=self._namespace_url)

    def on_get_columns_list(self, table_name):
        """For internal use only: will be called when 'get_ref_columns_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("""SELECT column_name
                            FROM SYS.user_tab_columns
                            WHERE table_name='""" + table_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('columns_list_result', result_array, namespace=self._namespace_url)

    def on_get_association(self, props):
        """For internal use only: will be called when 'get_association' event will be emitted
        """
        constraint_name = props['constraintName']
        ref_constraint_name = props['refConstraintName']
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT column_name FROM SYS.all_cons_columns WHERE constraint_name='" + constraint_name + "'")
        local_columns = []
        for result in cursor:
            local_columns.append(result[0])
        cursor = db_conn.cursor()
        cursor.execute("SELECT column_name FROM SYS.all_cons_columns WHERE constraint_name='" + ref_constraint_name + "'")
        ref_columns = []
        for result in cursor:
            ref_columns.append(result[0])
        if local_columns.__len__() > 0:
            result_array = [{'recid': 1,
                             'localColumn': local_columns[0],
                             'referencedColumn': ref_columns[0]}]
        else:
            result_array = [{'recid': 1,
                             'localColumn': '',
                             'referencedColumn': ref_columns[0]}]
        for i in range(1, ref_columns.__len__()):
            result_array.append({'recid': i + 1,
                                 'localColumn': '',
                                 'referencedColumn': ref_columns[i]})
        emit('association_result', result_array, namespace=self._namespace_url)

    def on_get_constraint_columns(self, constraint_name):
        """For internal use only: will be called when 'get_constraint_columns' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT column_name FROM SYS.all_cons_columns WHERE constraint_name='" + constraint_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('constraint_columns_result', result_array, namespace=self._namespace_url)

    def on_get_indexes_list(self, table_name):
        """For internal use only: will be called when 'get_indexes_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    index_name,
                    CASE
                        WHEN index_type IN ('NORMAL', 'NORMAL/REV', 'IOT - TOP', 'IOT') THEN
                            decode(uniqueness,
                                'UNIQUE', 'Unique',
                                'NONUNIQUE', 'Non-Unique',
                                uniqueness)
                        ELSE
                            decode(index_type,
                                'BITMAP', 'Bitmap',
                                'DOMAIN', 'Domain', index_type)
                    END as index_type,
                    ityp_owner,
                    ityp_name,
                    parameters,
                    decode(compression,
                        'ENABLED', 'Select',
                        'DISABLED', 'None',
                        compression) AS key_compression,
                    prefix_length,
                    decode(degree, 'DEFAULT', 'Default', '1', 'None', 'Select') AS parallel_degree,
                    degree AS degree,
                    CASE
                        WHEN INSTR(index_type, 'REV') > 0 THEN 'Reverse'
                        ELSE 'No Reverse'
                    END AS reverse,
                    tablespace_name,
                    pct_free,
                    decode(logging, 'YES', 'On', 'Off') AS logging,
                    ini_trans,
                    buffer_pool,
                    freelists,
                    freelist_groups,
                    initial_extent,
                    next_extent,
                    min_extents,
                    decode(max_extents, 2147483645, null, max_extents) AS max_extents,
                    decode(max_extents, 2147483645, 'true', 'false') as unlimited,
                    pct_increase
                FROM
                    SYS.user_indexes
                WHERE
                    table_name='%s'
                    AND index_type != 'LOB'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'indexName': result[1],
                                 'indexType': result[2],
                                 'iTypeOwner': result[3],
                                 'iTypeName': result[4],
                                 'parameters': result[5],
                                 'keyCompression': result[6],
                                 'prefixLength': result[7],
                                 'parallelDegree': result[8],
                                 'degree': result[9],
                                 'reverse': result[10],
                                 'tablespaceName': result[11],
                                 'pctFree': result[12],
                                 'logging': result[13],
                                 'initrans': result[14],
                                 'bufferMode': result[15],
                                 'freeLists': result[16],
                                 'freeListGroups': result[17],
                                 'initialExtent': result[18],
                                 'nextExtent': result[19],
                                 'minExtent': result[20],
                                 'maxExtent': result[21],
                                 'unlimited': json.loads(result[22]),
                                 'pctIncrease': result[23]
                                 })
        emit('indexes_list_result', result_array, namespace=self._namespace_url)

    def on_get_index_expression(self, index_name):
        """For internal use only: will be called when 'get_index_expression' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    column_name,
                    descend
                FROM
                    SYS.user_ind_columns
                WHERE
                    index_name='%s'
                """ % index_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'expression': result[1],
                                 'order': result[2]})
        emit('index_expression_result', result_array, namespace=self._namespace_url)

    def on_get_index_types_list(self, schema_name):
        """For internal use only: will be called when 'get_index_types_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    indextype_name
                FROM
                    SYS.all_indextypes
                WHERE
                    implementation_schema='%s'
                """ % schema_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('index_types_list_result', result_array, namespace=self._namespace_url)

    def on_get_tablespaces_list(self):
        """For internal use only: will be called when 'get_tablespace_list' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT tablespace_name FROM SYS.user_tablespaces")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('tablespaces_list_result', result_array, namespace=self._namespace_url)

    def on_get_table_storage(self, table_name):
        """For internal use only: will be called when 'get_table_storage' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    decode(degree, 'DEFAULT', 'Default', '1', 'None', 'Select') AS parallel_degree,
                    TRIM(degree) AS degree,
                    tablespace_name,
                    pct_free,
                    pct_used,
                    decode(logging, 'YES', 'On', 'Off') AS logging,
                    ini_trans,
                    buffer_pool,
                    freelists,
                    freelist_groups,
                    initial_extent,
                    next_extent,
                    min_extents,
                    decode(max_extents, 2147483645, null, max_extents) AS max_extents,
                    decode(max_extents, 2147483645, 'true', 'false') as unlimited,
                    pct_increase
                FROM
                    SYS.user_tables
                WHERE
                    table_name='%s'
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'parallelDegree': result[0],
                                 'degree': result[1],
                                 'tablespaceName': result[2],
                                 'pctFree': result[3],
                                 'pctUsed': result[4],
                                 'logging': result[5],
                                 'initrans': result[6],
                                 'bufferMode': result[7],
                                 'freeLists': result[8],
                                 'freeListGroups': result[9],
                                 'initialExtent': result[10],
                                 'nextExtent': result[11],
                                 'minExtent': result[12],
                                 'maxExtent': result[13],
                                 'unlimited': json.loads(result[14]),
                                 'pctIncrease': result[15]})
        emit('table_storge_result', result_array, namespace=self._namespace_url)

    def on_get_table_type(self, table_name):
        """For internal use only: will be called when 'get_table_type' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    CASE
                        WHEN temporary = 'Y' AND duration IS NULL THEN 'Temporary (Transaction)'
                        WHEN temporary = 'Y' AND duration IS NOT NULL THEN 'Temporary (Session)'
                        WHEN iot_type IS NOT NULL THEN 'Index Organized'
                        WHEN external_tab IS NOT NULL THEN 'External'
                        WHEN partitioned = 'YES' THEN 'Partitioned'
                        WHEN nested = 'YES' THEN 'Nested'
                        ELSE 'Normal'
                    END AS table_type
                FROM
                    (SELECT
                        a.temporary,
                        a.duration,
                        a.iot_type,
                        a.partitioned,
                        a.nested,
                        ( SELECT
                            1
                          FROM
                            SYS.all_external_tables e
                          WHERE
                            e.table_name = a.table_name
                        ) AS external_tab
                    FROM SYS.user_tables a
                    WHERE
                        a.table_name = '%s')
                """ % table_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('table_type_result', result_array, namespace=self._namespace_url)

    def on_get_table_comments(self, table_name):
        """For internal use only: will be called when 'get_table_comments' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        cursor.execute("SELECT comments FROM SYS.user_tab_comments WHERE table_name='" + table_name + "'")
        result_array = []
        for result in cursor:
            result_array.append(result[0])
        emit('table_comments_result', result_array, namespace=self._namespace_url)


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


class DatabaseMaterializedViewServer(Namespace):
    """Class to interact with the database mviews available under schema
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
        Namespace.__init__(self, '/oracle_db_mview')
        self._namespace_url = '/oracle_db_mview'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_columns(self, mview_name):
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
                """ % mview_name
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

    def on_get_column_headers(self, mview_name):
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
                """ % mview_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'field': result[0],
                                 'caption': result[0],
                                 'size': '100px'})
        emit('column_headers_result', result_array, namespace=self._namespace_url)

    def on_get_data(self, mview_name):
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
                """ % mview_name
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
                """ % (header_string, mview_name)
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

    def on_get_grants(self, mview_name):
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
                """ % mview_name
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

    def on_get_dependencies(self, mview_name):
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
                """ % mview_name
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

    def on_get_dependencies_details(self, mview_name):
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
                """ % mview_name
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

    def on_get_indexes(self, mview_name):
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
                """ % mview_name
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
                    """ % mview_name
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
        mview_name = props['mviewName']
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
                """ % (mview_name, index_name)
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

    def on_get_sql(self, mview_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('MATERIALIZED_VIEW', '%s')) FROM dual
                """ % mview_name
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
                """ % mview_name
        cursor.execute(query)
        for result in cursor:
            sql += '  ' + result[0] + '\n'
        # ########## Get comments on table if available ##########
        cursor = db_conn.cursor()
        query = """
                SELECT
                    'COMMENT ON MATERIALIZED VIEW ' ||
                    '"' || sys_context( 'userenv', 'current_schema' ) ||
                                    '"."' || mview_name ||
                                    '" IS ''' || comments || ''';'
                FROM
                    SYS.user_mview_comments
                WHERE
                    mview_name='%s'
                    AND comments IS NOT NULL
                """ % mview_name
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
                """ % mview_name
        cursor.execute(query)
        for result in cursor:
            sql += result[0] + '\n'
        emit('sql_result', sql, namespace=self._namespace_url)


class DatabasePLSQLServer(Namespace):
    """Class to interact with the database procedure, function or package available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabasePLSQLServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_plsql')
        self._namespace_url = '/oracle_db_plsql'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_sql(self, object_name, object_type):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        object_type = object_type.replace(' ', '_')
        if object_type == 'PACKAGE' or object_type == 'TYPE':
            query = """
                    SELECT
                       TEXT
                    FROM
                        SYS.user_source
                    WHERE
                        name='%s'
                        AND type in ('PACKAGE', 'TYPE')
                    ORDER BY line
                    """ % object_name
        else:
            query = """
                    SELECT to_char(dbms_metadata.get_ddl('%s', '%s')) FROM dual
                    """ % (object_type, object_name)
        cursor.execute(query)
        for result in cursor:
            sql = sql + result[0]
        if object_type == 'PACKAGE' or object_type == 'TYPE':
            sql = 'CREATE OR REPLACE ' + sql
        emit('sql_result', sql, namespace=self._namespace_url)

    def on_get_errors(self, object_name):
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
                """ % object_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'attribute': result[1],
                                 'linePosition': result[2],
                                 'text': result[3]
                                 })
        emit('errors_result', result_array, namespace=self._namespace_url)

    def on_get_dependencies(self, object_name, object_type):
        """For internal use only: will be called when 'get_dependencies' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT DISTINCT
                    ROWNUM,
                    b.object_name   AS name,
                    b.owner,
                    b.object_type   type,
                    b.object_id,
                    b.status,
                    replace(b.object_type, ' ', '_') type_link
                FROM
                    sys.all_objects b,
                    (
                        SELECT
                            object_id,
                            referenced_object_id,
                            level l,
                            ROWNUM ord
                        FROM
                            public_dependency
                        START WITH
                            object_id = (SELECT object_id FROM SYS.user_objects WHERE object_name='%s' and object_type='%s')
                        CONNECT BY NOCYCLE
                            PRIOR referenced_object_id = object_id
                    ) c
                WHERE
                    b.object_id = c.referenced_object_id
                    AND b.owner NOT IN (
                        'SYS',
                        'SYSTEM'
                    )
                    AND b.object_name <> 'DUAL'
                """ % (object_name, object_type)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'owner': result[2],
                                 'type': result[3],
                                 'objectId': result[4],
                                 'status': result[5],
                                 'typeLink': result[6]
                                 })
        emit('dependencies_result', result_array, namespace=self._namespace_url)

    def on_get_grants(self, object_name):
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
                """ % object_name
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

    def on_get_references(self, object_name, object_type):
        """For internal use only: will be called when 'get_references' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT DISTINCT
                    ROWNUM,
                    object_name   AS name,
                    owner,
                    object_type   type,
                    hier.object_id,
                    status,
                    decode(replace(object_type, ' ', '_'), 'PACKAGE_BODY', 'PACKAGE', replace(object_type, ' ', '_')) type_link
                FROM
                    sys.all_objects o,
                    (
                        SELECT
                            object_id,
                            level l,
                            ROWNUM ord
                        FROM
                            public_dependency
                        CONNECT BY NOCYCLE
                            PRIOR object_id = referenced_object_id
                        START WITH referenced_object_id = (SELECT object_id FROM SYS.user_objects WHERE object_name='%s' and object_type='%s')
                    ) hier
                WHERE
                    hier.object_id = o.object_id
                """ % (object_name, object_type)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'owner': result[2],
                                 'type': result[3],
                                 'objectId': result[4],
                                 'status': result[5],
                                 'typeLink': result[6]
                                 })
        emit('references_result', result_array, namespace=self._namespace_url)


class DatabaseSequenceServer(Namespace):
    """Class to interact with the database sequence available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseSequenceServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_sequence')
        self._namespace_url = '/oracle_db_sequence'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_details(self, sequence_name):
        """For internal use only: will be called when 'get_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM
                (SELECT 'CREATED', to_char(CREATED) FROM SYS.user_objects WHERE object_name='{0}'
                UNION
                SELECT 'LAST_DDL_TIME', to_char(LAST_DDL_TIME) FROM SYS.user_objects WHERE object_name='{0}'
                UNION
                SELECT 'SEQUENCE_NAME', SEQUENCE_NAME FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'MIN_VALUE', to_char(MIN_VALUE) FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'MAX_VALUE', to_char(MAX_VALUE) FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'INCREMENT_BY', to_char(INCREMENT_BY) FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'CYCLE_FLAG', CYCLE_FLAG FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'ORDER_FLAG', ORDER_FLAG FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'CACHE_SIZE', to_char(CACHE_SIZE) FROM SYS.user_sequences WHERE sequence_name='{0}'
                UNION
                SELECT 'LAST_NUMBER', to_char(LAST_NUMBER) FROM SYS.user_sequences WHERE sequence_name='{0}') a
                """.format(sequence_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('details_result', result_array, namespace=self._namespace_url)

    def on_get_dependencies(self, sequence_name):
        """For internal use only: will be called when 'get_dependencies' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    b.object_id,
                    b.object_type,
                    b.object_name,
                    b.status,
                    replace(b.object_type, ' ', '_') type_link
                FROM
                    sys.all_objects   a,
                    sys.all_objects   b,
                    (
                        SELECT
                            object_id,
                            referenced_object_id
                        FROM
                            public_dependency
                        START WITH
                            object_id = (SELECT object_id FROM SYS.user_objects WHERE object_name='%s' AND object_type='SEQUENCE')
                        CONNECT BY
                            PRIOR referenced_object_id = object_id
                    ) c
                WHERE
                    a.object_id = c.object_id
                    AND b.object_id = c.referenced_object_id
                    AND a.owner NOT IN (
                        'SYS',
                        'SYSTEM'
                    )
                    AND b.owner NOT IN (
                        'SYS',
                        'SYSTEM'
                    )
                    AND a.object_name <> 'DUAL'
                    AND b.object_name <> 'DUAL'
                """ % sequence_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'objectId': result[1],
                                 'objectType': result[2],
                                 'objectName': result[3],
                                 'status': result[4],
                                 'typeLink': result[5]})
        emit('dependencies_result', result_array, namespace=self._namespace_url)

    def on_get_dependencies_details(self, sequence_name):
        """For internal use only: will be called when 'get_dependencies' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    object_id,
                    object_type,
                    object_name,
                    status,
                    decode(replace(object_type, ' ', '_'), 'PACKAGE_BODY', 'PACKAGE', replace(object_type, ' ', '_')) type_link
                FROM
                    sys.all_objects
                WHERE
                    object_id IN (
                        SELECT
                            object_id
                        FROM
                            public_dependency
                        CONNECT BY
                            PRIOR object_id = referenced_object_id
                        START WITH referenced_object_id = (SELECT object_id FROM SYS.user_objects WHERE object_name='%s' AND object_type='SEQUENCE')
                    )
                """ % sequence_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'objectId': result[1],
                                 'objectType': result[2],
                                 'objectName': result[3],
                                 'status': result[4],
                                 'typeLink': result[5]})
        emit('dependencies_details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, sequence_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('SEQUENCE', '%s')) FROM dual
                """ % sequence_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        emit('sql_result', sql, namespace=self._namespace_url)


class DatabaseSynonymServer(Namespace):
    """Class to interact with the database synonym available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseSynonymServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_synonym')
        self._namespace_url = '/oracle_db_synonym'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_details(self, synonym_name):
        """For internal use only: will be called when 'get_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM
                (SELECT 'CREATED', to_char(CREATED) FROM SYS.user_objects WHERE object_name='{0}' AND object_type='SYNONYM'
                UNION
                SELECT 'LAST_DDL_TIME', to_char(LAST_DDL_TIME) FROM SYS.user_objects WHERE object_name='{0}' AND object_type='SYNONYM'
                UNION
                SELECT 'SYNONYM_NAME', SYNONYM_NAME FROM SYS.user_synonyms WHERE synonym_name='{0}'
                UNION
                SELECT 'OBJECT_OWNER', table_owner AS OBJECT_OWNER FROM SYS.user_synonyms WHERE synonym_name='{0}'
                UNION
                SELECT 'OBJECT_NAME', table_name AS OBJECT_NAME FROM SYS.user_synonyms WHERE synonym_name='{0}'
                UNION
                SELECT 'OBJECT_TYPE', OBJECT_TYPE FROM SYS.user_objects WHERE object_name=(SELECT table_name FROM SYS.user_synonyms WHERE synonym_name='{0}')
                UNION
                SELECT 'DB_LINK', DB_LINK FROM SYS.user_synonyms WHERE synonym_name='{0}') a
                """.format(synonym_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, synonym_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('SYNONYM', '%s')) FROM dual
                """ % synonym_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        emit('sql_result', sql, namespace=self._namespace_url)


class DatabaseLinkServer(Namespace):
    """Class to interact with the database link available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseLinkServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_link')
        self._namespace_url = '/oracle_db_link'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_details(self, link_name):
        """For internal use only: will be called when 'get_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM
                (SELECT 'CREATED', to_char(CREATED) FROM SYS.all_db_links WHERE db_link='{0}'
                UNION
                SELECT 'DB_LINK', DB_LINK FROM SYS.all_db_links WHERE db_link='{0}'
                UNION
                SELECT 'USERNAME', USERNAME FROM SYS.all_db_links WHERE db_link='{0}'
                UNION
                SELECT 'HOST', HOST FROM SYS.all_db_links WHERE db_link='{0}') a
                """.format(link_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, link_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('DB_LINK', '%s')) FROM dual
                """ % link_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        emit('sql_result', sql, namespace=self._namespace_url)


class DatabaseDirectoryServer(Namespace):
    """Class to interact with the database directory available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseDirectoryServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_directory')
        self._namespace_url = '/oracle_db_directory'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_details(self, directory_name):
        """For internal use only: will be called when 'get_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM
                (SELECT 'DIRECTORY_NAME', DIRECTORY_NAME FROM SYS.all_directories WHERE directory_name='{0}'
                UNION
                SELECT 'DIRECTORY_PATH', DIRECTORY_PATH FROM SYS.all_directories WHERE directory_name='{0}'
                UNION
                SELECT 'Privilege list', priv_list
                    FROM (SELECT LISTAGG(privilege, ', ')
                                    WITHIN GROUP (ORDER BY privilege) priv_list
                            FROM all_tab_privs WHERE table_name='{0}')
                ) a
                """.format(directory_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('details_result', result_array, namespace=self._namespace_url)


class DatabaseQueueServer(Namespace):
    """Class to interact with the database queue available under schema
        provided as parameter to the class
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseQueueServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_queue')
        self._namespace_url = '/oracle_db_queue'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_get_details(self, queue_name):
        """For internal use only: will be called when 'get_details' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT ROWNUM, a.* FROM
                (SELECT 'NAME', NAME FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'QUEUE_TABLE', QUEUE_TABLE FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'QID', to_char(QID) FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'QUEUE_TYPE', QUEUE_TYPE FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'MAX_RETRIES', to_char(MAX_RETRIES) FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'RETRY_DELAY', to_char(RETRY_DELAY) FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'ENQUEUE_ENABLED', ENQUEUE_ENABLED FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'DEQUEUE_ENABLED', DEQUEUE_ENABLED FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'RETENTION', to_char(RETENTION) FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'USER_COMMENT', USER_COMMENT FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'NETWORK_NAME', NETWORK_NAME FROM SYS.user_queues WHERE name='{0}'
                UNION
                SELECT 'CREATED', to_char(CREATED) FROM SYS.user_objects WHERE object_name='{0}' AND object_type='QUEUE'
                UNION
                SELECT 'LAST_DDL_TIME', to_char(LAST_DDL_TIME) FROM SYS.user_objects WHERE object_name='{0}' AND object_type='QUEUE') a
                """.format(queue_name)
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'name': result[1],
                                 'value': result[2]})
        emit('details_result', result_array, namespace=self._namespace_url)

    def on_get_sql(self, queue_name):
        """For internal use only: will be called when 'get_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        sql = ""
        # ########### Get DDL of table ###############
        cursor = db_conn.cursor()
        query = """
                SELECT to_char(dbms_metadata.get_ddl('AQ_QUEUE', '%s')) FROM dual
                """ % queue_name
        cursor.execute(query)
        for result in cursor:
            sql = result[0]
        emit('sql_result', sql, namespace=self._namespace_url)

    def on_get_schedules(self, queue_name):
        """For internal use only: will be called when 'get_schedules' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    QNAME,
                    DESTINATION,
                    START_DATE,
                    START_TIME,
                    PROPAGATION_WINDOW,
                    NEXT_TIME,
                    LATENCY,
                    SCHEDULE_DISABLED,
                    PROCESS_NAME,
                    SESSION_ID,
                    INSTANCE,
                    LAST_RUN_DATE,
                    LAST_RUN_TIME,
                    CURRENT_START_DATE,
                    CURRENT_START_TIME,
                    NEXT_RUN_DATE,
                    NEXT_RUN_TIME,
                    TOTAL_TIME,
                    TOTAL_NUMBER,
                    TOTAL_BYTES,
                    MAX_NUMBER,
                    MAX_BYTES,
                    AVG_NUMBER,
                    AVG_SIZE,
                    AVG_TIME,
                    FAILURES,
                    LAST_ERROR_DATE,
                    LAST_ERROR_TIME,
                    LAST_ERROR_MSG,
                    MESSAGE_DELIVERY_MODE,
                    ELAPSED_DEQUEUE_TIME,
                    ELAPSED_PICKLE_TIME,
                    JOB_NAME
                FROM
                    SYS.user_queue_schedules
                WHERE
                    qname='%s'
                """ % queue_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'QNAME': result[1],
                                 'DESTINATION': result[2],
                                 'START_DATE': result[3],
                                 'START_TIME': result[4],
                                 'PROPAGATION_WINDOW': result[5],
                                 'NEXT_TIME': result[6],
                                 'LATENCY': result[7],
                                 'SCHEDULE_DISABLED': result[8],
                                 'PROCESS_NAME': result[9],
                                 'SESSION_ID': result[10],
                                 'INSTANCE': result[11],
                                 'LAST_RUN_DATE': result[12],
                                 'LAST_RUN_TIME': result[13],
                                 'CURRENT_START_DATE': result[14],
                                 'CURRENT_START_TIME': result[15],
                                 'NEXT_RUN_DATE': result[16],
                                 'NEXT_RUN_TIME': result[17],
                                 'TOTAL_TIME': result[18],
                                 'TOTAL_NUMBER': result[19],
                                 'TOTAL_BYTES': result[20],
                                 'MAX_NUMBER': result[21],
                                 'MAX_BYTES': result[22],
                                 'AVG_NUMBER': result[23],
                                 'AVG_SIZE': result[24],
                                 'AVG_TIME': result[25],
                                 'FAILURES': result[26],
                                 'LAST_ERROR_DATE': result[27],
                                 'LAST_ERROR_TIME': result[28],
                                 'LAST_ERROR_MSG': result[29],
                                 'MESSAGE_DELIVERY_MODE': result[30],
                                 'ELAPSED_DEQUEUE_TIME': result[31],
                                 'ELAPSED_PICKLE_TIME': result[32],
                                 'JOB_NAME': result[33]})
        emit('schedules_result', result_array, namespace=self._namespace_url)

    def on_get_subscribers(self, queue_name):
        """For internal use only: will be called when 'get_subscribers' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        query = """
                SELECT
                    ROWNUM,
                    QUEUE_NAME,
                    QUEUE_TABLE,
                    CONSUMER_NAME,
                    ADDRESS,
                    PROTOCOL,
                    TRANSFORMATION,
                    RULE,
                    DELIVERY_MODE,
                    NONDURABLE,
                    QUEUE_TO_QUEUE
                FROM
                    SYS.user_queue_subscribers
                WHERE
                    queue_name='%s'
                """ % queue_name
        cursor.execute(query)
        result_array = []
        for result in cursor:
            result_array.append({'recid': result[0],
                                 'QUEUE_NAME': result[1],
                                 'QUEUE_TABLE': result[2],
                                 'CONSUMER_NAME': result[3],
                                 'ADDRESS': result[4],
                                 'PROTOCOL': result[5],
                                 'TRANSFORMATION': result[6],
                                 'RULE': result[7],
                                 'DELIVERY_MODE': result[8],
                                 'NONDURABLE': result[9],
                                 'QUEUE_TO_QUEUE': result[10]})
        emit('subscribers_result', result_array, namespace=self._namespace_url)


class DatabaseSQLServer(Namespace):
    """Class to interact with the database and execute the
        SQL provided using various methods
    """

    _socket_io = None
    _schema_name = None
    _schema = None
    _db_connection = None
    _namespace_url = None

    def __init__(self, socket_io, schema):
        """Default constructor for DatabaseSQLServer class


            Args:
                socket_io (SocketIO): An instance of the SocketIO class
                schema (DatabaseSchema): An instance of DatabaseSchema Class
        """
        Namespace.__init__(self, '/oracle_db_sql')
        self._namespace_url = '/oracle_db_sql'
        self._socket_io = socket_io
        self._schema = schema
        self._db_connection = self._schema.get_connection()
        self._schema_name = self._schema.get_schema_name()
        socket_io.on_namespace(self)

    def on_execute_sql(self, sql):
        """For internal use only: will be called when 'execute_sql' event will be emitted
        """
        db_conn = self._db_connection.get_connection()
        cursor = db_conn.cursor()
        sql = sql.rstrip(';')
        try:
            cursor.execute(sql)
            emit('execute_sql_success', 'ok', namespace=self._namespace_url)
        except Exception as err:
            emit('execute_sql_error', str(err), namespace=self._namespace_url)
            print('Error while executing SQL: ' + sql)
            print(err)
