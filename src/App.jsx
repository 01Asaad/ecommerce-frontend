import { useState, useEffect } from 'react'
import './App.css'
import { UserProvider } from './context/UserProvider.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Hello from './pages/Hello.jsx';
import RootLayout from './pages/RootLayout.jsx';
import ProductView from './pages/ProductView.jsx';
import ProductAdd from './pages/ProductAdd.jsx';
import NotFoundErrorPage from './pages/NotFoundError.jsx';
const router = createBrowserRouter([
  {path : "/", element : <RootLayout/>, errorElement : <NotFoundErrorPage/>, children : [
    { index : true, element: <Home/> },
    {path : "/products/view/:productID", element : <ProductView/>},
    {path : "/products/add", element : <ProductAdd/>},
    {path : "/products/modify/:productID", element : <ProductAdd/>}
  ]},
  { path: "/login", element: <Login/> },
  { path: "/signup", element: <Signup/> },
  { path: "/hello", element: <Hello/> },
])

function App() {
  const [isDark, setIsDark] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  
  useEffect(() => {
    const theme = localStorage.theme;
    const isDarkMode = theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setThemeLoaded(true);
  }, []);

  if (!themeLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
     <div className='App'>
        <UserProvider>
          <RouterProvider router={router}></RouterProvider>
        </UserProvider>
    </div>
  )
}

export default App