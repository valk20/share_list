import healthRouter from "./routes/healthRouter.js";
import usersRouter from "./routes/usersRouter.js";
import listsRouter from "./routes/listsRouter.js";

import express from "express";
import cors from "cors";

import { configServer } from "./config/config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api/v1", usersRouter);
app.use("/api/v1", listsRouter);

const port = configServer.port || 3000;

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
