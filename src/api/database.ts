export async function fetchDatabaseRows(): Promise<any[]> {
  try {
    const response = await fetch('/api/database/rows');
    if (!response.ok) {
      throw new Error('Failed to fetch database rows');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching database rows:', error);
    return [];
  }
}

export async function uploadFile(file: File): Promise<{ count: number }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/parse', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}