const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Username and password are required.' });

    try {
        // Check if username taken
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0)
            return res.status(409).json({ message: 'Username already taken. Choose another.' });

        // Insert (password stored as plaintext for now — hash in production)
        const [result] = await db.query(
            'INSERT INTO users (username, password_hash, total_points, coins, energy, current_streak) VALUES (?, ?, 0, 0, 10, 0)',
            [username, password]
        );

        const userId = result.insertId;
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const u = rows[0];

        res.json({
            user: {
                id: u.id,
                username: u.username,
                total_points: u.total_points || 0,
                coins: u.coins || 0,
                current_streak: u.current_streak || 0,
                energy: u.energy ?? 10,
                streak_freeze_count: u.streak_freeze_count || 0,
                completedLevels: [],
                role: u.role || 'student',
                created_at: u.created_at,
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
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

        // Fetch completed levels
        let completedLevels = [];
        try {
            const [prog] = await db.query(
                'SELECT level_id FROM user_progress WHERE user_id = ? AND completed = 1',
                [u.id]
            );
            completedLevels = prog.map(r => r.level_id);
        } catch (_) {}

        res.json({
            user: {
                id: u.id,
                username: u.username,
                profile_picture_url: u.profile_picture_url || null,
                total_points: u.total_points || 0,
                coins: u.coins || 0,
                current_streak: u.current_streak || 0,
                energy: u.energy ?? 10,
                streak_freeze_count: u.streak_freeze_count || 0,
                completedLevels,
                role: u.role || 'student',
                created_at: u.created_at,
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
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
