import fs from 'node:fs/promises';

/**
 * Saves data to a JSON file with pretty formatting.
 *
 * @param filename - The path to the file to save
 * @param data - The data to save (will be JSON.stringify'd)
 * @param itemName - Optional name for the items being saved (used in console output)
 * @returns Promise that resolves when the file is written
 * @example
 * await saveJSON('data.json', [{ id: 1, name: 'test' }], 'users');
 * // Saves data and logs: "Saved 1 users to data.json"
 */
export async function saveJSON(
  filename: string,
  data: any,
  itemName: string = 'items'
): Promise<void> {
  // Ensure the directory exists before writing the file
  const dir = filename.substring(0, filename.lastIndexOf('/'));
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
  const count = Array.isArray(data) ? data.length : 'data';
  console.log(`Saved ${count} ${itemName} to ${filename}`);
}
