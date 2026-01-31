import testReducer, {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsCompanySuccess,
  createTestRequest,
  createTestSuccess,
  createTestFailure,
  fetchTestFailure,
  deleteTestSuccess,
} from '../../redux/test/testSlice';

describe('testSlice', () => {
  const initialState = {
    loading: false,
    tests: [],
    error: null,
    currentTestId: null,
    companyTests: [],
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = testReducer(undefined, { type: 'unknown' });
      expect(state.loading).toBe(false);
      expect(state.tests).toEqual([]);
      expect(state.error).toBeNull();
      expect(state.companyTests).toEqual([]);
    });
  });

  describe('fetchTestsRequest', () => {
    it('should set loading to true and clear errors', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };

      const state = testReducer(stateWithError, fetchTestsRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchTestsSuccess', () => {
    it('should set tests and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const tests = [
        { id: 1, title: 'Test 1' },
        { id: 2, title: 'Test 2' },
      ];

      const state = testReducer(loadingState, fetchTestsSuccess(tests));

      expect(state.loading).toBe(false);
      expect(state.tests).toEqual(tests);
      expect(state.tests).toHaveLength(2);
    });

    it('should replace existing tests', () => {
      const stateWithTests = {
        ...initialState,
        tests: [{ id: 0, title: 'Old Test' }],
        loading: true,
      };
      const newTests = [{ id: 1, title: 'New Test' }];

      const state = testReducer(stateWithTests, fetchTestsSuccess(newTests));

      expect(state.tests).toEqual(newTests);
      expect(state.tests).toHaveLength(1);
    });
  });

  describe('fetchTestsCompanySuccess', () => {
    it('should set company tests', () => {
      const loadingState = { ...initialState, loading: true };
      const companyTests = [
        { id: 1, title: 'Company Test 1' },
        { id: 2, title: 'Company Test 2' },
      ];

      const state = testReducer(loadingState, fetchTestsCompanySuccess(companyTests));

      expect(state.loading).toBe(false);
      expect(state.companyTests).toEqual(companyTests);
    });
  });

  describe('createTestRequest', () => {
    it('should set loading and clear errors', () => {
      const stateWithError = { ...initialState, error: 'Some error' };

      const state = testReducer(stateWithError, createTestRequest());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('createTestSuccess', () => {
    it('should add new test to tests array', () => {
      const stateWithTests = {
        ...initialState,
        tests: [{ id: 1, title: 'Existing Test' }],
        loading: true,
      };
      const newTest = { id: 2, title: 'New Test' };

      const state = testReducer(stateWithTests, createTestSuccess(newTest));

      expect(state.loading).toBe(false);
      expect(state.tests).toHaveLength(2);
      expect(state.tests[1]).toEqual(newTest);
    });

    it('should add to empty tests array', () => {
      const emptyState = { ...initialState, loading: true };
      const newTest = { id: 1, title: 'First Test' };

      const state = testReducer(emptyState, createTestSuccess(newTest));

      expect(state.tests).toHaveLength(1);
      expect(state.tests[0]).toEqual(newTest);
    });
  });

  describe('createTestFailure', () => {
    it('should set error and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Failed to create test';

      const state = testReducer(loadingState, createTestFailure(errorMessage));

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchTestFailure', () => {
    it('should set error and stop loading', () => {
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Failed to fetch tests';

      const state = testReducer(loadingState, fetchTestFailure(errorMessage));

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('deleteTestSuccess', () => {
    it('should remove test from companyTests by id', () => {
      const stateWithCompanyTests = {
        ...initialState,
        companyTests: [
          { id: 1, title: 'Test 1' },
          { id: 2, title: 'Test 2' },
          { id: 3, title: 'Test 3' },
        ],
      };

      const state = testReducer(stateWithCompanyTests, deleteTestSuccess(2));

      expect(state.companyTests).toHaveLength(2);
      expect(state.companyTests.find(t => t.id === 2)).toBeUndefined();
      expect(state.companyTests.find(t => t.id === 1)).toBeDefined();
      expect(state.companyTests.find(t => t.id === 3)).toBeDefined();
    });

    it('should remove test from companyTests by MongoDB _id', () => {
      const stateWithCompanyTests = {
        ...initialState,
        companyTests: [
          { _id: 'mongo1', title: 'Test 1' },
          { _id: 'mongo2', title: 'Test 2' },
        ],
      };

      const state = testReducer(stateWithCompanyTests, deleteTestSuccess('mongo2'));

      expect(state.companyTests).toHaveLength(1);
      expect(state.companyTests[0]._id).toBe('mongo1');
    });

    it('should handle deleting non-existent test gracefully', () => {
      const stateWithCompanyTests = {
        ...initialState,
        companyTests: [{ id: 1, title: 'Test 1' }],
      };

      const state = testReducer(stateWithCompanyTests, deleteTestSuccess(999));

      // Should not change the array
      expect(state.companyTests).toHaveLength(1);
    });
  });

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = {
        ...initialState,
        tests: [{ id: 1, title: 'Test' }],
      };
      const originalTestsRef = originalState.tests;

      testReducer(originalState, createTestSuccess({ id: 2, title: 'New' }));

      // Original state should remain unchanged
      expect(originalState.tests).toBe(originalTestsRef);
      expect(originalState.tests).toHaveLength(1);
    });
  });
});
