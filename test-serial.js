// Quick test of serial generator
const crypto = require('crypto');

function generateChecksum(data) {
  const combined = data + "PhaseGarden";
  const md5Hash = crypto.createHash('md5').update(combined).digest('hex');
  return md5Hash.substring(0, 4).toUpperCase();
}

function generateRandomPart(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSerial() {
  const part1 = generateRandomPart(4);
  const part2 = generateRandomPart(4);
  const part3 = generateRandomPart(4);
  const data = part1 + part2 + part3;
  const part4 = generateChecksum(data);
  return `${part1}-${part2}-${part3}-${part4}`;
}

console.log('Testing serial generator:');
for (let i = 0; i < 5; i++) {
  console.log(generateSerial());
}
