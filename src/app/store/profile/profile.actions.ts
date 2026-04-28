import { createAction, props } from '@ngrx/store';
import { Profile } from './profile.state';

// Load my profile
export const loadMyProfile = createAction('[Profile] Load My Profile');
export const loadMyProfileSuccess = createAction(
  '[Profile] Load My Profile Success',
  props<{ profile: Profile }>()
);
export const loadMyProfileFailure = createAction(
  '[Profile] Load My Profile Failure',
  props<{ error: string }>()
);

// Load all profiles
export const loadProfiles = createAction('[Profile] Load All Profiles');
export const loadProfilesSuccess = createAction(
  '[Profile] Load All Profiles Success',
  props<{ profiles: Profile[] }>()
);
export const loadProfilesFailure = createAction(
  '[Profile] Load All Profiles Failure',
  props<{ error: string }>()
);

// Load profile by handle
export const loadProfileByHandle = createAction(
  '[Profile] Load Profile By Handle',
  props<{ handle: string }>()
);
export const loadProfileByHandleSuccess = createAction(
  '[Profile] Load Profile By Handle Success',
  props<{ profile: Profile }>()
);
export const loadProfileByHandleFailure = createAction(
  '[Profile] Load Profile By Handle Failure',
  props<{ error: string }>()
);

// Load profile by user ID
export const loadProfileByUserId = createAction(
  '[Profile] Load Profile By User ID',
  props<{ id: string }>()
);
export const loadProfileByUserIdSuccess = createAction(
  '[Profile] Load Profile By User ID Success',
  props<{ profile: Profile }>()
);
export const loadProfileByUserIdFailure = createAction(
  '[Profile] Load Profile By User ID Failure',
  props<{ error: string }>()
);

// Create/update profile
export const createProfile = createAction(
  '[Profile] Create Profile',
  props<{ profileData: Partial<Profile>; redirect?: boolean }>()
);
export const createProfileSuccess = createAction(
  '[Profile] Create Profile Success',
  props<{ profile: Profile }>()
);
export const createProfileFailure = createAction(
  '[Profile] Create Profile Failure',
  props<{ error: string }>()
);

// Add experience
export const addExperience = createAction(
  '[Profile] Add Experience',
  props<{ expData: any }>()
);
export const addExperienceSuccess = createAction(
  '[Profile] Add Experience Success',
  props<{ profile: Profile }>()
);

// Delete experience
export const deleteExperience = createAction(
  '[Profile] Delete Experience',
  props<{ id: string }>()
);
export const deleteExperienceSuccess = createAction(
  '[Profile] Delete Experience Success',
  props<{ profile: Profile }>()
);

// Add education
export const addEducation = createAction(
  '[Profile] Add Education',
  props<{ eduData: any }>()
);
export const addEducationSuccess = createAction(
  '[Profile] Add Education Success',
  props<{ profile: Profile }>()
);

// Delete education
export const deleteEducation = createAction(
  '[Profile] Delete Education',
  props<{ id: string }>()
);
export const deleteEducationSuccess = createAction(
  '[Profile] Delete Education Success',
  props<{ profile: Profile }>()
);

// Delete account
export const deleteAccount = createAction('[Profile] Delete Account');
export const deleteAccountSuccess = createAction('[Profile] Delete Account Success');

// Clear profile
export const clearProfile = createAction('[Profile] Clear Profile');
