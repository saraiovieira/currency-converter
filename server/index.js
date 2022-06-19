const PORT = 8000;
import express from "express";
import cors from "cors";
import axios from "axios";
import { config } from "dotenv";
config();

const app = express();
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

async function api(url) {
  const requestOptions = {
    baseURL: "https://api.apilayer.com/exchangerates_data/",
    url,
    method: "GET",
    timeout: 2000,
    headers: {
      apikey: API_KEY,
    },
  };

  return await axios(requestOptions);
}

app.get("/rates", (req, res) => {

  let url = `/latest`;
  api(url)
    .then((response) => {
      return res.json(response.data);
    })
    .catch((error) => {
      return { success: false, errorMessage: "error" };
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
