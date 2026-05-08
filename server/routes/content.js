const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const part1 = require('../data/curriculum_part1');
const part2 = require('../data/curriculum_part2');
const MOCK_CURRICULUM = [...part1, ...part2];

// Build a flat level lookup map from mock
const MOCK_LEVEL_MAP = {};
for (const ch of MOCK_CURRICULUM) {
    for (const lv of ch.levels) {
        MOCK_LEVEL_MAP[lv.level_id] = lv;
    }
}

// GET /api/chapters
router.get('/chapters', async (req, res) => {
    try {
        const [chapters] = await pool.query('SELECT * FROM Chapters ORDER BY order_num ASC');
        const [levels] = await pool.query('SELECT * FROM Levels ORDER BY order_num ASC');
        // Only use DB if it has a full curriculum (7+ chapters)
        if (chapters.length >= 7) {
            const data = chapters.map(c => ({
                ...c,
                levels: levels.filter(l => l.chapter_id === c.chapter_id)
            }));
            return res.json(data);
        }
        throw new Error('DB curriculum incomplete');
    } catch {
        res.json(MOCK_CURRICULUM);
    }
});

// GET /api/levels/:id
router.get('/levels/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [rows] = await pool.query('SELECT * FROM Levels WHERE level_id = ?', [id]);
        if (rows.length > 0 && rows[0].content) return res.json(rows[0]);
        throw new Error('Not in DB');
    } catch {
        const found = MOCK_LEVEL_MAP[id];
        if (found) return res.json(found);
        res.status(404).json({ error: 'Level not found' });
    }
});

// POST /api/levels/:id/submit
router.post('/levels/:id/submit', async (req, res) => {
    const id = parseInt(req.params.id);
    const mockLevel = MOCK_LEVEL_MAP[id];
    const pts = mockLevel?.points_value || 10;
    const coins = mockLevel?.coins_value || 5;
    try {
        const userId = req.user?.id;
        if (userId) {
            await pool.query('INSERT IGNORE INTO UserProgress (User_id, Level_id) VALUES (?,?)', [userId, id]);
            await pool.query('UPDATE Users SET Total_points=Total_points+?, Coins=Coins+? WHERE user_id=?', [pts, coins, userId]);
        }
    } catch { /* mock mode */ }
    res.json({ success: true, message: '🎉 Level Completed!', points: pts, coins, current_streak: 1, streak_updated: true });
});

module.exports = router;
