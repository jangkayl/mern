import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router } from "./routes/user.js";
import cookieParser from "cookie-parser";
import workoutRoute from "./routes/workout.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;

const app = express();

const corsOptions = {
	origin: "https://kylemern.vercel.app", // The front-end URL
	optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(
	cors({
		credentials: true,
		origin: "https://kylemern.vercel.app",
	})
);

mongoose
	.connect(mongoDBURL)
	.then(() => {
		console.log("App is connected");
		app.listen(PORT, () => {
			console.log(`Port is running at ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);
app.use("/user", workoutRoute);
