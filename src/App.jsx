import { useState, useEffect } from 'react'
import './App.css'
import { UserProvider } from './context/UserProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login, { action as LoginAction } from './pages/Login.jsx';
import Signup, { action as SignupAction } from './pages/Signup.jsx';
import RootLayout from './pages/RootLayout.jsx';
import AuthLayout from './pages/AuthLayout.jsx'
import ProductView, { loader as productViewLoader } from './pages/ProductView.jsx';
import ProductAdd, { action as productAddAction } from './pages/ProductAdd.jsx';
import ErrorPage from './pages/Error.jsx';
import MainLoadingPage from "./pages/MainLoading.jsx"
import ProductViewer from './pages/ProductViewer.jsx';
const router = createBrowserRouter([
  {
    path: "/", element: <RootLayout />, errorElement: <ErrorPage />, HydrateFallback: MainLoadingPage, children: [
      { index: true, element: <ProductViewer key="home" maxProducts={8} isShowAllProductsButtonShown /> },
      { path: "/products", element: <ProductViewer key="products" maxProducts={0} isShowAllProductsButtonShown={false} isSortBarShown isAddButttonEnabled /> },
      { path: "/products/view/:productID", element: <ProductView />, loader: productViewLoader },
      { path: "/products/add", element: <ProductAdd />, action: productAddAction },
      { path: "/products/modify/:productID", element: <ProductAdd />, action: productAddAction },
    ]
  },
  {
    element: <AuthLayout />, errorElement: <ErrorPage />, children: [
      { path: "/login", element: <Login />, action: LoginAction },
      { path: "/signup", element: <Signup />, action: SignupAction },
    ]
  }
])
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5
    },
  },
});
function App() {


  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <RouterProvider router={router}></RouterProvider>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App