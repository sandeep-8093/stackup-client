export interface AuthUser {
  id: string;
  name: string;
  avatar?: string;
  exp?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  errors: Record<string, string> | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  errors: null,
};
