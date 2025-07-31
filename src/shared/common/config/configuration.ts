export default () => ({
  database: {
    type: 'mariadb',
    host: process.env.MARIADB_HOST || 'localhost',
    port : process.env.MARIADB_PORT,
    username: process.env.MARIADB_USERNAME || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'attendance_db',
    synchronize: process.env.MARIADB_SYNCHRONIZE === 'true',
  },
  mongodb: {
    type: 'mongodb',
    host: process.env.MONGODB_HOST || 'localhost',
    port: parseInt(process.env.MONGODB_PORT || '27017', 10),
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'dev_mongo_db',
    useNewUrlParser: true,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'default_access_secret',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'default_refresh_secret',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
    },
    // Compatibilidad con módulos que usen un solo secreto
    generic: {
      secret: process.env.JWT_SECRET || 'fallback_secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },

  },
});
