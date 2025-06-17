import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import UserLayout from './layout/UserLayout'
import Home from './pages/sections/Home'
import DetectPage from './pages/sections/DetectDisease'
import Shop from './pages/sections/Shop'
import ContactPage from './pages/sections/Contact'
import Guide from './pages/sections/Guide'
import FertilizerCalculator from './pages/sections/FertilizerCalculator'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import GoogleSuccessLogin from './pages/auth/GoogleSuccessLogin'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/dashboard/Products'
import Orders from './pages/dashboard/Orders'
import Customers from './pages/dashboard/Customers'
import DiseasesPage from './pages/dashboard/Diseases'
import Messages from './pages/dashboard/Messages'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import './App.css'
import { useEffect } from 'react'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/detect",
          element: <DetectPage />
        },
        {
          path: "/shop",
          element: <Shop />
        },
        {
          path: "/contact",
          element: <ContactPage />
        },
        {
          path: "/guide",
          element: <Guide />
        },
        {
          path: "/fertilizer-calculator",
          element: <FertilizerCalculator />
        }
      ]
    },
    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />
        },
        {
          path: "/dashboard/products",
          element: <Products />
        },
        {
          path: "/dashboard/orders",
          element: <Orders />
        },
        {
          path: "/dashboard/customers",
          element: <Customers />
        },
        {
          path: "/dashboard/diseases",
          element: <DiseasesPage />
        },
        {
          path: "/dashboard/messages",
          element: <Messages />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/login/success",
      element: <GoogleSuccessLogin />
    }
  ])

  useEffect(() => {
    if (localStorage.getItem('googleAuthSuccess') === 'true') {
      toast.success("Logged in with Google successfully");
      localStorage.removeItem('googleAuthSuccess');
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster />
      </Provider>
    </>
  )
}

export default App
