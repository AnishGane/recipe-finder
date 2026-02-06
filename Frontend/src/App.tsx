import { Navigate, Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import { PublicRoute } from "./components/public-route"
import ProtectedRoute from "./components/protected-route"

const App = () => {
  return (
    <>
      <Routes>
        {/* Protected Routes - Only accessible when logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App