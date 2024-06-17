import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
	},
	password: String,
	conPassword: String,
});

export const User = mongoose.model("User", userSchema);
