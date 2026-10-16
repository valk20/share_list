import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const configDB = {
    dbHost: process.env.DB_HOST || "127.0.0.1",
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT || 3306,
};

export const configServer = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "default_fallback_secret"
}