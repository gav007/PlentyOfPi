import type { JSModule } from '@/types/javascript-lessons';

const jsFoundationsModules: JSModule[] = [
  {
    slug: 'module-1-introduction',
    title: 'Module 1: Introduction to JavaScript and Computer Programming',
    description: 'Discover JavaScript, how it runs in browsers, and write your very first "Hello, World!" script.',
    lessons: [
      {
        slug: 'what-is-javascript',
        subTitle: 'What is JavaScript?',
        text: 'JavaScript (often abbreviated as JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, thanks to Node.js.\n\nKey Characteristics:\n- **Dynamic:** Types are checked at runtime.\n- **Client-Side Power:** Manipulates HTML and CSS to update web pages dynamically.\n- **Versatile:** Used for web development (front-end and back-end with Node.js), mobile apps, game development, and more.\n- **Ecosystem:** Vast number of libraries and frameworks (React, Angular, Vue.js, etc.).',
      },
      {
        slug: 'setup-online-vs-local',
        subTitle: 'Setup: Online vs. Local Environments',
        text: 'You can run JavaScript in several ways:\n\n- **Browser Developer Console:** Every modern web browser (Chrome, Firefox, Edge, Safari) has a built-in developer console where you can type and execute JavaScript code directly. This is great for quick experiments.\n  - *How to open (usually):* Right-click on a webpage, select "Inspect" or "Inspect Element", and then find the "Console" tab.\n\n- **Online Editors/Playgrounds:** Websites like CodePen, JSFiddle, or Replit provide an online environment to write and run HTML, CSS, and JavaScript without any local setup.\n\n- **Local Setup (Text Editor + Browser):**\n  1. Create an HTML file (e.g., `index.html`).\n  2. Write your JavaScript code within `<script>` tags in the HTML file, or link to an external `.js` file.\n  3. Open the HTML file in your web browser.\n\n- **Local Setup (Node.js):** For running JavaScript outside of a browser (e.g., for server-side applications or command-line tools), you can install Node.js. This allows you to execute `.js` files directly from your terminal.',
      },
      {
        slug: 'hello-world-console',
        subTitle: 'Hello, World (console.log)',
        text: 'The `console.log()` method is the primary way to display messages, data, or debugging information in the JavaScript console (either in the browser or in a Node.js environment).\n\nExample:\n```javascript\nconsole.log("Hello, Plenty of π!");\nconsole.log(123);\nconsole.log(true);\nlet myVariable = "This is a variable";\nconsole.log(myVariable);\n```\nThis will print "Hello, Plenty of π!", the number 123, the boolean true, and the value of `myVariable` to the console, each on a new line.',
      },
      {
        slug: 'script-tags-html-integration',
        subTitle: 'Script Tags & HTML Integration',
        text: 'To use JavaScript within an HTML webpage, you use the `<script>` tag.\n\n**1. Inline JavaScript:**\nYou can place JavaScript code directly inside the `<script>` tags:\n```html\n<script>\n  console.log("This is inline JavaScript!");\n  alert("Hello from inline script!"); // alert shows a popup dialog\n</script>\n```\n\n**2. External JavaScript File:**\nIt\'s generally better practice to keep your JavaScript code in separate `.js` files and link them. Create a file (e.g., `myscript.js`) and then link it in your HTML:\n```html\n<!-- In your HTML file, usually before the closing </body> tag -->\n<script src="myscript.js"></script>\n```\nContents of `myscript.js`:\n```javascript\n// This code is in myscript.js\nconsole.log("Hello from an external JavaScript file!");\n```\n**Placement of `<script>` tags:**\n- Placing scripts at the end of the `<body>` is often recommended. This ensures that the HTML structure is loaded and parsed before the script tries to interact with it, preventing potential errors and improving perceived page load speed.',
      },
    ],
    labs: [
      {
        slug: 'lab-1-1-console-practice',
        title: 'Lab 1.1: Console Practice',
        description: 'Use the `console.log()` method to output your name, your year of birth, and a custom message about why you are learning JavaScript. Each piece of information should be on a new line in the console.',
        starterCode: '// Use console.log() to print your name\n// Example: console.log("My Name");\n\n// Use console.log() to print your year of birth\n\n// Use console.log() to print a custom message\n// Example: console.log("I am learning JavaScript to build cool websites!");',
        tasks: [
          'Print your full name to the console.',
          'Print your year of birth to the console on a new line.',
          'Print a short message (1-2 sentences) about why you are interested in learning JavaScript to the console on another new line.',
        ],
        hints: [
          'The `console.log()` function can take a string (text in quotes) or a number as an argument.',
          'Each call to `console.log()` typically creates a new line in the console output.',
          'Remember to enclose your text messages in either single (\'\') or double ("") quotes.',
        ],
        solutionCode: 'console.log("Alex Doe"); // Replace Alex Doe with your name\nconsole.log(1995); // Replace 1995 with your birth year\nconsole.log("I want to learn JavaScript to create interactive web applications and understand front-end development better.");',
        solutionExplanation: 'This solution uses three separate `console.log()` statements. The first prints a placeholder name, the second a placeholder birth year (as a number), and the third a sample reason for learning JavaScript. Each statement outputs its content on a new line in the console.',
        expectedOutput: "Alex Doe\n1995\nI want to learn JavaScript to create interactive web applications and understand front-end development better.", // Example expected output based on solution
      },
    ],
    quizzes: [
      {
        slug: 'quiz-1-js-intro-concepts',
        title: 'Quiz 1: JavaScript Introduction Concepts',
        questionsCount: 5,
        questions: [
          {
            question: 'What is `console.log()` primarily used for in JavaScript?',
            options: {
              A: 'To get input from the user.',
              B: 'To perform mathematical calculations.',
              C: 'To display messages or data in the developer console.',
              D: 'To change the HTML content of a webpage.',
            },
            answer: 'C',
            feedback: '`console.log()` is mainly used for outputting information to the browser\'s developer console or a Node.js terminal, often for debugging or informational purposes.',
          },
          {
            question: 'How do you include JavaScript code directly within an HTML file?',
            options: {
              A: 'Using the `<javascript>` tag.',
              B: 'Using the `<script>` tag.',
              C: 'Using the `<js>` tag.',
              D: 'By writing it directly into the `<body>` without any tags.',
            },
            answer: 'B',
            feedback: 'The `<script>` tag is the standard HTML element used to embed or reference executable JavaScript code.',
          },
          {
            question: 'Which of the following is NOT a typical way to run JavaScript code?',
            options: {
              A: 'In the browser developer console.',
              B: 'Using an online JavaScript playground.',
              C: 'Compiling it into a standalone .exe file before running.',
              D: 'Executing a .js file with Node.js.',
            },
            answer: 'C',
            feedback: 'JavaScript is typically interpreted or JIT-compiled by browsers or environments like Node.js. While tools exist to package JS apps, it\'s not compiled into a traditional .exe like C++.',
          },
          {
            question: 'Where is it generally recommended to place `<script src="..."></script>` tags in an HTML document for optimal page loading?',
            options: {
              A: 'Inside the `<head>` tag only.',
              B: 'At the very beginning of the `<body>` tag.',
              C: 'Right before the closing `</body>` tag.',
              D: 'It does not matter where they are placed.',
            },
            answer: 'C',
            feedback: 'Placing script tags just before the closing `</body>` tag allows the HTML content to be parsed and rendered first, which can improve perceived page load performance and prevent errors if scripts try to access DOM elements that haven\'t loaded yet.',
          },
          {
            question: 'What does "client-side" JavaScript primarily refer to?',
            options: {
              A: 'JavaScript running on a web server.',
              B: 'JavaScript running in the user\'s web browser.',
              C: 'JavaScript used for database management.',
              D: 'JavaScript used for operating system tasks.',
            },
            answer: 'B',
            feedback: '"Client-side" JavaScript is the code that runs directly in the user\'s web browser, allowing for dynamic interactions and manipulation of the webpage content.',
          },
        ],
      },
    ],
  },
  // Add more modules here as content is developed
];

export default jsFoundationsModules;
