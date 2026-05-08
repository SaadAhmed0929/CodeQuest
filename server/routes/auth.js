const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { readDb, writeDb } = require('../config/fallbackDb');

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required.' });

    try {
        // Try MySQL first
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0)
            return res.status(409).json({ message: 'Username already taken. Choose another.' });

        const [result] = await db.query(
            'INSERT INTO users (username, password_hash, total_points, coins, energy, current_streak) VALUES (?, ?, 0, 0, 10, 0)',
            [username, password]
        );

        const userId = result.insertId;
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const u = rows[0];

        res.json({
            user: {
                id: u.id, username: u.username, total_points: u.total_points || 0,
                coins: u.coins || 0, current_streak: u.current_streak || 0, energy: u.energy ?? 10,
                streak_freeze_count: u.streak_freeze_count || 0, completedLevels: [],
                role: u.role || 'student', created_at: u.created_at,
            }
        });
    } catch (err) {
        // MySQL failed, use JSON fallback
        console.warn('MySQL unavailable, using JSON fallback for Register');
        const data = readDb();
        if (data.users.find(u => u.username === username)) {
            return res.status(409).json({ message: 'Username already taken. Choose another.' });
        }
        const newUser = {
            id: Date.now(), username, password_hash: password,
            total_points: 0, coins: 0, energy: 10, current_streak: 0,
            streak_freeze_count: 0, role: 'student', created_at: new Date().toISOString()
        };
        data.users.push(newUser);
        writeDb(data);

        res.json({
            user: { ...newUser, completedLevels: [] }
        });
    }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required.' });

    try {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password_hash = ?',
            [username, password]
        );

        if (rows.length === 0)
            return res.status(401).json({ message: 'Wrong username or password.' });

        const u = rows[0];
        let completedLevels = [];
        try {
            const [prog] = await db.query('SELECT level_id FROM user_progress WHERE user_id = ? AND completed = 1', [u.id]);
            completedLevels = prog.map(r => r.level_id);
        } catch (_) {}

        res.json({
            user: {
                id: u.id, username: u.username, profile_picture_url: u.profile_picture_url || null,
                total_points: u.total_points || 0, coins: u.coins || 0, current_streak: u.current_streak || 0,
                energy: u.energy ?? 10, streak_freeze_count: u.streak_freeze_count || 0,
                completedLevels, role: u.role || 'student', created_at: u.created_at,
            }
        });
    } catch (err) {
        console.warn('MySQL unavailable, using JSON fallback for Login');
        const data = readDb();
        const u = data.users.find(x => x.username === username && x.password_hash === password);
        
        if (!u) {
            return res.status(401).json({ message: 'Wrong username or password.' });
        }

        const completedLevels = data.progress
            ?.filter(p => p.user_id === u.id && p.completed)
            .map(p => p.level_id) || [];

        res.json({
            user: { ...u, completedLevels }
        });
    }
});

// ── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    res.clearCookie('user_id');
    res.json({ message: 'Logged out' });
});

// ── Me (session check) ────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
    res.status(401).json({ message: 'Not authenticated' });
});

// ── Google OAuth stub ─────────────────────────────────────────────────────────
router.post('/google', (req, res) => {
    res.status(501).json({ message: 'Google OAuth not yet configured.' });
});

module.exports = router;
