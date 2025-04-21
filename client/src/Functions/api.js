import axios from "axios";

export async function get(url, data) {
  const config = {
    baseURL: "https://currency-converter-ij3k.onrender.com",
    ...(data && { params: data }),
  };

  return await axios.get(url, config);
}
