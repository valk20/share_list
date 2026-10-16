import express from "express";
import jwt from "jsonwebtoken";

import { pool } from "../config/db.js";
import { configServer } from "../config/config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/lists", async (req, res) => {
    try {
        const category = req.query.category || null;
        const search = req.query.search || null;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                l.id, 
                l.title, 
                l.category, 
                l.is_public, 
                l.created_at, 
                l.forked_from_id,
                u.id AS owner_id, 
                u.username AS owner_username,
                COUNT(DISTINCT lk.id) AS likes_count,
                COUNT(DISTINCT c.id) AS comments_count,
                COUNT(DISTINCT li.id) AS items_count
            FROM lists l
            JOIN users u ON l.owner_id = u.id
            LEFT JOIN list_likes lk ON lk.list_id = l.id
            LEFT JOIN list_comments c ON c.list_id = l.id
            LEFT JOIN list_items li ON li.list_id = l.id
            WHERE l.is_public = TRUE
              AND (? IS NULL OR l.category = ?)
              AND (? IS NULL OR l.title LIKE CONCAT('%', ?, '%'))
            GROUP BY l.id, u.id
            ORDER BY l.created_at DESC
            LIMIT ? OFFSET ?;
        `;

        const [rows] = await pool.query(query, [category, category, search, search, limit, offset]);
        res.status(200).json({
            lists: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get(["/lists/my-lists", "/lists/mylists"], authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            `SELECT 
                l.id, 
                l.title, 
                l.category, 
                l.is_public, 
                l.forked_from_id, 
                l.created_at,
                COUNT(li.id) AS items_count
            FROM lists l
            LEFT JOIN list_items li ON li.list_id = l.id
            WHERE l.owner_id = ?
            GROUP BY l.id
            ORDER BY l.created_at DESC;`,
            [userId]
        );
        res.status(200).json({
            lists: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/lists/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // // Check if caller sent a Bearer token (optional auth)
        let currentUserId = "null";
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, configServer.jwtSecret);
                currentUserId = decoded.id;
            } catch {
                // Invalid or expired token: treat as guest
            }
        }

        const queryList = `
            SELECT l.*, u.username AS owner_username 
            FROM lists l 
            JOIN users u ON l.owner_id = u.id 
            WHERE l.id = ? AND (l.is_public = TRUE OR l.owner_id = ?)
        `;
        const queryItems = `
            SELECT id, title, is_completed, created_at 
            FROM list_items 
            WHERE list_id = ? 
            ORDER BY id ASC;
        `;

        const [listRows] = await pool.query(queryList, [id, currentUserId]);

        if (listRows.length === 0) {
            return res.status(404).json({ message: "List not found or private" });
        }

        const [items] = await pool.query(queryItems, [id]);

        res.status(200).json({
            ...listRows[0],
            items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/lists", authMiddleware, async (req, res) => {
    try {
        const { title, category, is_public, items } = req.body;
        const isPublic = is_public === "true" || is_public === true || is_public === "1" || is_public === 1

        if (!title || title === "") {
            return res.status(400).json({ message: "Title is required" })
        }

        const [result] = await pool.query(
            "INSERT INTO lists (title, category, is_public, owner_id) VALUES (?, ?, ?, ?)",
            [title, category, isPublic, req.user.id]
        );

        const listId = result.insertId;

        if (items && items.length > 0) {
            for (const item of items) {
                await pool.query(
                    "INSERT INTO list_items (list_id, title) VALUES (?, ?)",
                    [listId, item]
                );
            }
        }

        res.status(201).json({
            message: "List created successfully",
            list: {
                id: listId,
                title,
                category,
                isPublic,
                owner_id: req.user.id,
                items
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

export default router;