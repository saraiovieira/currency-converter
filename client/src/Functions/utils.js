import { get } from "./api";

export async function getRates() {
  let response = await get("/rates", null);
  return response.data.success ? response.data.rates : {};
}
