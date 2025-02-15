import express from "express";
import dotenv from "dotenv";
import trainRoutes from "./src/routes/trainRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use("/", trainRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
