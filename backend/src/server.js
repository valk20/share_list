import healthRouter from "./routers/healthRouter.js";

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", healthRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
