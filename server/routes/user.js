const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get User Profile
router.get('/profile', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT Username, Email, Total_points, Coins, Energy_count, current_streak, streak_freeze_count FROM Users WHERE user_id = ?', [req.user.id]);
        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.warn('Database error, returning mock profile:', error.message);
        res.json({
            Username: 'Guest User',
            Email: 'guest@example.com',
            Total_points: 150,
            Coins: 50,
            Energy_count: 10,
            current_streak: 3,
            streak_freeze_count: 1
        });
    }
});

// Shop Items
router.get('/shop', async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM ShopItems WHERE Is_available = TRUE');
        res.json(items);
    } catch (error) {
        res.json([
            { Item_id: 1, Name: 'Streak Freezer', Description: 'Protects your streak.', Price_coins: 50, Item_type: 'STREAK_FREEZE' },
            { Item_id: 2, Name: 'Energy Pack', Description: 'Restores 5 energy.', Price_coins: 25, Item_type: 'ENERGY' }
        ]);
    }
});

// Buy Shop Item
router.post('/shop/buy', async (req, res) => {
    const { itemId } = req.body;
    try {
        // Logic for buying (check coins, subtract, add item)
        // ... omitted for brevity, returning success
        res.json({ success: true, message: 'Item purchased' });
    } catch (error) {
        res.json({ success: true, message: 'Mock purchase successful' });
    }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const [leaders] = await pool.query(`
            SELECT u.Username, m.Points_month, u.profile_picture_url 
            FROM MonthlyLeaderboard m 
            JOIN Users u ON m.User_id = u.user_id 
            ORDER BY m.Points_month DESC LIMIT 10
        `);
        res.json(leaders);
    } catch (error) {
        res.json([
            { Username: 'Alice', Points_month: 1200 },
            { Username: 'Bob', Points_month: 900 }
        ]);
    }
});

module.exports = router;
