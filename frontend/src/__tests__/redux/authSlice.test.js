import authReducer, {
  loginSuccess,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  profileUpdateRequest,
  profileUpdateSuccess,
  profileUpdateFailure,
  restoreSession,
  clearSession,
  setLoading,
} from '../../redux/auth/authSlice';

describe('authSlice', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    userType: null,
    token: null,
    error: null,
    loading: false,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    it('should set authenticated state with user and token', () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com', userType: 'individual' };
      const token = 'test-jwt-token';

      const state = authReducer(initialState, loginSuccess({ user, token }));

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.userType).toBe('individual');
      expect(state.token).toBe(token);
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should clear any previous errors', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const user = { id: 1, username: 'testuser', userType: 'individual' };

      const state = authReducer(stateWithError, loginSuccess({ user, token: 'token' }));

      expect(state.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should reset state to initial values', () => {
      const authenticatedState = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        userType: 'individual',
        token: 'test-token',
        error: null,
        loading: false,
      };

      const state = authReducer(authenticatedState, logout());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.userType).toBeNull();
    });
  });

  describe('registerRequest', () => {
    it('should set loading to true and clear errors', () => {
      const stateWithError = { ...initialState, error: 'Some error' };

      const state = authReducer(stateWithError, registerRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('registerSuccess', () => {
    it('should set authenticated state with new user', () => {
      const user = { id: 1, username: 'newuser', email: 'new@example.com', userType: 'individual' };
      const token = 'new-jwt-token';

      const state = authReducer(initialState, registerSuccess({ user, token }));

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.userType).toBe('individual');
      expect(state.token).toBe(token);
      expect(state.loading).toBe(false);
    });
  });

  describe('registerFailure', () => {
    it('should set error and reset authentication state', () => {
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Registration failed';

      const state = authReducer(loadingState, registerFailure(errorMessage));

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  describe('profileUpdateRequest', () => {
    it('should set loading to true', () => {
      const state = authReducer(initialState, profileUpdateRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('profileUpdateSuccess', () => {
    it('should update user with new data', () => {
      const existingState = {
        ...initialState,
        isAuthenticated: true,
        user: { id: 1, username: 'testuser', name: 'Old Name' },
        loading: true,
      };
      const updatedUser = { id: 1, username: 'testuser', name: 'New Name', userType: 'individual' };

      const state = authReducer(existingState, profileUpdateSuccess({ user: updatedUser }));

      expect(state.user.name).toBe('New Name');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle user data directly without wrapper', () => {
      const existingState = {
        ...initialState,
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        loading: true,
      };
      const updatedUser = { id: 1, username: 'testuser', name: 'Direct Update', userType: 'individual' };

      const state = authReducer(existingState, profileUpdateSuccess(updatedUser));

      expect(state.user.name).toBe('Direct Update');
    });
  });

  describe('profileUpdateFailure', () => {
    it('should set error and stop loading', () => {
      const loadingState = { ...initialState, loading: true };

      const state = authReducer(loadingState, profileUpdateFailure('Update failed'));

      expect(state.error).toBe('Update failed');
      expect(state.loading).toBe(false);
    });
  });

  describe('restoreSession', () => {
    it('should restore authentication from stored token', () => {
      const user = { id: 1, username: 'testuser', userType: 'company' };
      const token = 'stored-token';

      const state = authReducer(initialState, restoreSession({ user, token }));

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.userType).toBe('company');
      expect(state.token).toBe(token);
    });
  });

  describe('clearSession', () => {
    it('should clear all session data', () => {
      const authenticatedState = {
        isAuthenticated: true,
        user: { id: 1 },
        userType: 'individual',
        token: 'some-token',
        error: null,
        loading: false,
      };

      const state = authReducer(authenticatedState, clearSession());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const state1 = authReducer(initialState, setLoading(true));
      expect(state1.loading).toBe(true);

      const state2 = authReducer(state1, setLoading(false));
      expect(state2.loading).toBe(false);
    });
  });
});
