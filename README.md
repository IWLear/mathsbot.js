# mathsbot.js
Advanced MathsBot is a lightweight JavaScript engine that solves problems across algebra, calculus, trigonometry, matrices, and more. It supports natural language and LaTeX-style input, performs symbolic and numeric computations, and includes optional Math.js/Nerdamer integration for advanced solving.


/**
 * How do I use the bot?
 * 
 * To use MathsBot, simply call the `solveMathsQuery()` function and pass your maths problem as a string argument.
 * 
 * Example:
 *    solveMathsQuery("integrate x^2 dx")
 *    // Returns: "Result: (1/3)*x^3"
 * 
 * In Node.js, you can use the included demo interface by uncommenting the line `demoMathBot();` in the script. 
 * This will launch a command-line bot. Type your maths question, then press enter. Type 'exit' to quit.
 * 
 * If integrating elsewhere, import or require MathsBot and call `solveMathsQuery()` as needed.
 * 
 * Supported formats include:
 *   - Arithmetic expressions: "2+2", "5 * (9-4)"
 *   - Algebraic manipulations: "expand (x+1)^5"
 *   - Calculus: "integrate sin(x) dx", "differentiate x^3"
 *   - Matrices and more (see nerdamer/mathjs docs for possibilities)
 * 
 * If you need further help, check the documentation or use `detectMathTopic(query)` to infer the maths category.
 */
