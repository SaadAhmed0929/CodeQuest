const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/user');
const codeRoutes = require('./routes/code');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Simple mock user middleware since we are connecting DB/Auth later
app.use((req, res, next) => {
    // Simulated user ID from cookie or fallback to a dummy user (ID 1)
    const userId = req.cookies?.user_id || 1; 
    if (userId) {
        req.user = { id: userId };
    }
    next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/execute', codeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
