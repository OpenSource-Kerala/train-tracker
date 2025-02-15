import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

export const fetchTrainData = async (trainNumber) => {
    try {
        const { data } = await axios.get(`${BASE_URL}${trainNumber}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const $ = cheerio.load(data);
        let trainSchedule = [];

        $("div").each((_, el) => {
            const text = $(el).text().trim();
            
            let previousDistance = 0;  // Track the previous station's distance

            if (text.includes("Kms   | PF #") && !trainSchedule.includes(text) && !text.includes("width") && !trainSchedule.some((station) => text.includes(station.distance))) {
                const match = text.match(/(.+?)\s(\d+Kms)\s+\|\s+PF #(\d+)\s+(Delay\s*(\d+m))?\s*(\d{2}:\d{2})?\s*(\d{2}:\d{2})?/i);
            
                if (match) {
                    const stationName = match[1]?.trim();
                    const distance = match[2];
                    const platform = match[3];
            
                    const delay = match[5] ? match[5].trim() : "0m"; // If delay exists, use it; otherwise, use "0m"
                    const arrivalTime = match[6] || "N/A";
                    const departureTime = match[7] || "N/A";
            
                    const currentDistance = parseInt(distance.replace('Kms', ''), 10);
                    const distanceDifference = previousDistance === 0 ? `${currentDistance}Kms` : `${currentDistance - previousDistance}Kms`;
            
                    const stationData = {
                        station: stationName,
                        distance,
                        platform,
                        delay,
                        arrivalTime,
                        departureTime,
                    };
            
                    if (text.includes("Arriving") || text.includes("Next Stop")) {
                        trainSchedule.unshift(stationData);
                    } else {
                        trainSchedule.push(stationData);
                    }
                }
            }
        });

        return trainSchedule;
    } catch (error) {
        console.error("Error fetching train data:", error.message);
        return { error: "Failed to fetch train data" };
    }
};
