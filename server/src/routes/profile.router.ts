import express from "express";
import ProfileService from "../services/profile.service.js";
import { handleAuthValidation } from "../middleware.js";

const router = express.Router();

const profileService = new ProfileService();

router.get('/profile', handleAuthValidation, async (req, res, next) => {
	try {
		const userId = req.userId;
		const profile = await profileService.getProfile(userId);

		res.status(200).json(profile);
	}
	catch (err) {
		next(err);
	}
});

router.post('/new-profile', handleAuthValidation, async (req, res, next) => {
	try {
		const userId = req.userId;
		const newProfile = req.body;
		//reqs validation
		await profileService.saveProfile(newProfile, userId);

		res.status(201);
	}
	catch (err) {
		next(err);
	}
});

export default router;