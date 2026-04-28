import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.state';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectProfile = createSelector(selectProfileState, s => s.profile);
export const selectProfiles = createSelector(selectProfileState, s => s.profiles);
export const selectProfileLoading = createSelector(selectProfileState, s => s.loading);
export const selectProfileError = createSelector(selectProfileState, s => s.error);
