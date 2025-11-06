import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />

          {/* protectect routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<Dashboard />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;