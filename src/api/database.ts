export async function fetchDatabaseRow(): Promise<any> {
  try {
    const response = await fetch('/api/database/row');
    if (!response.ok) {
      throw new Error('Failed to fetch database row');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching database row:', error);
    return null;
  }
}