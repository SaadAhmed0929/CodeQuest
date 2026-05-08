import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Bold, Italic, Heading1, Heading2, Heading3, List, Code, Eye, EyeOff, SquareTerminal, AArrowUp, AArrowDown } from 'lucide-react';
import MarkdownCodeBlock from './MarkdownCodeBlock';

const RichTextEditor = ({ label, name, value, onChange, placeholder, rows = 5 }) => {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef(null);
    const cursorRef = useRef(null);

    // Securely apply selection after React completes the value state update render
    useEffect(() => {
        if (cursorRef.current && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(cursorRef.current.start, cursorRef.current.end);
            cursorRef.current = null; // Clear cursor command
        }
    }, [value]);

    const insertFormatting = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value || '';

        const selectedText = text.substring(start, end);
        const replacement = suffix === '' 
            ? `${prefix} ${selectedText}` 
            : `${prefix}${selectedText || 'text'}${suffix}`;

        const newValue = text.substring(0, start) + replacement + text.substring(end);

        // Calculate where the cursor SHOULD be after React finishes updating the UI
        let newStart, newEnd;
        if (selectedText === '') {
            newStart = start + prefix.length;
            newEnd = start + prefix.length + (suffix === '' ? 0 : 4); // highlighting 'text' placeholder
        } else {
            // Keep the exact newly formatted block selected!
            newStart = start;
            newEnd = start + replacement.length;
        }

        cursorRef.current = { start: newStart, end: newEnd };

        // Notify parent Form using synthetic event object
        onChange({ target: { name, value: newValue } });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 gap-1 bg-gray-800 px-2 py-1 rounded"
                >
                    {showPreview ? <><EyeOff className="w-3 h-3" /> Hide Preview</> : <><Eye className="w-3 h-3" /> Live Preview</>}
                </button>
            </div>

            <div className={`border rounded-md overflow-hidden flex flex-col ${showPreview ? 'border-blue-500' : 'border-gray-600'}`}>
                
                {/* TOOLBAR */}
                <div className="bg-gray-800 border-b border-gray-700 p-2 flex gap-2 flex-wrap">
                    <button type="button" onClick={() => insertFormatting('**', '**')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bold">
                        <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('_', '_')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Italic">
                        <Italic className="w-4 h-4" />
                    </button>
                    
                    <div className="w-px bg-gray-600 mx-1"></div>
                    
                    {/* Headings */}
                    <button type="button" onClick={() => insertFormatting('# ')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 1">
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('## ')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 2">
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('### ')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Heading 3">
                        <Heading3 className="w-4 h-4" />
                    </button>

                    <div className="w-px bg-gray-600 mx-1"></div>

                    {/* Sizing (HTML) */}
                    <button type="button" onClick={() => insertFormatting('<span style="font-size: 1.25em;">', '</span>')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Increase Size">
                        <AArrowUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('<span style="font-size: 0.8em;">', '</span>')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Decrease Size">
                        <AArrowDown className="w-4 h-4" />
                    </button>

                    <div className="w-px bg-gray-600 mx-1"></div>

                    <button type="button" onClick={() => insertFormatting('- ')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Bullet List">
                        <List className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('`', '`')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Inline Code">
                        <Code className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => insertFormatting('\n```python\n', '\n```\n')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Block Code">
                        <SquareTerminal className="w-4 h-4" />
                    </button>
                </div>

                {/* DUAL PANE EDITOR */}
                <div className="flex flex-col md:flex-row bg-gray-900 border-t-0">
                    <div className={`w-full ${showPreview ? 'md:w-1/2 md:border-r border-gray-700' : ''}`}>
                        <textarea
                            ref={textareaRef}
                            name={name}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            rows={rows}
                            className="w-full px-4 py-3 bg-gray-900 text-white focus:outline-none resize-y placeholder-gray-500 font-mono text-sm leading-relaxed"
                        ></textarea>
                    </div>

                    {/* LIVE PREVIEW PANE */}
                    {showPreview && (
                        <div className="w-full md:w-1/2 bg-gray-50 text-gray-900 p-4 overflow-y-auto max-h-[500px]">
                            <div className="text-xs uppercase font-bold text-gray-500 mb-2 border-b pb-1">Live Preview</div>
                            <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        code: MarkdownCodeBlock
                                    }}
                                >
                                    {value || '*Nothing to preview...*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
