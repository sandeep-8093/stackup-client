import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, s => s.isAuthenticated);
export const selectCurrentUser = createSelector(selectAuthState, s => s.user);
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthErrors = createSelector(selectAuthState, s => s.errors);
