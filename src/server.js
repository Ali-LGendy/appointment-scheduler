import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT;

if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} 🚀`);
});