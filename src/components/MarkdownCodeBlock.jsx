import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const MarkdownCodeBlock = ({ node, inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);

    // ReactMarkdown passes whether the code block is inline (` var `) or multiline
    if (inline) {
        return (
            <code className="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
            </code>
        );
    }

    // Extract language from className (e.g. "language-python")
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';

    // Clean string by removing the final newline
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-6 rounded-lg overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-xl !mt-2">
            {/* Context/Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                <span className="text-xs font-semibold text-gray-400 capitalize font-sans tracking-wide">
                    {language}
                </span>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
                    title="Copy code"
                >
                    {copied ? (
                        <><Check className="w-4 h-4 text-green-500" /> <span className="text-green-500">Copied!</span></>
                    ) : (
                        <><Copy className="w-4 h-4" /> Copy code</>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="overflow-x-auto p-4">
                <pre className="!bg-transparent !p-0 !m-0">
                    <code className="text-gray-300 font-mono text-sm leading-relaxed" {...props}>
                        {codeString}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default MarkdownCodeBlock;
