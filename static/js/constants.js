/**
 * Enum: MouseState
 * Description: Provides different states of mouse
 */
var MouseState = {
  UP: 0,
  DOWN: 1,
  DRAG: 2,
  MOVE: 3,
  LEAVE: 4,
  properties: {
    0: {
      name: 'UP'
    },
    1: {
      name: 'DOWN'
    },
    2: {
      name: 'DRAG'
    },
    3: {
      name: 'MOVE'
    },
    4: {
      name: 'LEAVE'
    }
  }
};
if (Object.freeze) {
  Object.freeze(MouseState);
}

/**
 * Enum: ShapeType
 * Description: Various shapes available
 */
var ShapeType = {
  NONE: 9999,
  LINE: 0,
  RECTANGLE: 1,
  CIRCLE: 2,
  ELLIPSE: 3,
  POLYLINE: 4,
  POLYGON: 5,
  PATH: 6,
  BEZIRE_CURVE: 7,
  POINTER: 8,
  SELECTION: 9,
  CUSTOM: 10,
  NODE: 11,
  PORT: 12,
  properties: {
    9999: {
      name: 'NONE'
    },
    0: {
      name: 'LINE'
    },
    1: {
      name: 'RECTANGLE'
    },
    2: {
      name: 'CIRCLE'
    },
    3: {
      name: 'ELLIPSE'
    },
    4: {
      name: 'POLYLINE'
    },
    5: {
      name: 'POLYGONE'
    },
    6: {
      name: 'PATH'
    },
    7: {
      name: 'BEZIRE_CURVE'
    },
    8: {
      name: 'POINTER'
    },
    9: {
      name: 'SELECTION'
    },
    10: {
      name: 'CUSTOM'
    },
    11: {
      name: 'NODE'
    },
    12: {
      name: 'PORT'
    }
  }
};

/**
 * Enum: PortType
 * Description: Define port type as source or target
 */
var PortType = {
  SOURCE: 0,
  TARGET: 1,
  properties: {
    0: {
      name: 'SOURCE'
    },
    1: {
      name: 'TARGET'
    }
  }
};

/**
 * Enum: DatabaseNavNodeType
 * Description: Defines various node types available for database
 */
var DatabaseNavNodeType = {
    DATABASE_FOLDER: 'DB-FOLDER',
    CONNECTION_FOLDER: 'DB-CONNECTION-FOLDER',
    TABLES_FOLDER: 'DB-TABLES-FOLDER',
    VIEWS_FOLDER: 'DB-VIEWS-FOLDER',
    INDEXES_FOLDER: 'DB-INDEXES-FOLDER',
    MVIEWS_FOLDER: 'DB-MVIEWS-FOLDER',
    PROCEDURES_FOLDER: 'DB-PROCEDURES-FOLDER',
    FUNCTIONS_FOLDER: 'DB-FUNCTION-FOLDER',
    PACKAGES_FOLDER: 'DB-PACKAGES-FOLDER',
    SEQUENCES_FOLDER: 'DB-SEQUENCES-FOLDER',
    SYNONYMS_FOLDER: 'DB-SYNONYMS-FOLDER',
    PUBLIC_SYNONYMS_FOLDER: 'DB-PUBLIC-SYNONYMS-FOLDER',
    TRIGGERS_FOLDER: 'DB-TRIGGERS-FOLDER',
    TYPES_FOLDER: 'DB-TYPES-FOLDER',
    QUEUES_FOLDER: 'DB-QUEUES-FOLDER',
    DBLINKS_FOLDER: 'DB-DBLINKS-FOLDER',
    PUBLIC_DBLINKS_FOLDER: 'DB-PUBLIC-DBLINKS-FOLDER',
    DIRECTORIES_FOLDER: 'DB-DIRECTORIES-FOLDER',
    TABLE: 'DB-TABLE',
    VIEW: 'DB-VIEW',
    INDEX: 'DB-INDEX',
    MVIEW: 'DB-MVIEW',
    PROCEDURE: 'DB-PROCEDURE',
    FUNCTION: 'DB-FUNCTION',
    PACKAGE: 'DB-PACKAGE',
    PACKAGE_BODY: 'DB-PACKAGE-BODY',
    SEQUENCE: 'DB-SEQUENCE',
    SYNONYM: 'DB-SYNONYM',
    PUBLIC_SYNONYM: 'DB-PUBLIC-SYNONYM',
    TRIGGER: 'DB-TRIGGER',
    TYPE: 'DB-TYPE',
    TYPE_BODY: 'DB-TYPE-BODY',
    QUEUE: 'DB-QUEUE',
    DBLINK: 'DB-DBLINK',
    PUBLIC_DBLINK: 'DB-PUBLIC-DBLINK',
    DIRECTORY: 'DB-DIRECTORY'
  };