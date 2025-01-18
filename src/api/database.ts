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
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const { handleFileUpload } = await import('./parse');
    return await handleFileUpload(file);
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}