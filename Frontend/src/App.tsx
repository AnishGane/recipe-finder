import { Navigate, Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/signup"
import { PublicRoute } from "./components/public-route"
import ProtectedRoute from "./components/protected-route"
import Collections from "./pages/collections"
import MyCookbook from "./pages/my-cookbook"
import SavedRecipes from "./pages/saved-recipes"
import Communities from "./pages/communities"
import CreateRecipePage from "./components/create-recipe"
import Explore from "./pages/explore"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <main className="container min-w-full min-h-screen bg-background mx-auto">
      <Toaster />
      <Routes>
        {/* Protected Routes - Only accessible when logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route path="/collections" element={
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        } />
        <Route path="/my-cookbook" element={
          <ProtectedRoute>
            <MyCookbook />
          </ProtectedRoute>
        } />
        <Route path="/saved-recipes" element={
          <ProtectedRoute>
            <SavedRecipes />
          </ProtectedRoute>
        } />
        <Route path="/communities" element={
          <ProtectedRoute>
            <Communities />
          </ProtectedRoute>
        } />
        <Route path="/create-recipe" element={
          <ProtectedRoute>
            <CreateRecipePage />
          </ProtectedRoute>
        } />
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
    </main>
  )
}

export default App