import express from "express";
import passport from "passport";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import morgan from "morgan";
import routes from "./routes/index.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ credentials: true, origin: "https://persista-webapp.vercel.app" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		name: "test_session",
		secret: process.env.COOKIE_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: true,
			sameSite: "none",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
