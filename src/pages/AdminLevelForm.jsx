import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import Editor from '@monaco-editor/react';

const AdminLevelForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        order_num: '', // Empty means latest sequence
        points_value: 10,
        coins_value: 5,
        concept: '',
        task: '',
        expected_output: '',
        initial_code: '# Write your code here\n',
        test_cases: []
    });

    useEffect(() => {
        if (!localStorage.getItem('isAdmin')) {
            navigate('/admin');
            return;
        }

        if (isEditMode) {
            fetchLevelData();
        }
    }, [id, navigate]);

    const fetchLevelData = async () => {
        try {
            const res = await api.get(`/levels`);
            const level = res.data.find(l => l.level_id === parseInt(id));
            if (level) {
                setFormData({
                    title: level.title || '',
                    order_num: level.order_num || '',
                    points_value: level.points_value || 10,
                    coins_value: level.coins_value || 5,
                    concept: level.content?.concept || '',
                    task: level.content?.task || '',
                    expected_output: level.content?.expected_output || '',
                    initial_code: level.content?.initial_code || '',
                    test_cases: level.content?.test_cases || []
                });
            } else {
                setError('Level not found');
            }
        } catch (err) {
            setError('Failed to fetch level data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            test_cases: [...prev.test_cases, { id: Date.now(), label: `Test Case ${prev.test_cases.length + 1}`, hidden_code: '', expected_output: '' }]
        }));
    };

    const removeTestCase = (testId) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.filter(tc => tc.id !== testId)
        }));
    };

    const updateTestCase = (testId, field, value) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.map(tc => tc.id === testId ? { ...tc, [field]: value } : tc)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/admin/levels/${id}`, formData);
            } else {
                await api.post('/admin/levels', formData);
            }
            navigate('/admin/dashboard');
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                localStorage.removeItem('isAdmin');
                alert("Your session expired (usually because the backend restarted). Please log in again.");
                navigate('/admin');
            } else {
                setError('Failed to save level: ' + (err.response?.data?.error || err.message));
                setSaving(false);
            }
        }
    };

    if (loading) return <div className="text-center mt-20 text-white">Loading level data...</div>;

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center mb-6">
                    <Link to="/admin/dashboard" className="text-gray-400 hover:text-white mr-4 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        {isEditMode ? 'Edit Level' : 'Create New Level'}
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Level Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Variables and Data Types"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-400 mb-1">Sequence # <span className="text-gray-500 text-xs">(Optional)</span></label>
                                <input
                                    type="number"
                                    name="order_num"
                                    min="1"
                                    value={formData.order_num}
                                    onChange={handleChange}
                                    placeholder="End of list"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Points Reward</label>
                                <input
                                    type="number"
                                    name="points_value"
                                    required
                                    min="0"
                                    value={formData.points_value}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Coins Reward</label>
                                <input
                                    type="number"
                                    name="coins_value"
                                    required
                                    min="0"
                                    value={formData.coins_value}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <hr className="border-gray-700 !my-8" />
                        
                        <div className="space-y-8">
                            <div>
                                <RichTextEditor
                                    label="Learning Text (Shown under level topic heading)"
                                    name="concept"
                                    value={formData.concept}
                                    onChange={handleChange}
                                    placeholder="Explain the concept here using formatting..."
                                    rows={8}
                                />
                            </div>

                            <div>
                                <RichTextEditor
                                    label="Challenge Text (What should the user do?)"
                                    name="task"
                                    value={formData.task}
                                    onChange={handleChange}
                                    placeholder="Write a program that... (bold important terms)"
                                    rows={6}
                                />
                            </div>
                        </div>

                         {/* DYNAMIC LEETCODE STYLE TEST CASES */}
                        <hr className="border-gray-700 !my-8" />
                        
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-400">Dynamic Test Cases (Validation Engine)</h3>
                                    <p className="text-sm text-gray-400">Add test cases to evaluate the user's code against multiple sets of pre-defined variables.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addTestCase}
                                    className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                                </button>
                            </div>

                            {formData.test_cases.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 bg-gray-800 rounded border border-dashed border-gray-600">
                                    No test cases. The platform will fall back to using the basic "Expected Output" below.
                                </div>
                            ) : (
                                <div className="space-y-6 flex flex-col-reverse">
                                    {formData.test_cases.map((testCase, index) => (
                                        <div key={testCase.id} className="bg-gray-800 border border-gray-600 rounded-md p-4 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeTestCase(testCase.id)}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            
                                            <div className="mb-4 pr-10">
                                                <label className="block text-sm font-medium text-blue-300 mb-1">Tab Name (e.g. "Test Case 1: a=10, b=20")</label>
                                                <input
                                                    type="text"
                                                    value={testCase.label}
                                                    onChange={(e) => updateTestCase(testCase.id, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-purple-400 mb-1">Prepended Test Variables (Setup Code)</label>
                                                    <p className="text-xs text-gray-500 mb-1">This code is injected dynamically at the TOP of the user's script.</p>
                                                    <div className="h-40 rounded-md overflow-hidden border border-gray-700">
                                                        <Editor
                                                            height="100%"
                                                            language="python"
                                                            value={testCase.hidden_code}
                                                            onChange={(val) => updateTestCase(testCase.id, 'hidden_code', val)}
                                                            theme="vs-dark"
                                                            options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-green-400 mb-1">Exact Expected Output</label>
                                                    <p className="text-xs text-gray-500 mb-1">Case-sensitive strict matching</p>
                                                    <div className="h-40 rounded-md overflow-hidden border border-gray-700">
                                                        <Editor
                                                            height="100%"
                                                            language="plaintext"
                                                            value={testCase.expected_output}
                                                            onChange={(val) => updateTestCase(testCase.id, 'expected_output', val)}
                                                            theme="vs-dark"
                                                            options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* BASIC FALLBACKS */}
                        <hr className="border-gray-700 !my-8" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-green-400 mb-1">
                                    Fallback Expected Output <span className="text-gray-500">(If no test cases)</span>
                                </label>
                                <div className="h-48 rounded-md overflow-hidden border border-gray-600 relative group">
                                    <Editor
                                        height="100%"
                                        language="plaintext"
                                        value={formData.expected_output}
                                        onChange={(val) => handleChange({ target: { name: 'expected_output', value: val }})}
                                        theme="vs-dark"
                                        options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-1">
                                    Initial Starting Code <span className="text-gray-500">(Optional)</span>
                                </label>
                                <div className="h-48 rounded-md overflow-hidden border border-gray-600 relative group">
                                    <Editor
                                        height="100%"
                                        language="python"
                                        value={formData.initial_code}
                                        onChange={(val) => handleChange({ target: { name: 'initial_code', value: val }})}
                                        theme="vs-dark"
                                        options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <Link 
                                to="/admin/dashboard"
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-lg shadow-blue-900/50 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {saving ? 'Saving...' : 'Save Level'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminLevelForm;
