import axios from "axios";

export async function get(url, data) {
  let config = {
    baseURL: "http://localhost:8000",
    params: data,
  };
  return await axios.get(url, config);
}
