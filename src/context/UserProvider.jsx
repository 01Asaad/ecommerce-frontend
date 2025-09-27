import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const UserContext = createContext({
    isLoggedIn: false,
    user: {
        email: '',
        firstName: '',
        lastName: '',
        username: "",
        token: '',
        userID : ''
    },
    setUser: () => { }
});

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        email: '',
        firstName: '',
        lastName: '',
        username: "",
        token: '',
        userID : ''
    });

    const fetchUserData = async (token) => {
        try {
          const response = await fetch('http://localhost:3001/api/auth/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            setUser({
                email: '',
                firstName: '',
                lastName: '',
                username: "",
                token: '',
                userID : ''
            });
            setIsLoggedIn(false);
            localStorage.removeItem('user');
          } else {
            const data = await response.json();
            setUser({ ...data, token });
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
        }
      };
    
      useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const { token } = JSON.parse(storedUser);
          if (token) {
            fetchUserData(token);
          }
        }
      }, []);
    
      useEffect(() => {
        if (isLoggedIn) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [isLoggedIn, user]);

    const value = useMemo(() => ({
        isLoggedIn,
        user,
        setUser: (userData) => {
            setIsLoggedIn(!!userData.token);
            setUser(userData);
        },
    }), [isLoggedIn, user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
