export async function fetchDatabaseRows(): Promise<any[]> {
  try {
    const response = await fetch('/api/database/rows');
    if (!response.ok) {
      throw new Error('Failed to fetch database rows');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching database rows:', error);
    return [];
  }
}