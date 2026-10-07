import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";

import StudentHomePage from "../pages/StudentHomePage";
import StudentProfilePage from "../pages/StudentProfilePage";

import SecretaryHomePage from "../pages/SecretaryHomePage";
import SecretaryEvaluationPage from "../pages/SecretaryEvaluationPage";

import AdminHomePage from "../pages/AdminHomePage";
import AdminSecretariesPage from "../pages/AdminSecretariesPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/recuperar-contrasena"
            element={<ForgotPasswordPage />}
          />

          <Route
            path="/restablecer-contrasena"
            element={<ResetPasswordPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route
              element={
                <RoleRoute
                  rolesPermitidos={["ESTUDIANTE"]}
                />
              }
            >
              <Route
                path="/estudiante"
                element={<StudentHomePage />}
              />

              <Route
                path="/estudiante/perfil"
                element={<StudentProfilePage />}
              />
            </Route>

            <Route
              element={
                <RoleRoute
                  rolesPermitidos={["SECRETARIO"]}
                />
              }
            >
              <Route
                path="/secretario"
                element={<SecretaryHomePage />}
              />

              <Route
                path="/secretario/convocatorias/:convocatoriaId/evaluacion"
                element={<SecretaryEvaluationPage />}
              />
            </Route>

            <Route
              element={
                <RoleRoute
                  rolesPermitidos={["ADMINISTRADOR"]}
                />
              }
            >
              <Route
                path="/administrador"
                element={<AdminHomePage />}
              />

              <Route
                path="/administrador/secretarios"
                element={<AdminSecretariesPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;