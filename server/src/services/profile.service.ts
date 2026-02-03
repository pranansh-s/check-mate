import { Profile } from '@xhess/shared/schemas';

import dbController from '../controllers/db.controller.js';

import { ServiceError } from '../utils/error.js';

import RoomService from './room.service.js';

const PROFILE_PREFIX = 'profiles';

const ProfileService = {
  getProfile: async (id: string): Promise<Profile> => {
    const profile = await dbController.loadData<Profile>(PROFILE_PREFIX, id);
    if (!profile) {
      throw new ServiceError('Profile not found');
    }
    return profile;
  },

  getPlayerProfiles: async (
    roomId: string,
    userId: string
  ): Promise<{ myProfile: Profile; opponentProfile: Profile | null }> => {
    const participants = (await RoomService.getRoom(roomId)).participants;

    if (!participants.includes(userId)) {
      throw new Error('User is not a participant in this room');
    }

    if (participants.length === 1) {
      const myProfile = await ProfileService.getProfile(participants[0]);
      return { myProfile, opponentProfile: null };
    }

    const [firstProfile, secondProfile] = await Promise.all([
      ProfileService.getProfile(participants[0]),
      ProfileService.getProfile(participants[1]),
    ]);

    return {
      myProfile: userId == participants[0] ? firstProfile : secondProfile,
      opponentProfile: userId == participants[0] ? secondProfile : firstProfile,
    };
  },

  saveProfile: (profile: Profile, id: string) => {
    return dbController.saveData<Profile>(PROFILE_PREFIX, profile, id);
  },
};

export default ProfileService;
