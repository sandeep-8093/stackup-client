import { createReducer, on } from '@ngrx/store';
import { initialProfileState } from './profile.state';
import * as ProfileActions from './profile.actions';

export const profileReducer = createReducer(
  initialProfileState,
  on(ProfileActions.loadMyProfile, ProfileActions.loadProfiles, ProfileActions.loadProfileByHandle, ProfileActions.loadProfileByUserId, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.loadMyProfileSuccess, ProfileActions.loadProfileByHandleSuccess, ProfileActions.loadProfileByUserIdSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ProfileActions.loadProfilesSuccess, (state, { profiles }) => ({
    ...state,
    profiles,
    loading: false,
  })),
  on(ProfileActions.loadMyProfileFailure, ProfileActions.loadProfilesFailure,
    ProfileActions.loadProfileByHandleFailure, ProfileActions.loadProfileByUserIdFailure, ProfileActions.createProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.createProfileSuccess,
    ProfileActions.addExperienceSuccess,
    ProfileActions.deleteExperienceSuccess,
    ProfileActions.addEducationSuccess,
    ProfileActions.deleteEducationSuccess,
    (state, { profile }) => ({
      ...state,
      profile,
      loading: false,
    })
  ),
  on(ProfileActions.clearProfile, ProfileActions.deleteAccountSuccess, (state) => ({
    ...state,
    profile: null,
  }))
);
