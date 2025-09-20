import express from "express";
import cors from "cors";
import helmet from "helmet";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import "dotenv/config";

const app = express();

app.use(helmet());

if(process.env.NODE_ENV !== "production") {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
},));

app.use(express.json());
app.use(express.urlencoded({extended: true,},));

app.use(cookieParser());

app.use(csurf({cookie: { httpOnly: true, sameSite: 'lax', },},));
app.get("api/csrf-token", (req, res) => {
    res.json({csrfToken: req.csrfToken(),},);
});
app.use((err, req, res, next) => {
    if(err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({success: false, message: 'Invalid CSRF token',},);
    }
    next(err)
});

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
},));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export default app;