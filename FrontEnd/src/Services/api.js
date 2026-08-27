import axios from "axios";

const api = axios.create({
    baseURL: "https://app-booknest-exemdtd9dzaeb2hk.centralindia-01.azurewebsites.net/api"
});

export default api;