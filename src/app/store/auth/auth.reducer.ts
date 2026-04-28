import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    loading: false,
    errors: null,
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { errors }) => ({
    ...state,
    loading: false,
    errors,
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    errors: null,
  })),
  on(AuthActions.setCurrentUser, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    loading: false,
  })),
  on(AuthActions.logout, () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    errors: null,
  })),
  on(AuthActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
