import { createAction, props } from '@ngrx/store';
import { AuthUser } from './auth.state';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; user: AuthUser }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ errors: Record<string, string> }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ name: string; email: string; password: string; password2: string }>()
);

export const registerSuccess = createAction('[Auth] Register Success');

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ errors: Record<string, string> }>()
);

export const setCurrentUser = createAction(
  '[Auth] Set Current User',
  props<{ user: AuthUser }>()
);

export const logout = createAction('[Auth] Logout');

export const clearErrors = createAction('[Auth] Clear Errors');
