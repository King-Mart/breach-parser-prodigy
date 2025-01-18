import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function fetchDatabaseRows(): Promise<any[]> {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.error('Supabase is not properly configured. Please set up your environment variables.');
      return [];
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .limit(100);

    if (error) {
      console.error('Error fetching database rows:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching database rows:', error);
    return [];
  }
}

export async function uploadFile(file: File): Promise<{ count: number }> {
  if (!file) {
    throw new Error('No file provided');
  }

  // Check if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not properly configured. Please set up your environment variables.');
  }

  try {
    // Upload file to Supabase storage
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('breach-data')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    // Call the Edge Function to process the file
    const { data: processedData, error: processError } = await supabase.functions
      .invoke('process-breach-data', {
        body: { fileName },
      });

    if (processError) {
      throw processError;
    }

    return { count: processedData?.count || 0 };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}