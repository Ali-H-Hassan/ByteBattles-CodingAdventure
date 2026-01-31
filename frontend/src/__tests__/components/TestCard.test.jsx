import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TestCard from '../../components/TestCard/TestCard';

// Mock the redux actions
jest.mock('../../redux/testDetails/testDetailsActions', () => ({
  fetchTestById: jest.fn(() => ({ type: 'TEST_DETAILS/FETCH' })),
}));

jest.mock('../../redux/testResults/testResultsActions', () => ({
  checkIfTestTaken: jest.fn(() => Promise.resolve(false)),
}));

// Mock the default logo
jest.mock('../../assets/DefaultLogo.jpeg', () => 'mock-default-logo.jpg');

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { user: { id: 1 } }) => state,
      testDetails: (state = {}) => state,
      testResults: (state = {}) => state,
    },
    preloadedState: initialState,
  });
};

// Wrapper component for rendering with providers
const renderWithProviders = (component, { store = createMockStore() } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('TestCard Component', () => {
  const mockTest = {
    id: 1,
    title: 'JavaScript Fundamentals',
    companyName: 'Tech Corp',
    logo: 'test-logo.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render test title', async () => {
      renderWithProviders(<TestCard test={mockTest} />);

      await waitFor(() => {
        expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
      });
    });

    it('should render company name when provided', async () => {
      renderWithProviders(<TestCard test={mockTest} />);

      await waitFor(() => {
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      });
    });

    it('should render test logo', async () => {
      renderWithProviders(<TestCard test={mockTest} />);

      await waitFor(() => {
        const logo = screen.getByAltText('JavaScript Fundamentals logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'test-logo.jpg');
      });
    });

    it('should return null when test prop is not provided', () => {
      const { container } = renderWithProviders(<TestCard test={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('should use default title when title is not provided', async () => {
      const testWithoutTitle = { id: 1 };
      renderWithProviders(<TestCard test={testWithoutTitle} />);

      await waitFor(() => {
        expect(screen.getByText('No Title')).toBeInTheDocument();
      });
    });
  });

  describe('Button States', () => {
    it('should show a button element', async () => {
      renderWithProviders(<TestCard test={mockTest} />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('MongoDB ID Support', () => {
    it('should support MongoDB _id format', async () => {
      const mongoTest = {
        _id: 'mongo123',
        title: 'MongoDB Test',
      };

      renderWithProviders(<TestCard test={mongoTest} />);

      await waitFor(() => {
        expect(screen.getByText('MongoDB Test')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle test without company name', async () => {
      const testWithoutCompany = {
        id: 1,
        title: 'Solo Test',
      };

      renderWithProviders(<TestCard test={testWithoutCompany} />);

      await waitFor(() => {
        expect(screen.getByText('Solo Test')).toBeInTheDocument();
      });

      // Company section should not be rendered
      expect(screen.queryByText('Tech Corp')).not.toBeInTheDocument();
    });

    it('should render default logo when logo is not provided', async () => {
      const testWithoutLogo = {
        id: 1,
        title: 'Test Without Logo',
      };

      renderWithProviders(<TestCard test={testWithoutLogo} />);

      await waitFor(() => {
        const logo = screen.getByAltText('Test Without Logo logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'mock-default-logo.jpg');
      });
    });
  });
});
