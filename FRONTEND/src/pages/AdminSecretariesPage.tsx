import { useEffect, useState } from "react";

import { secretarioService } from "../services/secretario.service";

import type { Secretario } from "../types/secretario";

const AdminSecretariesPage = () => {
  const [secretarios, setSecretarios] = useState<Secretario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correoInstitucional, setCorreoInstitucional] = useState("");
  const [cargo, setCargo] = useState("");

  const [secretarioEditando, setSecretarioEditando] =
    useState<Secretario | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarSecretarios = async (termino?: string) => {
    try {
      setCargando(true);
      setError("");

      const datos = await secretarioService.listar(termino);

      setSecretarios(datos);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la lista de secretarios"
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSecretarios();
  }, []);

  const limpiarFormulario = () => {
    setNombres("");
    setApellidos("");
    setCorreoInstitucional("");
    setCargo("");
    setSecretarioEditando(null);
  };

  const manejarBusqueda = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await cargarSecretarios(busqueda.trim() || undefined);
  };

  const limpiarBusqueda = async () => {
    setBusqueda("");
    await cargarSecretarios();
  };

  const manejarGuardar = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      const datos = {
        nombres,
        apellidos,
        correoInstitucional,
        cargo: cargo || null,
      };

      if (secretarioEditando) {
        await secretarioService.actualizar(
          secretarioEditando.usuarioId,
          datos
        );

        setMensaje("Secretario actualizado correctamente");
      } else {
        await secretarioService.registrar(datos);

        setMensaje("Secretario registrado correctamente");
      }

      limpiarFormulario();

      await cargarSecretarios(
        busqueda.trim() || undefined
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el secretario"
      );
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicion = (secretario: Secretario) => {
    setSecretarioEditando(secretario);

    setNombres(secretario.nombres);
    setApellidos(secretario.apellidos);
    setCorreoInstitucional(secretario.correoInstitucional);
    setCargo(secretario.cargo || "");

    setError("");
    setMensaje("");
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setError("");
    setMensaje("");
  };

  const desactivarSecretario = async (
    secretario: Secretario
  ) => {
    const confirmar = window.confirm(
      `¿Deseas desactivar a ${secretario.nombres} ${secretario.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await secretarioService.desactivar(
        secretario.usuarioId
      );

      setMensaje("Secretario desactivado correctamente");

      await cargarSecretarios(
        busqueda.trim() || undefined
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo desactivar el secretario"
      );
    }
  };

  return (
    <section className="private-page">
      <h1 className="private-page-title">
        Gestión de secretarios
      </h1>

      <p className="private-page-description">
        Registra, edita, busca y desactiva las cuentas de los secretarios.
      </p>

      <h2 className="secretaries-section-title">
        {secretarioEditando
          ? "Editar secretario"
          : "Registrar secretario"}
      </h2>

      <form
        className="secretaries-form"
        onSubmit={manejarGuardar}
      >
        <div className="secretaries-field">
          <label
            className="secretaries-label"
            htmlFor="nombres"
          >
            Nombres
          </label>

          <input
            className="secretaries-input"
            id="nombres"
            type="text"
            value={nombres}
            onChange={(event) =>
              setNombres(event.target.value)
            }
            required
          />
        </div>

        <div className="secretaries-field">
          <label
            className="secretaries-label"
            htmlFor="apellidos"
          >
            Apellidos
          </label>

          <input
            className="secretaries-input"
            id="apellidos"
            type="text"
            value={apellidos}
            onChange={(event) =>
              setApellidos(event.target.value)
            }
            required
          />
        </div>

        <div className="secretaries-field">
          <label
            className="secretaries-label"
            htmlFor="correoInstitucional"
          >
            Correo institucional
          </label>

          <input
            className="secretaries-input"
            id="correoInstitucional"
            type="email"
            placeholder="usuario@unmsm.edu.pe"
            value={correoInstitucional}
            onChange={(event) =>
              setCorreoInstitucional(event.target.value)
            }
            required
          />
        </div>

        <div className="secretaries-field">
          <label
            className="secretaries-label"
            htmlFor="cargo"
          >
            Cargo
          </label>

          <input
            className="secretaries-input"
            id="cargo"
            type="text"
            value={cargo}
            onChange={(event) =>
              setCargo(event.target.value)
            }
          />
        </div>

        <div className="secretaries-form-actions">
          <button
            className="private-primary-button"
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : secretarioEditando
                ? "Guardar cambios"
                : "Registrar secretario"}
          </button>

          {secretarioEditando && (
            <button
              className="private-secondary-button"
              type="button"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {mensaje && (
        <p className="secretaries-success-message">
          {mensaje}
        </p>
      )}

      {error && (
        <p
          className="private-error-message"
          role="alert"
        >
          {error}
        </p>
      )}

      <h2 className="secretaries-section-title">
        Secretarios registrados
      </h2>

      <form
        className="secretaries-search"
        onSubmit={manejarBusqueda}
      >
        <input
          className="secretaries-input"
          type="search"
          value={busqueda}
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
          placeholder="Buscar por nombre"
        />

        <button
          className="private-primary-button"
          type="submit"
        >
          Buscar
        </button>

        {busqueda && (
          <button
            className="private-secondary-button"
            type="button"
            onClick={limpiarBusqueda}
          >
            Limpiar
          </button>
        )}
      </form>

      {cargando && (
        <p>Cargando secretarios...</p>
      )}

      {!cargando && secretarios.length === 0 && (
        <p>No se encontraron secretarios.</p>
      )}

      {!cargando && secretarios.length > 0 && (
        <div className="secretaries-table-container">
          <table className="secretaries-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Correo institucional</th>
                <th>Cargo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {secretarios.map((secretario) => (
                <tr key={secretario.usuarioId}>
                  <td>
                    {secretario.nombres} {secretario.apellidos}
                  </td>

                  <td>
                    {secretario.correoInstitucional}
                  </td>

                  <td>
                    {secretario.cargo || "Sin cargo"}
                  </td>

                  <td>
                    <span
                      className={
                        secretario.estado === "ACTIVO"
                          ? "secretaries-status secretaries-status-active"
                          : "secretaries-status secretaries-status-inactive"
                      }
                    >
                      {secretario.estado}
                    </span>
                  </td>

                  <td>
                    <div className="secretaries-actions">
                      <button
                        className="secretaries-action-button"
                        type="button"
                        onClick={() =>
                          iniciarEdicion(secretario)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="secretaries-action-button secretaries-action-button-danger"
                        type="button"
                        onClick={() =>
                          desactivarSecretario(secretario)
                        }
                        disabled={
                          secretario.estado === "INACTIVO"
                        }
                      >
                        {secretario.estado === "INACTIVO"
                          ? "Desactivado"
                          : "Desactivar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminSecretariesPage;
