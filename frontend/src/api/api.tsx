import axios from "axios";

export const AppURL = "http://127.0.0.1:8888";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = "http://127.0.0.1:8888";
export default axiosInstance;
