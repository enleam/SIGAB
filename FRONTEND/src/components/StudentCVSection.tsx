
import { useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";

import {
  cvService,
  type CVEstudiante,
} from "../services/cv.service";

const TAMANO_MAXIMO = 5 * 1024 * 1024;

const StudentCVSection = () => {
  const [cv, setCv] = useState<CVEstudiante | null>(null);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let activo = true;

    const cargarCV = async () => {
      try {
        const resultado = await cvService.obtenerCV();

        if (activo) {
          setCv(resultado);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo consultar el CV."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargarCV();

    return () => {
      activo = false;
    };
  }, []);

  const seleccionarArchivo = () => {
    inputRef.current?.click();
  };

  const cargarArchivo = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivo = event.target.files?.[0];

    if (!archivo) return;

    setError("");
    setMensaje("");

    if (
      !archivo.name.toLowerCase().endsWith(".pdf") ||
      archivo.type !== "application/pdf"
    ) {
      setError("Solo se permiten archivos PDF.");
      event.target.value = "";
      return;
    }

    if (
      archivo.size === 0 ||
      archivo.size > TAMANO_MAXIMO
    ) {
      setError(
        "El CV debe ser un PDF de máximo 5 MB y no estar vacío."
      );
      event.target.value = "";
      return;
    }

    setSubiendo(true);

    try {
      const teniaCV = cv !== null;
      const nuevoCV = await cvService.subirCV(archivo);

      setCv(nuevoCV);
      setMensaje(
        teniaCV
          ? "CV actualizado correctamente."
          : "CV cargado correctamente."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el CV."
      );
    } finally {
      setSubiendo(false);
      event.target.value = "";
    }
  };

  const visualizarCV = async () => {
    setError("");
    setProcesando(true);

    // Abrir la pestaña durante el clic para evitar
    // que el navegador bloquee la ventana emergente.
    const ventana = window.open("", "_blank");

    try {
      const blob = await cvService.visualizarCV();
      const url = URL.createObjectURL(blob);

      if (ventana && !ventana.closed) {
        ventana.location.href = url;
      } else {
        URL.revokeObjectURL(url);
        throw new Error(
          "El navegador bloqueó la ventana de visualización."
        );
      }

      // La URL permanece activa mientras la pestaña
      // necesite acceder al documento.
    } catch (err) {
      ventana?.close();
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo visualizar el CV."
      );
    } finally {
      setProcesando(false);
    }
  };

  const descargarCV = async () => {
    setError("");
    setProcesando(true);

    let url: string | null = null;
    let enlace: HTMLAnchorElement | null = null;

    try {
      const blob = await cvService.descargarCV();
      url = URL.createObjectURL(blob);

      enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = cv?.nombreOriginal || "CV.pdf";

      document.body.appendChild(enlace);
      enlace.click();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo descargar el CV."
      );
    } finally {
      enlace?.remove();

      if (url) {
        URL.revokeObjectURL(url);
      }

      setProcesando(false);
    }
  };

  const ocupado = subiendo || procesando;

  return (
    <section
      className="student-cv-section"
      aria-labelledby="student-cv-title"
    >
      <h2 id="student-cv-title">
        Gestión de mi CV
      </h2>

      <p className="private-page-description">
        Guarda tu currículum para utilizarlo en futuras
        postulaciones. Solo se permiten archivos PDF de
        hasta 5 MB.
      </p>

      {cargando ? (
        <p className="private-page-description">
          Consultando tu CV...
        </p>
      ) : (
        <>
          {cv ? (
            <div className="student-cv-file">
              <FileText size={26} aria-hidden="true" />

              <div>
                <strong>{cv.nombreOriginal}</strong>

                <p>
                  PDF ·{" "}
                  {(
                    Number(cv.tamanoBytes) / 1024
                  ).toFixed(1)}{" "}
                  KB · Vigente
                </p>
              </div>
            </div>
          ) : (
            <p className="private-page-description">
              Todavía no tienes un CV registrado.
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={cargarArchivo}
            style={{ display: "none" }}
            aria-label="Seleccionar CV en PDF"
          />

          <div className="private-actions">
            <button
              type="button"
              className="private-primary-button"
              onClick={seleccionarArchivo}
              disabled={ocupado}
            >
              {cv ? (
                <RefreshCw size={18} aria-hidden="true" />
              ) : (
                <Upload size={18} aria-hidden="true" />
              )}

              {subiendo
                ? "Guardando CV..."
                : cv
                  ? "Reemplazar CV"
                  : "Subir CV"}
            </button>

            {cv && (
              <>
                <button
                  type="button"
                  className="private-secondary-button"
                  onClick={visualizarCV}
                  disabled={ocupado}
                >
                  <Eye size={18} aria-hidden="true" />
                  Visualizar
                </button>

                <button
                  type="button"
                  className="private-secondary-button"
                  onClick={descargarCV}
                  disabled={ocupado}
                >
                  <Download size={18} aria-hidden="true" />
                  Descargar
                </button>
              </>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="private-error-message" role="alert">
          {error}
        </p>
      )}

      {mensaje && (
        <p role="status" aria-live="polite">
          {mensaje}
        </p>
      )}
    </section>
  );
};

export default StudentCVSection;
