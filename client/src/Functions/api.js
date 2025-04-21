import axios from "axios";

export async function get(url, data) {
  const config = {
    baseURL: "http://localhost:8000",
    ...(data && { params: data }),
  };

  return await axios.get(url, config);
}
