const express = require('express');
const router = express.Router();
const axios = require('axios');

// ─────────────────────────────────────────────────────────────
//  Lightweight Python print() simulator (no real interpreter)
//  Handles the majority of beginner-level CodeQuest exercises.
// ─────────────────────────────────────────────────────────────
function simulatePython(source_code) {
    try {
        const lines = source_code.split('\n');
        const variables = {};
        const output = [];

        for (let raw of lines) {
            const line = raw.trim();
            if (!line || line.startsWith('#')) continue;

            // ── Variable assignment: x = ... ──────────────────
            const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
            if (assignMatch && !line.startsWith('if ') && !line.startsWith('while ') && !line.startsWith('for ')) {
                const varName = assignMatch[1];
                const rawVal = assignMatch[2].trim();
                variables[varName] = evalValue(rawVal, variables);
                continue;
            }

            // ── print(...) ────────────────────────────────────
            const printMatch = line.match(/^print\((.+)\)$/s);
            if (printMatch) {
                const inner = printMatch[1].trim();
                const result = evalPrintArgs(inner, variables);
                output.push(result);
                continue;
            }

            // ── sort / append / insert (mutate list variable) ──
            const methodMatch = line.match(/^([a-zA-Z_]\w*)\.(\w+)\((.*)\)$/);
            if (methodMatch) {
                const [, varName, method, argsStr] = methodMatch;
                if (Array.isArray(variables[varName])) {
                    if (method === 'sort') variables[varName].sort((a,b) => a > b ? 1 : -1);
                    if (method === 'append') variables[varName].push(evalValue(argsStr, variables));
                    if (method === 'insert') {
                        const parts = argsStr.split(',');
                        variables[varName].splice(parseInt(parts[0]), 0, evalValue(parts[1].trim(), variables));
                    }
                }
                continue;
            }

            // ── for loop (simple range / list) ────────────────
            const forMatch = line.match(/^for\s+(\w+)\s+in\s+(.+):$/);
            if (forMatch) continue; // handled by indented block below

            // ── match / case (Python 3.10+) ───────────────────
            const matchStmt = line.match(/^match\s+(.+):$/);
            if (matchStmt) continue;

            // ── if / elif / else / while ──────────────────────
            // skip control keywords (we handle simple conditionals via variable state)
        }

        return output.join('\n');
    } catch (e) {
        return null; // signal that simulation failed
    }
}

