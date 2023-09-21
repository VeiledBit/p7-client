const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : import.meta.env.VITE_SERVER_URL;

export default baseUrl;
