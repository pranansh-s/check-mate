import express from "express";
import ProfileService from "../services/profile.service.js";
import { handleAuthValidation } from "../middleware.js";
import { ProfileSchema } from "@check-mate/shared/schemas";

const router = express.Router();

router.get('/profile', async (req, res, next) => {
	try {
		const userId = req.userId;
		const profile = await ProfileService.getProfile(userId);

		res.status(200).json(profile);
	}
	catch (err) {
		next(err);
	}
});

router.post('/new-profile', handleAuthValidation, async (req, res, next) => {
	try {
		const userId = req.userId;
		const newProfile = ProfileSchema.parse(req.body);
		
		await ProfileService.saveProfile({ ...newProfile, createdAt: Date.now() }, userId);

		res.status(201).json(newProfile);
	}
	catch (err) {
		next(err);
	}
});

export default router;