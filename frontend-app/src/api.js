const API_URL = import.meta.env.VITE_API_URL;

export async function fetchBlocks() {
  const response = await fetch(`${API_URL}/blocks/`);
  if (!response.ok) throw new Error("Failed to fetch blocks");
  return response.json();
}

export async function fetchApartments() {
  const response = await fetch(`${API_URL}/apartments/`);
  if (!response.ok) throw new Error("Failed to fetch apartments");
  return response.json();
}
