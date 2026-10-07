import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

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

import HomeRedirect from "./HomeRedirect";
import { ROUTES } from "./paths";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ====================================================
            REDIRECCION INICIAL
            ==================================================== */}

        <Route
          path={ROUTES.HOME}
          element={<HomeRedirect />}
        />


        {/* ====================================================
            RUTAS PUBLICAS
            ==================================================== */}

        <Route element={<PublicLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={<LoginPage />}
          />

          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPasswordPage />}
          />

          <Route
            path={ROUTES.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
        </Route>


        {/* ====================================================
            RUTAS PROTEGIDAS
            ==================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<PrivateLayout />}>

            {/* ================================================
                ESTUDIANTE
                ================================================ */}

            <Route
              element={
                <RoleRoute
                  rolesPermitidos={[
                    "ESTUDIANTE",
                  ]}
                />
              }
            >
              <Route
                path={
                  ROUTES.ESTUDIANTE.HOME
                }
                element={
                  <StudentHomePage />
                }
              />

              <Route
                path={
                  ROUTES.ESTUDIANTE.PERFIL
                }
                element={
                  <StudentProfilePage />
                }
              />
            </Route>


            {/* ================================================
                SECRETARIO
                ================================================ */}

            <Route
              element={
                <RoleRoute
                  rolesPermitidos={[
                    "SECRETARIO",
                  ]}
                />
              }
            >
              <Route
                path={
                  ROUTES.SECRETARIO.HOME
                }
                element={
                  <SecretaryHomePage />
                }
              />

              <Route
                path={
                  ROUTES.SECRETARIO.EVALUACION
                }
                element={
                  <SecretaryEvaluationPage />
                }
              />
            </Route>


            {/* ================================================
                ADMINISTRADOR
                ================================================ */}

            <Route
              element={
                <RoleRoute
                  rolesPermitidos={[
                    "ADMINISTRADOR",
                  ]}
                />
              }
            >
              <Route
                path={
                  ROUTES.ADMINISTRADOR.HOME
                }
                element={
                  <AdminHomePage />
                }
              />

              <Route
                path={
                  ROUTES.ADMINISTRADOR.SECRETARIOS
                }
                element={
                  <AdminSecretariesPage />
                }
              />
            </Route>

          </Route>
        </Route>


        {/* ====================================================
            404
            ==================================================== */}

        <Route element={<PublicLayout />}>
          <Route
            path={ROUTES.NOT_FOUND}
            element={<NotFoundPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;