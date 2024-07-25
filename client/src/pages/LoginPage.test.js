import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LoginPage from './LoginPage';
import api from '../api';
import { cleanup } from '@testing-library/react';



jest.mock('../api');

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const mockSetUserInfo = jest.fn();

const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <UserContext.Provider value={{ setUserInfo: mockSetUserInfo }}>
        {ui}
      </UserContext.Provider>
    </BrowserRouter>
  );
};

test('submits login form and updates user context', async () => {
  api.post.mockResolvedValueOnce({ data: { user: { id: '1', username: 'testuser' } } });

  renderWithContext(<LoginPage />);

  fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/login', { username: 'testuser', password: 'password123' });
  });

  await waitFor(() => {
    expect(mockSetUserInfo).toHaveBeenCalledWith({ id: '1', username: 'testuser' });
  });
});