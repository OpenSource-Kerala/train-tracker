import express from "express";
import { getTrainData, homePage } from "../controllers/trainController.js";

const router = express.Router();

router.get("/", homePage);
router.get("/:trainNumber", getTrainData);

export default router;
