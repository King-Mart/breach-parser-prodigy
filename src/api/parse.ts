import { parse_data } from '../../parser.py';
import { insert_data_in_batches } from '../../sql_updater.py';

export async function handleFileUpload(file: File) {
  try {
    // Save the uploaded file temporarily
    const tempFilePath = `/tmp/${file.name}`;
    await Bun.write(tempFilePath, file);

    // Parse the file using the Python script
    const result = await parse_data(tempFilePath);

    // Update database with parsed results
    const db_config = {
      host: "localhost",
      username: "root",
      password: "root",
      database: "deepcode",
    };
    
    const table_name = "parsed_urls";
    await insert_data_in_batches(result, db_config, table_name);

    return { count: result.length };
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Failed to process file');
  }
}