function evalValue(rawVal, variables) {
    const s = rawVal.trim();

    // String literal
    const strMatch = s.match(/^["'](.*)["']$/);
    if (strMatch) return strMatch[1];

    // List literal
    if (s.startsWith('[') && s.endsWith(']')) {
        try {
            // Simple list of numbers or strings
            const inner = s.slice(1, -1).split(',').map(x => evalValue(x.trim(), variables));
            return inner;
        } catch { return s; }
    }

    // Numeric expression
    if (/^[\d\s\+\-\*\/\.\(\)\%\*\*]+$/.test(s)) {
        try { return Function('"use strict"; return (' + s + ')')(); }
        catch { return s; }
    }

    // Boolean
    if (s === 'True') return true;
    if (s === 'False') return false;
    if (s === 'None') return null;

    // type() call
    const typeMatch = s.match(/^type\((.+)\)$/);
    if (typeMatch) {
        const inner = evalValue(typeMatch[1], variables);
        if (typeof inner === 'string') return "<class 'str'>";
        if (typeof inner === 'number') return Number.isInteger(inner) ? "<class 'int'>" : "<class 'float'>";
        if (typeof inner === 'boolean') return "<class 'bool'>";
        return "<class 'NoneType'>";
    }

    // int() cast
    const intMatch = s.match(/^int\((.+)\)$/);
    if (intMatch) {
        const v = evalValue(intMatch[1], variables);
        return Math.trunc(Number(v));
    }

    // float() cast
    const floatMatch = s.match(/^float\((.+)\)$/);
    if (floatMatch) return parseFloat(evalValue(floatMatch[1], variables));

    // str() cast
    const strCastMatch = s.match(/^str\((.+)\)$/);
    if (strCastMatch) return String(evalValue(strCastMatch[1], variables));

    // len() call
    const lenMatch = s.match(/^len\((.+)\)$/);
    if (lenMatch) {
        const v = evalValue(lenMatch[1], variables);
        return Array.isArray(v) ? v.length : String(v).length;
    }

    // math.sqrt, math.factorial, math.ceil, math.floor, math.pi
    if (s === 'math.pi') return Math.PI;
    const mathMatch = s.match(/^math\.(\w+)\((.+)\)$/);
    if (mathMatch) {
        const [, fn, arg] = mathMatch;
        const v = evalValue(arg, variables);
        if (fn === 'sqrt') return Math.sqrt(Number(v));
        if (fn === 'factorial') { let r = 1; for(let i=2;i<=v;i++) r*=i; return r; }
        if (fn === 'ceil') return Math.ceil(Number(v));
        if (fn === 'floor') return Math.floor(Number(v));
        if (fn === 'pow') { const args = arg.split(','); return Math.pow(evalValue(args[0].trim(), variables), evalValue(args[1].trim(), variables)); }
    }

    // Variable lookup
    if (variables.hasOwnProperty(s)) return variables[s];

    // Attribute access: var.upper(), var.lower(), var.split(...)
    const attrMatch = s.match(/^([a-zA-Z_]\w*)\.(\w+)\((.*)\)$/);
    if (attrMatch) {
        const [, varName, method, argStr] = attrMatch;
        const base = variables.hasOwnProperty(varName) ? variables[varName] : varName;
        const str = String(base);
        if (method === 'upper') return str.toUpperCase();
        if (method === 'lower') return str.toLowerCase();
        if (method === 'strip') return str.trim();
        if (method === 'split') {
            const sep = evalValue(argStr, variables);
            return str.split(sep === undefined || argStr === '' ? /\s+/ : sep);
        }
    }

    // Indexing: var[n]
    const indexMatch = s.match(/^([a-zA-Z_]\w*)\[(\d+)\]$/);
    if (indexMatch) {
        const [, varName, idx] = indexMatch;
        const v = variables[varName];
        if (Array.isArray(v)) return v[parseInt(idx)];
        if (typeof v === 'string') return v[parseInt(idx)];
    }

    return s;
}

function evalPrintArgs(inner, variables) {
    // Handle sep/end kwargs — strip them for basic output
    const stripped = inner.replace(/,?\s*(sep|end)\s*=\s*["'][^"']*["']/g, '');

    // Multiple args separated by comma → space-joined
    const parts = splitArgs(stripped);
    const values = parts.map(p => {
        const v = evalValue(p.trim(), variables);
        if (Array.isArray(v)) return pythonListStr(v);
        if (v === true) return 'True';
        if (v === false) return 'False';
        if (v === null) return 'None';
        if (typeof v === 'number') {
            // Return float representation if it's a float
            if (!Number.isInteger(v)) return v.toString();
            return v.toString();
        }
        return String(v);
    });
    return values.join(' ');
}

function pythonListStr(arr) {
    const items = arr.map(v => {
        if (typeof v === 'string') return `'${v}'`;
        if (v === true) return 'True';
        if (v === false) return 'False';
        if (v === null) return 'None';
        if (Array.isArray(v)) return pythonListStr(v);
        return String(v);
    });
    return '[' + items.join(', ') + ']';
}

function splitArgs(str) {
    // Split by commas NOT inside brackets or quotes
    const parts = [];
    let depth = 0, inStr = false, strChar = '', cur = '';
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (!inStr && (ch === '"' || ch === "'")) { inStr = true; strChar = ch; }
        else if (inStr && ch === strChar && str[i-1] !== '\\') { inStr = false; }
        else if (!inStr && (ch === '(' || ch === '[')) depth++;
        else if (!inStr && (ch === ')' || ch === ']')) depth--;
        if (ch === ',' && depth === 0 && !inStr) {
            parts.push(cur); cur = '';
        } else { cur += ch; }
    }
    if (cur.trim()) parts.push(cur);
    return parts;
}

// ─────────────────────────────────────────────────────────────
//  Full Python simulation for control flow (loops, if/match)
// ─────────────────────────────────────────────────────────────
function simulatePythonFull(source_code) {
    // For exercises with loops and conditions, try line-by-line with context
    const lines = source_code.split('\n');
    const output = [];
    let i = 0;

    function getIndent(line) { return line.match(/^(\s*)/)[1].length; }

    function evalCondition(expr, vars) {
        expr = expr.trim();
        // Replace Python tokens
        expr = expr.replace(/\band\b/g,'&&').replace(/\bor\b/g,'||').replace(/\bnot\b/g,'!').replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false');
        // Replace variables
        for (const [k, v] of Object.entries(vars)) {
            expr = expr.replace(new RegExp('\\b' + k + '\\b', 'g'), JSON.stringify(v));
        }
        try { return Function('"use strict"; return (' + expr + ')')(); }
        catch { return false; }
    }

    function runBlock(blockLines, vars) {
        let bi = 0;
        while (bi < blockLines.length) {
            const line = blockLines[bi].trim();
            if (!line || line.startsWith('#')) { bi++; continue; }

            // print
            const pm = line.match(/^print\((.+)\)$/s);
            if (pm) { output.push(evalPrintArgs(pm[1].trim(), vars)); bi++; continue; }

            // assignment
            const am = line.match(/^([a-zA-Z_]\w*)\s*(\+?=)\s*(.+)$/);
            if (am) {
                const [, name, op, rhs] = am;
                const val = evalValue(rhs.trim(), vars);
                if (op === '+=') vars[name] = (vars[name] || 0) + val;
                else if (op === '-=') vars[name] = (vars[name] || 0) - val;
                else vars[name] = val;
                bi++; continue;
            }

            // while loop
            if (line.match(/^while .+:$/)) {
                const cond = line.replace(/^while\s+/, '').replace(/:$/, '');
                const indent = getIndent(blockLines[bi]);
                bi++;
                const body = [];
                while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                    body.push(blockLines[bi]); bi++;
                }
                let guard = 0;
                while (evalCondition(cond, vars) && guard++ < 1000) runBlock(body, vars);
                continue;
            }

            // for loop
            const forM = line.match(/^for\s+(\w+)\s+in\s+(.+):$/);
            if (forM) {
                const [, varName, iterExpr] = forM;
                const indent = getIndent(blockLines[bi]);
                bi++;
                const body = [];
                while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                    body.push(blockLines[bi]); bi++;
                }
                let iterable = evalValue(iterExpr.trim(), vars);
                // range()
                const rangeM = iterExpr.trim().match(/^range\((.+)\)$/);
                if (rangeM) {
                    const args = rangeM[1].split(',').map(a => parseInt(evalValue(a.trim(), vars)));
                    const [start, stop, step] = args.length === 1 ? [0, args[0], 1] : args.length === 2 ? [args[0], args[1], 1] : args;
                    iterable = [];
                    for (let n = start; (step>0?n<stop:n>stop); n+=step) iterable.push(n);
                }
                if (!Array.isArray(iterable)) iterable = String(iterable).split('');
                for (const item of iterable) {
                    vars[varName] = item;
                    runBlock(body, { ...vars });
                    // update outer vars from inner if needed
                }
                continue;
            }

            // if / elif / else chain
            if (line.match(/^(if|elif|else).+:$/) || line === 'else:') {
                const indent = getIndent(blockLines[bi]);
                // Collect entire if-elif-else chain
                const chain = []; // [{cond, body}]
                while (bi < blockLines.length) {
                    const l = blockLines[bi].trim();
                    let cond = null;
                    if (l.startsWith('if ')) cond = l.replace(/^if\s+/, '').replace(/:$/, '');
                    else if (l.startsWith('elif ')) cond = l.replace(/^elif\s+/, '').replace(/:$/, '');
                    else if (l === 'else:') cond = '__else__';
                    else break;
                    bi++;
                    const body = [];
                    while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                        body.push(blockLines[bi]); bi++;
                    }
                    chain.push({ cond, body });
                }
                for (const { cond, body } of chain) {
                    if (cond === '__else__' || evalCondition(cond, vars)) {
                        runBlock(body, vars); break;
                    }
                }
                continue;
            }

            // match statement
            const matchM = line.match(/^match\s+(.+):$/);
            if (matchM) {
                const matchVal = String(evalValue(matchM[1], vars));
                const indent = getIndent(blockLines[bi]);
                bi++;
                let matched = false;
                while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                    const cl = blockLines[bi].trim();
                    const caseM = cl.match(/^case\s+(.+):$/);
                    if (!caseM) { bi++; continue; }
                    const pattern = caseM[1];
                    bi++;
                    const body = [];
                    const caseIndent = indent + 4;
                    while (bi < blockLines.length && getIndent(blockLines[bi]) >= caseIndent) {
                        body.push(blockLines[bi]); bi++;
                    }
                    if (!matched) {
                        const patterns = pattern.split('|').map(p => p.trim().replace(/^["']|["']$/g, ''));
                        if (pattern.trim() === '_' || patterns.includes(matchVal)) {
                            runBlock(body, vars); matched = true;
                        }
                    }
                }
                continue;
            }

            // method calls (sort, append, insert)
            const methM = line.match(/^([a-zA-Z_]\w*)\.(\w+)\((.*)\)$/);
            if (methM) {
                const [, varName, method, argsStr] = methM;
                if (Array.isArray(vars[varName])) {
                    if (method === 'sort') vars[varName].sort((a,b) => a > b ? 1 : -1);
                    if (method === 'append') vars[varName].push(evalValue(argsStr, vars));
                    if (method === 'insert') {
                        const pts = argsStr.split(',');
                        vars[varName].splice(parseInt(pts[0]), 0, evalValue(pts[1].trim(), vars));
                    }
                }
            }

            // import (ignore)
            if (line.startsWith('import ') || line.startsWith('from ')) { bi++; continue; }

            // try/except
            if (line === 'try:') {
                const indent = getIndent(blockLines[bi]);
                bi++;
                const tryBody = [];
                while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                    tryBody.push(blockLines[bi]); bi++;
                }
                // except block
                let exceptBody = [];
                if (bi < blockLines.length && blockLines[bi].trim().startsWith('except')) {
                    bi++;
                    while (bi < blockLines.length && getIndent(blockLines[bi]) > indent) {
                        exceptBody.push(blockLines[bi]); bi++;
                    }
                }
                const savedOutput = [...output];
                try { runBlock(tryBody, vars); }
                catch { output.length = savedOutput.length; runBlock(exceptBody, vars); }
                continue;
            }

            bi++;
        }
    }

    runBlock(lines.map((l, i) => l), {});
    return output.join('\n');
}

// ─────────────────────────────────────────────────────────────
//  Route: POST /api/execute
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { source_code, language_id, expected_output } = req.body;

    try {
        if (!process.env.JUDGE0_API_KEY) {
            // Use built-in Python simulator
            let simOutput = null;
            try { simOutput = simulatePythonFull(source_code); } catch {}
            if (simOutput === null || simOutput === undefined) simOutput = '';

            const accepted = simOutput.trim() === (expected_output || '').trim();
            return res.json({
                status: { id: accepted ? 3 : 4, description: accepted ? 'Accepted' : 'Wrong Answer' },
                stdout: simOutput + '\n',
                stderr: null,
            });
        }

        // Real Judge0 API
        const response = await axios.post(
            `${process.env.JUDGE0_API_URL}?base64_encoded=false&wait=true`,
            { source_code, language_id, expected_output },
            { headers: { 'X-RapidAPI-Key': process.env.JUDGE0_API_KEY, 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' } }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Execution Error:', error.message);
        res.status(500).json({ error: 'Code execution failed', details: error.message });
    }
});

module.exports = router;
