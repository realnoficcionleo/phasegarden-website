import crypto from 'crypto';

/**
 * PhaseGarden Serial Generator
 * Port of generate_serial.py to TypeScript
 *
 * Serial format: XXXX-XXXX-XXXX-XXXX
 * Last 4 characters are MD5 checksum of first 12 + "PhaseGarden"
 */

function generateChecksum(data: string): string {
  const combined = data + "PhaseGarden";
  const md5Hash = crypto.createHash('md5').update(combined).digest('hex');
  return md5Hash.substring(0, 4).toUpperCase();
}

function generateRandomPart(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a valid PhaseGarden serial key
 * @returns Serial in format XXXX-XXXX-XXXX-XXXX
 */
export function generateSerial(): string {
  // Generate 12 random alphanumeric characters (3 groups of 4)
  const part1 = generateRandomPart(4);
  const part2 = generateRandomPart(4);
  const part3 = generateRandomPart(4);

  // Calculate checksum for validation
  const data = part1 + part2 + part3;
  const part4 = generateChecksum(data);

  // Format as XXXX-XXXX-XXXX-XXXX
  return `${part1}-${part2}-${part3}-${part4}`;
}

/**
 * Validate a PhaseGarden serial key
 * @param serial - Serial to validate (with or without dashes)
 * @returns true if valid, false otherwise
 */
export function validateSerial(serial: string): boolean {
  // Remove spaces and dashes
  const cleanSerial = serial.replace(/[\s-]/g, '').toUpperCase();

  // Must be exactly 16 characters
  if (cleanSerial.length !== 16) {
    return false;
  }

  // All characters must be alphanumeric
  if (!/^[A-Z0-9]+$/.test(cleanSerial)) {
    return false;
  }

  // Split into parts
  const part1 = cleanSerial.substring(0, 4);
  const part2 = cleanSerial.substring(4, 8);
  const part3 = cleanSerial.substring(8, 12);
  const part4 = cleanSerial.substring(12, 16);

  // Verify checksum
  const data = part1 + part2 + part3;
  const expectedChecksum = generateChecksum(data);

  return part4 === expectedChecksum;
}

/**
 * Format a serial with dashes
 * @param serial - Serial without dashes
 * @returns Formatted serial XXXX-XXXX-XXXX-XXXX
 */
export function formatSerial(serial: string): string {
  const clean = serial.replace(/[\s-]/g, '');
  return `${clean.substring(0, 4)}-${clean.substring(4, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}`;
}

/**
 * Generate multiple serials
 * @param count - Number of serials to generate
 * @returns Array of unique serials
 */
export function generateSerials(count: number): string[] {
  const serials = new Set<string>();
  while (serials.size < count) {
    serials.add(generateSerial());
  }
  return Array.from(serials);
}
