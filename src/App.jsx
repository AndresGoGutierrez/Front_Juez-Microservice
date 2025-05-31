import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import HomePage from "./pages/HomePage"
import ProblemPage from "./pages/ProblemPage"
import SubmissionPage from "./pages/SubmissionPage"
import SubmissionListPage from "./pages/SubmissionListPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminRoute from "./components/auth/AdminRoute"

import AdminProblemDetail from "./pages/admin/problems/ProblemDetail"
import AdminUserDetail from "./pages/admin/users/UserDetail"

// Páginas de administración
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProblemList from "./pages/admin/problems/ProblemList"
import AdminProblemCreate from "./pages/admin/problems/ProblemCreate"
import AdminProblemEdit from "./pages/admin/problems/ProblemEdit"


import AdminUserList from "./pages/admin/users/UserList"


import AdminSubmissionList from "./pages/admin/submissions/SubmissionList"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with header and footer */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <HomePage />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <LoginPage />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <RegisterPage />
                </main>
                <Footer />
              </>
            }
          />
          

          {/* Routes protected with Header and Footer */}
          <Route
            path="/problems/:id"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <ProtectedRoute>
                    <ProblemPage />
                  </ProtectedRoute>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/submissions"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <ProtectedRoute>
                    <SubmissionListPage />
                  </ProtectedRoute>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/submissions/:id"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <ProtectedRoute>
                    <SubmissionPage />
                  </ProtectedRoute>
                </main>
                <Footer />
              </>
            }
          />

          

          {/* Administration routes (without header or footer, use AdminLayout)) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <AdminRoute>
                <AdminProblemList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems/create"
            element={
              <AdminRoute>
                <AdminProblemCreate />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems/:id"
            element={
              <AdminRoute>
                <AdminProblemDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/problems/:id/edit"
            element={
              <AdminRoute>
                <AdminProblemEdit />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUserList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <AdminUserDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <AdminRoute>
                <AdminSubmissionList />
              </AdminRoute>
            }
          />

          {/* Ruta 404 */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <NotFoundPage />
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App