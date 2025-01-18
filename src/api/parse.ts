export async function handleFileUpload(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process file');
    }

    const data = await response.json();
    return { count: data.count || 0 };
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Failed to process file');
  }
}