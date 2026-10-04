const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api";

const TOKEN_KEY = "sigab_token";

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export const obtenerToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const guardarToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const eliminarToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const obtenerMensajeError = async (
  response: Response
): Promise<string> => {
  try {
    const data = await response.json();

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  } catch {
    // Si la respuesta no contiene JSON válido,
    // se utilizará un mensaje genérico.
  }

  return "Ocurrió un error al procesar la solicitud";
};

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    auth = false,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  if (auth) {
    const token = obtenerToken();

    if (token) {
      requestHeaders.set(
        "Authorization",
        `Bearer ${token}`
      );
    }
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
    }
  );

  if (auth) {
    const nuevoToken =
      response.headers.get("X-Access-Token");

    if (nuevoToken) {
      guardarToken(nuevoToken);
    }
  }

  if (!response.ok) {
    if (auth && response.status === 401) {
      eliminarToken();

      window.dispatchEvent(
        new Event("sigab:sesion-expirada")
      );
    }

    const mensaje =
      await obtenerMensajeError(response);

    throw new Error(mensaje);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get("content-type");

  if (
    !contentType?.includes("application/json")
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};