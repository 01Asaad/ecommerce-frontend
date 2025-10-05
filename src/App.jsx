import { useState, useEffect } from 'react'
import './App.css'
import { UserProvider } from './context/UserProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login, {action as LoginAction} from './pages/Login.jsx';
import Signup, {action as SignupAction} from './pages/Signup.jsx';
import RootLayout from './pages/RootLayout.jsx';
import AuthLayout from './pages/AuthLayout.jsx'
import ProductView from './pages/ProductView.jsx';
import ProductAdd, {action as productAddAction} from './pages/ProductAdd.jsx';
import NotFoundErrorPage from './pages/NotFoundError.jsx';
import ProductsView from './pages/ProductsView.jsx';
const router = createBrowserRouter([
  {
    path: "/", element: <RootLayout />, errorElement: <NotFoundErrorPage />, children: [
      { index: true, element: <Home /> },
      { path: "/products/", element: <ProductsView /> },
      { path: "/products/view/:productID", element: <ProductView /> },
      { path: "/products/add", element: <ProductAdd />, action:productAddAction },
      { path: "/products/modify/:productID", element: <ProductAdd />, action : productAddAction },
    ]
  },
  {
    element: <AuthLayout />, errorElement: <NotFoundErrorPage />, children: [
      { path: "/login", element: <Login />, action : LoginAction },
      { path: "/signup", element: <Signup />, action : SignupAction },
    ]
  }
])

function App() {
  
  
  return (
    <div className='App'>
      <ThemeProvider>
        <UserProvider>
          <RouterProvider router={router}></RouterProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  )
}

export default App