import mysql from "mysql2/promise";
import { configDB } from "./config.js";

export const pool = mysql.createPool({
    host: configDB.dbHost,
    port: Number(configDB.dbPort) || 3306,
    user: configDB.dbUser,
    password: configDB.dbPassword,
    database: configDB.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to MySQL");
        connection.release();
        return true;
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        return false;
    }
}