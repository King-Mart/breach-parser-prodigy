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

  // First, get a pre-signed URL for file upload
  const uploadUrlResponse = await fetch('/api/upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  });

  if (!uploadUrlResponse.ok) {
    throw new Error('Failed to get upload URL');
  }

  const { uploadUrl, fileKey } = await uploadUrlResponse.json();

  // Upload the file to the pre-signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  // Trigger file processing
  const processResponse = await fetch('/api/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileKey }),
  });

  if (!processResponse.ok) {
    const errorData = await processResponse.json().catch(() => ({ message: 'Failed to process file' }));
    throw new Error(errorData.message || 'Failed to process file');
  }

  return processResponse.json();
}