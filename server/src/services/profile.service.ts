import dbController from "../controllers/db.controller.js";
import { Profile } from "@check-mate/shared/types";
import { ServiceError } from "../utils/error.js";

const PROFILE_PREFIX = "profiles";

const ProfileService = {
	getProfile: async (id: string): Promise<Profile> => {
		const profile = await dbController.loadData<Profile>(PROFILE_PREFIX, id);
		if(!profile) {
			throw new ServiceError("Profile not found");
		}
		return profile;
	},

	saveProfile: (profile: Profile, id: string) => {
		return dbController.saveData<Profile>(PROFILE_PREFIX, profile, id);
	}
}

export default ProfileService;