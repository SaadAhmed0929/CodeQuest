import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();
export const MAX_ENERGY = 10;

const GUEST_USER = {
    id: null,
    username: 'Guest Explorer',
    profile_picture_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    total_points: 0,
    coins: 0,
    current_streak: 0,
    energy: MAX_ENERGY,
    streak_freeze_count: 0,
    completedLevels: [],
    role: 'guest',
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(GUEST_USER);
    const [loading, setLoading] = useState(false);

    // ── Login: username/password or guest ──────────────────────────
    const login = async (username, password, isRegister = false, isGuest = false) => {
        if (isGuest) {
            setUser({ ...GUEST_USER, username: 'Guest Explorer' });
            return;
        }

        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const res = await api.post(endpoint, { username, password });
            const u = res.data.user;
            setUser({
                id: u.id,
                username: u.username,
                profile_picture_url: u.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
                total_points: u.total_points || 0,
                coins: u.coins || 0,
                current_streak: u.current_streak || 0,
                energy: u.energy ?? MAX_ENERGY,
                streak_freeze_count: u.streak_freeze_count || 0,
                completedLevels: u.completedLevels || [],
                role: u.role || 'student',
                created_at: u.created_at,
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials';
            throw new Error(msg);
        }
    };

    // ── Logout ─────────────────────────────────────────────────────
    const logout = () => {
        setUser(GUEST_USER);
        window.location.href = '/';
    };

    // ── Energy ─────────────────────────────────────────────────────
    const deductEnergy = () =>
        setUser(prev => ({ ...prev, energy: Math.max(0, prev.energy - 1) }));

    // ── Rewards ────────────────────────────────────────────────────
    const awardLevel = (points, coins) =>
        setUser(prev => ({
            ...prev,
            total_points: prev.total_points + points,
            coins: prev.coins + coins,
            current_streak: prev.current_streak + 1,
        }));

    const markLevelComplete = (levelId) =>
        setUser(prev => ({
            ...prev,
            completedLevels: prev.completedLevels.includes(levelId)
                ? prev.completedLevels
                : [...prev.completedLevels, levelId],
        }));

    // ── Shop ───────────────────────────────────────────────────────
    const spendCoins = (amount) =>
        setUser(prev => {
            if (prev.coins < amount) return prev;
            return { ...prev, coins: prev.coins - amount };
        });

    const refillEnergy = () =>
        setUser(prev => ({ ...prev, energy: MAX_ENERGY }));

    const addStreakFreeze = () =>
        setUser(prev => ({ ...prev, streak_freeze_count: (prev.streak_freeze_count || 0) + 1 }));

    const fetchUser = async () => {};

    return (
        <AuthContext.Provider value={{
            user, loading, login, logout, fetchUser,
            deductEnergy, awardLevel, markLevelComplete,
            spendCoins, refillEnergy, addStreakFreeze,
            MAX_ENERGY,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
