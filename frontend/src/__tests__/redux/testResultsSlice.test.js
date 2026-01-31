import testResultsReducer, {
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  submitTestRequest,
  submitTestSuccess,
  submitTestFailure,
} from '../../redux/testResults/testResultsSlice';

describe('testResultsSlice', () => {
  const initialState = {
    results: [],
    loading: false,
    error: null,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = testResultsReducer(undefined, { type: 'unknown' });
      expect(state.results).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchResultsRequest', () => {
    it('should set loading to true and clear errors', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };

      const state = testResultsReducer(stateWithError, fetchResultsRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchResultsSuccess', () => {
    it('should set results and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const results = [
        { id: 1, testId: 1, score: 85 },
        { id: 2, testId: 2, score: 92 },
      ];

      const state = testResultsReducer(loadingState, fetchResultsSuccess(results));

      expect(state.loading).toBe(false);
      expect(state.results).toEqual(results);
      expect(state.error).toBeNull();
    });

    it('should replace existing results', () => {
      const stateWithResults = {
        ...initialState,
        results: [{ id: 0, testId: 0, score: 50 }],
        loading: true,
      };
      const newResults = [{ id: 1, testId: 1, score: 100 }];

      const state = testResultsReducer(stateWithResults, fetchResultsSuccess(newResults));

      expect(state.results).toEqual(newResults);
      expect(state.results).toHaveLength(1);
    });

    it('should clear any existing errors', () => {
      const stateWithError = {
        ...initialState,
        loading: true,
        error: 'Some error',
      };
      const results = [{ id: 1, score: 75 }];

      const state = testResultsReducer(stateWithError, fetchResultsSuccess(results));

      expect(state.error).toBeNull();
    });
  });

  describe('fetchResultsFailure', () => {
    it('should set error and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Failed to fetch results';

      const state = testResultsReducer(loadingState, fetchResultsFailure(errorMessage));

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should preserve existing results on error', () => {
      const stateWithResults = {
        loading: true,
        results: [{ id: 1, score: 80 }],
        error: null,
      };

      const state = testResultsReducer(stateWithResults, fetchResultsFailure('Error'));

      expect(state.results).toHaveLength(1);
    });
  });

  describe('submitTestRequest', () => {
    it('should set loading and clear errors', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };

      const state = testResultsReducer(stateWithError, submitTestRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('submitTestSuccess', () => {
    it('should add new result to beginning of results array', () => {
      const stateWithResults = {
        loading: true,
        results: [
          { id: 1, testId: 1, score: 75 },
          { id: 2, testId: 2, score: 80 },
        ],
        error: null,
      };
      const newResult = { id: 3, testId: 3, score: 90 };

      const state = testResultsReducer(stateWithResults, submitTestSuccess(newResult));

      expect(state.loading).toBe(false);
      expect(state.results).toHaveLength(3);
      expect(state.results[0]).toEqual(newResult); // New result is first
      expect(state.error).toBeNull();
    });

    it('should add to empty results array', () => {
      const emptyState = { ...initialState, loading: true };
      const newResult = { id: 1, testId: 1, score: 85 };

      const state = testResultsReducer(emptyState, submitTestSuccess(newResult));

      expect(state.results).toHaveLength(1);
      expect(state.results[0]).toEqual(newResult);
    });

    it('should preserve existing results', () => {
      const stateWithResults = {
        loading: true,
        results: [{ id: 1, testId: 1, score: 70 }],
        error: null,
      };
      const newResult = { id: 2, testId: 2, score: 95 };

      const state = testResultsReducer(stateWithResults, submitTestSuccess(newResult));

      expect(state.results[1]).toEqual({ id: 1, testId: 1, score: 70 });
    });
  });

  describe('submitTestFailure', () => {
    it('should set error and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Failed to submit test';

      const state = testResultsReducer(loadingState, submitTestFailure(errorMessage));

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should preserve existing results on submission error', () => {
      const stateWithResults = {
        loading: true,
        results: [{ id: 1, score: 80 }],
        error: null,
      };

      const state = testResultsReducer(stateWithResults, submitTestFailure('Submission failed'));

      expect(state.results).toHaveLength(1);
    });
  });

  describe('state mutation safety', () => {
    it('should not mutate state when using immer (internal)', () => {
      // Redux Toolkit uses immer internally, so this tests that the slice
      // properly creates new state references
      const originalState = {
        results: [{ id: 1, score: 80 }],
        loading: false,
        error: null,
      };

      const newState = testResultsReducer(originalState, submitTestSuccess({ id: 2, score: 90 }));

      // Original state should not be mutated
      expect(originalState.results).toHaveLength(1);
      expect(newState.results).toHaveLength(2);
      expect(originalState).not.toBe(newState);
    });
  });

  describe('result ordering', () => {
    it('should maintain most recent results first', () => {
      let state = initialState;

      // Simulate submitting multiple tests
      state = testResultsReducer(state, submitTestSuccess({ id: 1, testTitle: 'First Test', score: 70 }));
      state = testResultsReducer(state, submitTestSuccess({ id: 2, testTitle: 'Second Test', score: 80 }));
      state = testResultsReducer(state, submitTestSuccess({ id: 3, testTitle: 'Third Test', score: 90 }));

      expect(state.results[0].id).toBe(3); // Most recent first
      expect(state.results[1].id).toBe(2);
      expect(state.results[2].id).toBe(1); // Oldest last
    });
  });
});
