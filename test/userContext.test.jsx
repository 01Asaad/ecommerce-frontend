import { act, renderHook, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '../src/context/UserProvider';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

global.fetch = vi.fn();

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userContext', () => {


    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return user data and loading as false when backend resolves token as authenticated', async () => {
      const mockUser = {
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@kmail.com",
        "admin": false,
        "username": "jsmith",
        "userID": "68ec0f501ce8cdf55cb3a95a"
      };
      localStorage.getItem.mockReturnValue(JSON.stringify({ token: 'test-token' }));

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUser,
      });
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => <UserProvider>{children}</UserProvider>
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.user).toEqual({ ...mockUser, token: 'test-token' });
      expect(result.current.isLoggedIn).toBe(true);

      expect(localStorage.getItem).toHaveBeenCalledWith('user');
      expect(fetch).toHaveBeenCalled();
    });
    it("should remove token and userInfo when logout is called", async () => {
      const mockUser = {
        "firstName": "John",
        "lastName": "Smith",
        "email": "johnsmith@kmail.com",
        "admin": false,
        "username": "jsmith",
        "userID": "68ec0f501ce8cdf55cb3a95a"
      };
      localStorage.getItem.mockReturnValue(JSON.stringify({ token: 'test-token' }));

      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUser,
      });
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => <UserProvider>{children}</UserProvider>
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isLoggedIn).toBe(true)
      });
      act(() => {
        result.current.logout();
      });
      expect(result.current.isLoggedIn).toBe(false)
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    })
    it("should delete token and user form localStorage when backend resolves as not authenticated", async () => {
      const blankUser = {
        email: '',
        firstName: '',
        lastName: '',
        username: "",
        token: '',
        userID: ''
      }
      localStorage.getItem.mockReturnValue(JSON.stringify({ token: 'test-token' }));
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => { return { message: "Not authenticated." } },
      });
      const { result } = renderHook(() => useUser(), {
        wrapper: ({ children }) => <UserProvider>{children}</UserProvider>
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.user).toEqual(blankUser);
      expect(result.current.isLoggedIn).toBe(false);

      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(fetch).toHaveBeenCalled();
    })
  });
});