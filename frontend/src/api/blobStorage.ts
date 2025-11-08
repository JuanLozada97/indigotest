type UploadResponse = {
  url: string;
};

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5202"}/api/blob/upload`,
    {
      method: "POST",
      headers: {
        // No establecer Content-Type, el navegador lo hará automáticamente con el boundary
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || `Error subiendo imagen: ${response.status}`);
  }

  const result = await response.json() as UploadResponse;
  return result.url;
}

function getAuthToken(): string | null {
  const stored = localStorage.getItem("indigotest_auth");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as { token: string };
    return parsed.token;
  } catch {
    return null;
  }
}
