import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Secure checking
    useEffect(() => {
        if (!localStorage.getItem('isAdmin')) {
            navigate('/admin');
            return;
        }
        fetchLevels();
    }, [navigate]);

    const fetchLevels = async () => {
        try {
            const res = await api.get('/levels');
            setLevels(res.data);
        } catch (err) {
            console.error("Failed to load levels", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you absolutely sure you want to delete ${title}? This cannot be undone.`)) {
            try {
                await api.delete(`/admin/levels/${id}`);
                // Remove from state without re-fetching
                setLevels(levels.filter(l => l.level_id !== id));
            } catch (err) {
                alert("Failed to delete level: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/admin/logout');
            localStorage.removeItem('isAdmin');
            navigate('/admin');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (loading) return <div className="text-center mt-20 text-white">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
            <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
                <div className="font-bold text-xl text-white">CodeQuest Admin Portal</div>
                <div className="flex gap-4">
                    <Link to="/" className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium">
                        View Live Site
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center text-red-400 hover:text-red-300 px-3 py-2 text-sm font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Level Management</h1>
                    
                    <Link 
                        to="/admin/level/new" 
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/50"
                    >
                        <Plus className="w-5 h-5 mr-1" /> Add New Level
                    </Link>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Points</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {levels.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No levels found. Create your first level!
                                    </td>
                                </tr>
                            ) : levels.map((level) => (
                                <tr key={level.level_id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-mono text-gray-400">#{level.level_id}</td>
                                    <td className="p-4 font-medium text-gray-200">{level.title}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs font-bold border border-blue-800/50">
                                            {level.points_value} pts
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-3">
                                        <Link 
                                            to={`/admin/level/edit/${level.level_id}`} 
                                            className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                                            title="Edit Level"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(level.level_id, level.title)}
                                            className="inline-flex items-center justify-center bg-red-900/30 hover:bg-red-800/50 text-red-500 hover:text-red-400 border border-red-900/50 p-2 rounded-md transition-colors"
                                            title="Delete Level"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
