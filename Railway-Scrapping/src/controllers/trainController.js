import { fetchTrainData } from "../utils/fetchTrainData.js";

export const getTrainData = async (req, res) => {
    const { trainNumber } = req.params;
    const trainData = await fetchTrainData(trainNumber);
    res.json(trainData);
};

export const homePage = (req, res) => {
    res.json({
        message: "🚆 Train Tracker API - Developed by OpenSource-Kerala. Use /{trainNumber} to get train details."
    });
};
