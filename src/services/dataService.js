const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

function ensureDataShape(data) {
  if (!data || typeof data !== 'object') {
    return { users: [], connections: [], mappings: [] };
  }
  return {
    users: Array.isArray(data.users) ? data.users : [],
    connections: Array.isArray(data.connections) ? data.connections : [],
    mappings: Array.isArray(data.mappings) ? data.mappings : []
  };
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { users: [], connections: [], mappings: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return ensureDataShape(JSON.parse(raw));
  } catch (e) {
    return { users: [], connections: [], mappings: [] };
  }
}

function writeData(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(ensureDataShape(data), null, 2));
}

module.exports = {
  readData,
  writeData,
  DATA_FILE
};
