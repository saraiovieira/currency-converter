const PORT = 8000;
import express from "express";
import cors from "cors";
import axios from "axios";
import { config } from "dotenv";
config();

const app = express();
const API_KEY = process.env.API_KEY;

let cachedRates = null;
let cacheTimestamp = null;
const CACHE_EXPIRATION_TIME = 3600000;

app.use(cors());
app.use(express.json());

async function api(endpoint) {
  const url = `https://api.exchangeratesapi.io/v1/${endpoint}?access_key=${API_KEY}`;

  return await axios({
    method: "GET",
    timeout: 2000,
    url,
  });
}

app.get("/rates", async (req, res) => {
  const currentTime = Date.now();

  if (cachedRates && currentTime - cacheTimestamp < CACHE_EXPIRATION_TIME) {
    return res.json(cachedRates);
  }

  try {
    const response = await api("latest");
    cachedRates = response.data;
    cacheTimestamp = currentTime;
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
      return res.status(429).json({
        success: false,
        errorMessage: "Rate limit exceeded. Please try again later.",
      });
    }
    
    console.error("Error fetching rates:", error.message);
    res.status(500).json({
      success: false,
      errorMessage: "Error fetching rates",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
