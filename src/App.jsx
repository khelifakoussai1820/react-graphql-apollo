
import { createBrowserRouter, RouterProvider } from 'react-router'

import AppHome from './pages/app/AppHome'
import PageDetail from './pages/app/PageDetail'
import WorkspacePage from './pages/app/WorkspacePage'

import Login from './pages/auth/login'
import SignUp from './pages/auth/signup'
import Verify from './pages/auth/verify'

import ErrorPage from './pages/errors/ErrorPage'


const router = createBrowserRouter([
  {path:'/', element:<AppHome/>},
  {path:'/signup', element:<SignUp/>},
  {path:'/login', element:<Login/>},
  {path:'/verify', element:<Verify/>},
  {path:'/worskpace', element:<WorkspacePage/>},
  {path:'/errors', element:<ErrorPage/>},
])


function App() {
  

  return (
    <> <RouterProvider router={router} /> </>
  )
    
  
}

export default App
