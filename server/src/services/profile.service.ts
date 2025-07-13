import dbController from "../controllers/db.controller.js";
import { Profile } from "@check-mate/shared/types";
import { ServiceError } from "../utils/error.js";

class ProfileService {
	private readonly PROFILE_PREFIX = "profiles";

	getProfile = async (id: string): Promise<Profile> => {
		const profile = await dbController.loadData<Profile>(this.PROFILE_PREFIX, id);
		if(!profile) {
			throw new ServiceError("Profile not found");
		}
		return profile;
	}

	saveProfile = (profile: Profile, id: string) => {
		return dbController.saveData<Profile>(this.PROFILE_PREFIX, profile, id);
	}
}

export default ProfileService;