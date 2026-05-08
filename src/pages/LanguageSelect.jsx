import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Code, Sparkles, CheckCircle2 } from 'lucide-react';

const LanguageSelect = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const languages = [
        {
            id: 'python',
            name: 'Python',
            description: 'Perfect for beginners! Learn programming fundamentals with clean, readable syntax.',
            icon: '🐍',
            difficulty: 'Beginner Friendly',
            features: ['Easy to Learn', 'Versatile', 'High Demand'],
            color: 'from-blue-500 to-cyan-500'
        }
        // Future languages can be added here:
        // { id: 'javascript', name: 'JavaScript', ... }
        // { id: 'java', name: 'Java', ... }
    ];

    const handleSelectLanguage = (languageId) => {
        setSelectedLanguage(languageId);
    };

    const handleContinue = () => {
        if (selectedLanguage) {
            // Store selection in localStorage for now
            localStorage.setItem('selectedLanguage', selectedLanguage);
            // Redirect to dashboard
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
                        <h1 className="text-4xl font-bold text-gray-900">Choose Your Journey</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the programming language you want to master. Don't worry - you can always learn more languages later!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {languages.map((language) => (
                        <div
                            key={language.id}
                            onClick={() => handleSelectLanguage(language.id)}
                            className={`
                relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 border-4
                ${selectedLanguage === language.id
                                    ? 'border-purple-500 shadow-2xl scale-105'
                                    : 'border-transparent hover:border-purple-200 hover:shadow-xl'
                                }
              `}
                        >
                            {/* Selection Indicator */}
                            {selectedLanguage === language.id && (
                                <div className="absolute top-4 right-4">
                                    <CheckCircle2 className="w-8 h-8 text-purple-600 animate-bounce" />
                                </div>
                            )}

                            {/* Language Icon */}
                            <div className={`
                w-20 h-20 rounded-full bg-gradient-to-br ${language.color} 
                flex items-center justify-center text-4xl mb-4 mx-auto
                shadow-lg
              `}>
                                {language.icon}
                            </div>

                            {/* Language Name */}
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                {language.name}
                            </h2>

                            {/* Difficulty Badge */}
                            <div className="flex justify-center mb-4">
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                    {language.difficulty}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-center mb-4 text-sm">
                                {language.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-2">
                                {language.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-700">
                                        <Code className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Coming Soon Card */}
                    <div className="relative bg-gray-50 rounded-2xl shadow-lg p-6 border-4 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-6xl mb-4 opacity-50">🚀</div>
                        <h3 className="text-xl font-bold text-gray-500 mb-2">More Languages Coming Soon!</h3>
                        <p className="text-gray-400 text-center text-sm">
                            JavaScript, Java, C++ and more...
                        </p>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedLanguage}
                        className={`
              px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300
              ${selectedLanguage
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-1'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
            `}
                    >
                        {selectedLanguage ? 'Start Learning!' : 'Select a Language to Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelect;
