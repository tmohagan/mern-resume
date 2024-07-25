import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './UserContext';
import Header from './Header';

const mockUserContext = {
  userInfo: null,
  setUserInfo: jest.fn(),
  logout: jest.fn(),
};

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <UserContext.Provider value={mockUserContext}>
      <BrowserRouter>{ui}</BrowserRouter>
    </UserContext.Provider>
  );
};

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('renders logo link', () => {
  renderWithRouter(<Header />);
  const logoLink = screen.getByText('tim-ohagan.com');
  expect(logoLink).toBeInTheDocument();
  expect(logoLink.getAttribute('href')).toBe('/');
});

test('renders login link when user is not logged in', () => {
  renderWithRouter(<Header />);
  const loginLink = screen.getByText('Login');
  expect(loginLink).toBeInTheDocument();
  expect(loginLink.getAttribute('href')).toBe('/login');
});