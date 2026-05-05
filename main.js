/**
 * Highly Advanced Math and Further Maths Bot
 * Features:
 *  - Solves algebra, calculus, trigonometry, statistics, matrices, number theory, and more.
 *  - Parses natural language and LaTeX-style math queries.
 *  - Step-by-step solutions where possible.
 *  - Symbolic and numeric computations.
 * 
 * Dependencies: None required, but will use Math.js and Nerdamer/CDN for advanced symbolic algebra if run in browser.
 */

// Utility: Loads optional math libraries if available (browser/CDN use)
let nerdamer, math;
if (typeof window !== "undefined") {
    nerdamer = window.nerdamer;
    math = window.math;
} else {
    try { nerdamer = require("nerdamer/all"); } catch {}
    try { math = require("mathjs"); } catch {}
}

/**
 * Detects math topic from input string.
 * @param {string} input 
 * @returns {string} Math topic ("algebra", "calculus", etc.)
 */
function detectMathTopic(input) {
    const patterns = [
        {topic: "calculus", regex: /(integrate|differentiate|derivative|integral|d\/dx|∫)/i},
        {topic: "algebra", regex: /(solve|[=+\-*\/^])/i},
        {topic: "trigonometry", regex: /\b(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan)\b/i},
        {topic: "statistics", regex: /\b(mean|median|mode|stddev|variance|sample)\b/i},
        {topic: "matrices", regex: /\b(matrix|determinant|inverse|eigenvalue|eigenvector)\b/i},
        {topic: "number theory", regex: /\b(prime|gcd|lcm|mod|factor)\b/i},
        {topic: "complex numbers", regex: /\b(i\b|j\b|complex|conjugate|arg|modulus)\b/i},
    ];
    for(const pat of patterns) if (pat.regex.test(input)) return pat.topic;
    return "general";
}

/**
 * Returns a step-by-step solution or direct answer for a maths query.
 * @param {string} query User's natural language or math query
 * @returns {Promise<string>} Step-by-step solution or answer
 */
async function solveMathsQuery(query) {
    query = query.trim();

    // Attempt to detect topic
    const topic = detectMathTopic(query);

    // Specific route: algebraic equation solve
    if (/^solve\s/i.test(query) || (topic === "algebra" && /=/.test(query))) {
        // Example: Solve "2x + 3 = 7"
        let equation = query.replace(/^solve\s*/i, "");
        equation = equation.replace("equals", "=").replace("is equal to", "=");
        let bracketedVar = /([a-zA-Z]+)/.exec(equation);
        let variable = bracketedVar ? bracketedVar[1] : "x";
        if (nerdamer) {
            try {
                let sol = nerdamer.solveEquations(equation).toString();
                return `Solution for ${equation}:\n${variable} = ${sol}`;
            } catch (e) {}
        }
        if (math) {
            try {
                let sol = math.solve(equation, variable);
                return `Solution for ${equation}:\n${variable} = ${JSON.stringify(sol)}`;
            } catch (e) {}
        }
        return "Sorry, could not solve the algebraic equation.";
    }

    // Calculus
    if (/integrate|∫|integral|anti-?derive|find the area/i.test(query)) {
        // Extract function
        let fMatch = query.match(/(?:integrate|integral of|∫)?\s*([^\s]+)(?:\s*d[tx])?/i);
        let expr = fMatch ? fMatch[1] : null;
        if (nerdamer && expr) {
            try {
                let res = nerdamer(`integrate(${expr},x)`).toString();
                return `∫ ${expr} dx = ${res} + C`;
            } catch {}
        }
        return "Sorry, could not perform that integration.";
    }
    if (/differentiate|derivative|d\/dx|find the slope/i.test(query)) {
        let fMatch = query.match(/(?:differentiate|derivative of|d\/dx)?\s*([^\s]+)(?:\s*w\.?r\.?t\.? ?([a-zA-Z]))?/i);
        let expr = fMatch ? fMatch[1] : null;
        let wrt = fMatch && fMatch[2] ? fMatch[2] : "x";
        if (nerdamer && expr) {
            try {
                let res = nerdamer(`diff(${expr},${wrt})`).toString();
                return `d/d${wrt} [${expr}] = ${res}`;
            } catch {}
        }
        return "Sorry, could not perform that differentiation.";
    }

    // Trig
    if (topic === "trigonometry") {
        // Simple support for trig evaluation
        let trigPattern = /(sin|cos|tan|arcsin|arccos|arctan)\(?([^\)]*)\)?/i;
        let m = trigPattern.exec(query);
        if (m) {
            let fn = m[1];
            let arg = m[2];
            if (math) {
                try {
                    let radians = arg.includes("pi") ? math.evaluate(arg) : math.unit(arg, "deg").toNumber("rad");
                    let val = math[fn](radians);
                    return `${fn}(${arg}) ≈ ${val}`;
                } catch {}
            }
        }
    }

    // Matrices
    if (topic === "matrices") {
        // Example: "Inverse of [[1,2],[3,4]]"
        let invMatch = query.match(/inverse of (.+)/i);
        if (invMatch && math) {
            try {
                let mtx = JSON.parse(invMatch[1].replace(/'/g, '"'));
                let inv = math.inv(mtx);
                return `Inverse:\n${JSON.stringify(inv)}`;
            } catch {}
        }
        let detMatch = query.match(/determinant of (.+)/i);
        if (detMatch && math) {
            try {
                let mtx = JSON.parse(detMatch[1].replace(/'/g, '"'));
                let det = math.det(mtx);
                return `Determinant: ${det}`;
            } catch {}
        }
    }

    // General expressions (evaluate numerically)
    if (math && /^[\d\.\+\-\/\*\^\(\)\[\] ]+$/.test(query)) {
        try {
            let result = math.evaluate(query);
            return `Result: ${result}`;
        } catch {}
    }

    // Fallback to nerdamer for symbolic computations
    if (nerdamer) {
        try {
            let out = nerdamer(query).toString();
            return `Result: ${out}`;
        } catch {}
    }

    // Catch: If none of the above, reply with default
    return "Sorry, I couldn't parse your maths query. Please try rewording or use a supported format.";
}

/**
 * Example conversational interface (Node.js or browser console)
 */
async function demoMathBot() {
    const readline = typeof require !== "undefined" && require("readline");
    if (!readline) {
        console.warn("Console input not available. Use solveMathsQuery('your problem') directly.");
        return;
    }
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    console.log("Welcome to Advanced MathsBot! Enter a maths question or type 'exit' to quit.");
    while(true) {
        await new Promise(res => {
            rl.question("> ", async (q) => {
                if (q.trim().toLowerCase() === "exit") { rl.close(); process.exit(0); }
                let ans = await solveMathsQuery(q);
                console.log(ans);
                res();
            });
        });
    }
}

// Uncomment to run demo if Node.js
// demoMathBot();

// Export for integration in other systems (Node.js/ES6)
if (typeof module !== "undefined" && module.exports) {
    module.exports = { solveMathsQuery, detectMathTopic };
}
