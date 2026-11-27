import express from "express";
import jwt from "jsonwebtoken";

import { pool } from "../config/db.js";
import { configServer } from "../config/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, configServer.jwtSecret, { expiresIn: "7d" });
}

router.post("/auth/register", async (req, res) => {
    try {
        const { username, email, passwordHash } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!passwordHash) {
            return res.status(400).json({ message: "Password is required" });
        }

        const [result] = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, passwordHash]
        );

        const newUser = { id: result.insertId, username, email };
        const token = generateToken(newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token
        });
    } catch (error) {
        if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        console.error(error);
        res.status(500).json({ message: "Error registering user", sqlMessage: error.sqlMessage });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        const { email, username, passwordHash } = req.body;

        if (!email && !username) {
            return res.status(400).json({ message: "Email or username is required" });
        }
        if (!passwordHash) {
            return res.status(400).json({ message: "Password is required" });
        }

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email || "", username || ""]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Username or email not found" });
        }

        const user = rows[0];

        if (user.password_hash !== passwordHash) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/users/me", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            "SELECT id, username, email, created_at FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = rows[0];
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})


export default router;