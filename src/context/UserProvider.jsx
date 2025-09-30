import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const UserContext = createContext({
  isLoading: true,
  isLoggedIn: false,
  user: {
    email: '',
    firstName: '',
    lastName: '',
    username: "",
    token: '',
    userID: '',
  },
  setUserInfo: () => { }
});

export const UserProvider = ({ children }) => {
  const blankUser = {
    email: '',
    firstName: '',
    lastName: '',
    username: "",
    token: '',
    userID: ''
  }
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    isLoading: true,
    userInfo: blankUser
  });
  const { isLoggedIn, isLoading, userInfo: user } = authData
  const fetchUserData = async (token) => {
    console.log("calling fetch func");
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setAuthData(a => { return { ...a, userInfo: blankUser, isLoggedIn: false, isLoading : false } });
        console.error(await response.json());
        
        localStorage.removeItem('user');
      } else {
        
        const data = await response.json();
        setAuthData(a => { return { ...a, userInfo: { ...data, token }, isLoggedIn: true, isLoading : false } });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setAuthData(a => { return { ...a, isLoggedIn: false, isLoading : false } });
    }
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        fetchUserData(token);
      } else {
        setAuthData(a => { return { ...a, isLoading : false } });
      }
    } else {
      setAuthData(a => { return { ...a, isLoading : false } });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [isLoggedIn, user, isLoading]);

  const value = useMemo(() => ({
    isLoading,
    isLoggedIn,
    user,
    setUserInfo: (userInfo) => {
      setAuthData((a) => { return { ...a, isLoggedIn: !!userInfo.token, userInfo: userInfo } })
    },
  }), [isLoggedIn, user, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
