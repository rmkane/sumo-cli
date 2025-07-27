import fs from 'node:fs/promises';

export async function saveJSON(
  filename: string,
  data: any,
  itemName: string = 'items'
): Promise<void> {
  await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
  const count = Array.isArray(data) ? data.length : 'data';
  console.log(`Saved ${count} ${itemName} to ${filename}`);
}
