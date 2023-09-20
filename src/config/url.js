const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : process.env.SERVER_URL;

export default baseUrl;
