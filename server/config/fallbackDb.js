const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'users.json');

function readDb() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading JSON DB:', e);
    }
    return { users: [], progress: [] };
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Error writing JSON DB:', e);
    }
}

module.exports = { readDb, writeDb };
