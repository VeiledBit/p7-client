const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3002" : import.meta.env.VITE_SERVER_URL;

export default baseUrl;
