import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8080" : "");

axios.defaults.baseURL = apiBaseUrl.replace(/\/+$/, "");

export default axios;
