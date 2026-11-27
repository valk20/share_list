import jwt from "jsonwebtoken";
import { configServer } from "../config/config.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, configServer.jwtSecret);
        req.user = decoded; // Contains { id, username, email, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
