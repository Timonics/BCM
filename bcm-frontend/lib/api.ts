import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}

export interface BackendCallOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  data?: unknown;
  params?: Record<string, any>;
  token?: string; // Optional token for authenticated requests
  headers?: Record<string, string>;
}

export async function callBackend<T = any>(
  options: BackendCallOptions,
): Promise<{
  success: boolean;
  data?: T;
  message?: string;
  status: number;
  errors?: any;
}> {
  const { method, path, data, params, token, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add token to Authorization header if provided
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    console.log(`📤 Calling backend: ${method} ${BACKEND_URL}${path}`);

    const response = await axios({
      method,
      url: `${BACKEND_URL}${path}`,
      data,
      params,
      headers: requestHeaders,
      timeout: 15000,
    });

    console.log(`📥 Backend response:`, response.data);

    return {
      success: true,
      data: response.data.data || response.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error(
      `❌ Backend API Error [${path}]:`,
      error.response?.data || error.message,
    );

    return {
      success: false,
      message: error.response?.data?.message || "Backend request failed",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
}

export const api = {
  get: <T = any>(
    path: string,
    options?: Omit<BackendCallOptions, "method" | "path">,
  ) => callBackend<T>({ method: "GET", path, ...options }),

  post: <T = any>(
    path: string,
    data?: unknown,
    options?: Omit<BackendCallOptions, "method" | "path" | "data">,
  ) => callBackend<T>({ method: "POST", path, data, ...options }),

  put: <T = any>(
    path: string,
    data?: unknown,
    options?: Omit<BackendCallOptions, "method" | "path" | "data">,
  ) => callBackend<T>({ method: "PUT", path, data, ...options }),

  patch: <T = any>(
    path: string,
    data?: unknown,
    options?: Omit<BackendCallOptions, "method" | "path" | "data">,
  ) => callBackend<T>({ method: "PATCH", path, data, ...options }),

  delete: <T = any>(
    path: string,
    options?: Omit<BackendCallOptions, "method" | "path">,
  ) => callBackend<T>({ method: "DELETE", path, ...options }),
};
