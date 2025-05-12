
import type { JSModule } from '@/types/javascript-lessons';

const jsFoundationsModules: JSModule[] = [
  {
    slug: 'module-1-introduction-to-javascript',
    title: 'Module 1: Introduction to JavaScript and Programming',
    description: 'Begin your JavaScript journey. Learn what JS is, how it works in browsers, and write your first script.',
    lessons: [
      {
        slug: 'what-is-javascript',
        subTitle: 'What is JavaScript?',
        text: 'JavaScript (JS) is a versatile and widely-used programming language, primarily known as the scripting language for web pages. It allows you to create dynamically updating content, control multimedia, animate images, and much more.\n\n**Key Advantages:**\n- **Interactivity:** Makes web pages interactive and responsive to user actions.\n- **Ubiquity:** Runs in all modern web browsers without needing any plugins.\n- **Large Ecosystem:** Supported by a vast collection of libraries and frameworks (like React, Angular, Vue.js) that simplify development.\n- **Versatility:** Used for front-end web development, back-end development (with Node.js), mobile app development, game development, and more.\n\n**Limitations:**\n- **Browser Dependence (Client-Side):** Client-side JS relies on the user\'s browser and its settings. Different browsers might interpret code slightly differently, though standards have improved this greatly.\n- **Security:** Malicious scripts can be a concern, though browsers have robust security models to mitigate risks.\n\n**Common Use Cases:**\n- Adding interactive behavior to web pages (e.g., sliders, pop-ups, form validations).\n- Manipulating the Document Object Model (DOM) to change HTML and CSS.\n- Making asynchronous requests to servers (AJAX) to update parts of a page without reloading.\n- Building complex single-page applications (SPAs).\n- Creating browser-based games.',
      },
      {
        slug: 'client-vs-server-scripting',
        subTitle: 'Client-Side vs. Server-Side Scripting',
        text: 'Scripting languages can run in different environments:\n\n- **Client-Side Scripting:**\n  - Code is executed on the user\'s computer, typically within a web browser.\n  - JavaScript is the most common client-side scripting language.\n  - **Pros:** Can respond quickly to user actions without needing to communicate with the server, reduces server load, allows for richer user interfaces.\n  - **Cons:** Dependent on the user\'s browser capabilities, code is visible to the user (can be viewed/copied).\n\n- **Server-Side Scripting:**\n  - Code is executed on the web server.\n  - Examples: Node.js (JavaScript), Python (Django/Flask), PHP, Ruby on Rails.\n  - **Pros:** Can access databases and other server-side resources securely, code is not visible to the client, can handle complex business logic.\n  - **Cons:** Requires a round trip to the server for every dynamic request, which can introduce latency.\n\nJavaScript, with Node.js, can be used for both client-side and server-side scripting, making it a full-stack development language.',
      },
      {
        slug: 'setting-up-environment',
        subTitle: 'Setting Up Your Environment',
        text: 'You have several options for writing and running JavaScript code:\n\n1.  **Browser Developer Tools (Console):**\n    -   Every modern browser (Chrome, Firefox, Edge, Safari) comes with built-in developer tools.\n    -   You can open the console (usually by right-clicking on a webpage, selecting "Inspect" or "Inspect Element", and then navigating to the "Console" tab) and type JavaScript code directly to see it execute.\n    -   Great for quick tests and experiments.\n\n2.  **Online Code Editors/Playgrounds:**\n    -   Websites like CodePen ([https://codepen.io](https://codepen.io)), JSFiddle ([https://jsfiddle.net](https://jsfiddle.net)), and Replit ([https://replit.com](https://replit.com)) provide an online environment where you can write HTML, CSS, and JavaScript and see the results instantly without any local setup.\n\n3.  **Local Development with a Text Editor and Browser:**\n    -   **Text Editor:** Use a code editor like Visual Studio Code (VS Code - highly recommended), Sublime Text, or Atom to write your code.\n    -   **HTML File:** Create an HTML file (e.g., `index.html`).\n    -   **Script Tag:** Embed your JavaScript code within `<script>` tags in the HTML file, or link to an external `.js` file.\n    -   **Browser:** Open the HTML file in your web browser to run the JavaScript.\n\n4.  **Local Development with Node.js (for server-side or command-line JS):**\n    -   Install Node.js from [https://nodejs.org](https://nodejs.org).\n    -   This allows you to run JavaScript files directly from your terminal (e.g., `node myscript.js`).\n    -   Essential for back-end development and using many JavaScript build tools.',
      },
      {
        slug: 'first-program-hello-world',
        subTitle: 'Your First Program: console.log("Hello, World!")',
        text: 'The `console.log()` function is a fundamental tool for JavaScript developers. It\'s used to print messages or data to the browser\'s developer console or the terminal (if using Node.js).\n\nHere\'s how you write a "Hello, World!" program:\n```javascript\nconsole.log("Hello, World!");\n```\nWhen this code runs, the message "Hello, World!" will be displayed in the console.\n\nYou can log different types of data:\n```javascript\nconsole.log("This is a string.");\nconsole.log(123); // A number\nconsole.log(true); // A boolean value\nlet myVariable = "Plenty of π";\nconsole.log(myVariable); // The value of a variable\n```',
      },
      {
        slug: 'embedding-js-in-html',
        subTitle: 'Basics of Embedding JavaScript in HTML',
        text: 'To make your web pages interactive, you need to include JavaScript in your HTML files. This is done using the `<script>` tag.\n\nThere are two main ways:\n\n1.  **Inline JavaScript:**\n    You can write JavaScript code directly between the opening `<script>` and closing `</script>` tags.\n    ```html\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <title>My First JS Page</title>\n    </head>\n    <body>\n      <h1>Welcome!</h1>\n      <script>\n        console.log("JavaScript is running from inline script!");\n        alert("Hello from the page!"); // alert creates a pop-up dialog\n      </script>\n    </body>\n    </html>\n    ```\n\n2.  **External JavaScript File (Recommended):**\n    For better organization, especially with larger scripts, it\'s best to put your JavaScript code in a separate file (e.g., `script.js`) and link it to your HTML.\n\n    *script.js:*\n    ```javascript\n    // This is in script.js\n    console.log("JavaScript is running from an external file!");\n    alert("Hello from external script!");\n    ```\n\n    *index.html:*\n    ```html\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <title>My JS Page</title>\n    </head>\n    <body>\n      <h1>Welcome!</h1>\n      <script src="script.js"></script> <!-- Link to the external file -->\n    </body>\n    </html>\n    ```\n\n**Where to place the `<script>` tag?**\nIt\'s common practice to place `<script>` tags just before the closing `</body>` tag. This ensures that the HTML content of the page is loaded and parsed before the script tries to interact with it, which can prevent errors and improve perceived page load speed.',
      },
      {
        slug: 'running-js-in-browser-console',
        subTitle: 'Running JavaScript in Browser Console',
        text: 'The browser\'s developer console is an invaluable tool for learning and debugging JavaScript.\n\n**How to open the console:**\n- **Chrome:** Right-click on a webpage → "Inspect" → "Console" tab. Or `Ctrl+Shift+J` (Windows/Linux) / `Cmd+Option+J` (Mac).\n- **Firefox:** Right-click → "Inspect Element" → "Console" tab. Or `Ctrl+Shift+K` (Windows/Linux) / `Cmd+Option+K` (Mac).\n- **Edge:** Right-click → "Inspect" → "Console" tab. Or `F12` then select "Console".\n- **Safari:** You might need to enable the Develop menu first (Safari Preferences → Advanced → "Show Develop menu in menu bar"). Then Develop → "Show JavaScript Console".\n\n**Using the Console:**\n- **Executing Code:** You can type any valid JavaScript expression or statement directly into the console and press Enter to execute it.\n  ```javascript\n  10 + 5 // Output: 15\n  let message = "Testing console";\n  console.log(message); // Output: Testing console\n  ```\n- **Viewing `console.log()` Output:** Messages from `console.log()` statements in your scripts will appear here.\n- **Inspecting Variables:** If your script has run and defined global variables, you can type their names into the console to see their current values.\n- **Error Messages:** JavaScript errors that occur on the page will be reported in the console, often with line numbers and descriptions to help you debug.',
      },
    ],
    labs: [
      {
        slug: 'lab-1-1-console-greetings',
        title: 'Console Greetings',
        description: 'Practice using `console.log()` to output personal information and a custom message.',
        starterCode: '// Task 1: Print your full name to the console.\n// Example: console.log("Your Name Here");\n\n// Task 2: Print your birth year to the console.\n\n// Task 3: Print your favorite programming language (or one you want to learn).\n\n// Task 4: Print a short message about why you are excited to learn JavaScript.',
        tasks: [
          'Use `console.log()` to display your full name.',
          'On a new line, use `console.log()` to display your birth year.',
          'On another new line, use `console.log()` to display your favorite programming language.',
          'Finally, on a new line, print a brief message (1-2 sentences) expressing your excitement or goals for learning JavaScript.',
        ],
        hints: [
          'Remember that `console.log()` prints its argument to the console.',
          'Text (strings) should be enclosed in quotation marks (e.g., `"Hello"` or `\'Hello\'`).',
          'Numbers can be logged directly (e.g., `console.log(2023)`).',
          'Each `console.log()` statement will typically start a new line in the console output.',
        ],
        solutionCode: 'console.log("Alex Pioneer"); // Replace with your name\nconsole.log(1998); // Replace with your birth year\nconsole.log("JavaScript"); // Replace with your favorite language\nconsole.log("I am excited to learn JavaScript to build interactive websites and understand web development!");',
        solutionExplanation: 'This solution uses four `console.log()` statements. The first prints a placeholder name. The second prints a sample birth year. The third prints "JavaScript" as a favorite language. The final one prints a custom message. Each log appears on a new line.',
        expectedOutput: "Alex Pioneer\n1998\nJavaScript\nI am excited to learn JavaScript to build interactive websites and understand web development!",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-1-introduction-to-js',
        title: 'Quiz 1: Introduction to JavaScript',
        questionsCount: 8, // Updated count
        questions: [
          {
            question: 'What is JavaScript primarily known as?',
            options: {
              A: 'A database management language.',
              B: 'The scripting language for web pages.',
              C: 'An operating system.',
              D: 'A markup language for structuring web content.',
            },
            answer: 'B',
            feedback: 'JavaScript is most well-known as the scripting language that adds interactivity and dynamic behavior to web pages.',
          },
          {
            question: 'Which of the following is a common way to run JavaScript code for quick experiments without any local setup?',
            options: {
              A: 'Compiling it with a C++ compiler.',
              B: 'Using Microsoft Word.',
              C: 'Typing it directly into the browser\'s developer console.',
              D: 'Writing it in a text file and emailing it to a server.',
            },
            answer: 'C',
            feedback: 'The browser developer console allows you to execute JavaScript code snippets directly and is excellent for quick tests.',
          },
          {
            question: 'What HTML tag is used to embed or reference JavaScript code?',
            options: {
              A: '<javascript>',
              B: '<js>',
              C: '<scripting>',
              D: '<script>',
            },
            answer: 'D',
            feedback: 'The `<script>` tag is the standard HTML element for including JavaScript code, either inline or by linking to an external file.',
          },
          {
            question: 'What does the `console.log("My Message");` statement do in JavaScript?',
            options: {
              A: 'It displays "My Message" as a pop-up window on the webpage.',
              B: 'It writes "My Message" to the browser\'s developer console.',
              C: 'It saves "My Message" to a file on the server.',
              D: 'It changes the main heading of the HTML page to "My Message".',
            },
            answer: 'B',
            feedback: '`console.log()` is used to output messages, values of variables, or debugging information to the browser\'s developer console.',
          },
          {
            question: 'What is client-side scripting?',
            options: {
              A: 'Code that runs on the web server before a page is sent to the browser.',
              B: 'Code that is executed by the user\'s web browser on their computer.',
              C: 'A method for encrypting data sent between client and server.',
              D: 'A type of customer service chat bot.',
            },
            answer: 'B',
            feedback: 'Client-side scripting refers to JavaScript code that is downloaded and executed by the client\'s (user\'s) web browser.',
          },
          {
            question: 'True or False: JavaScript can only be used for front-end web development.',
            options: {
              A: 'True',
              B: 'False',
            },
            answer: 'B',
            feedback: 'False. While JavaScript is dominant in front-end development, technologies like Node.js allow JavaScript to be used for server-side (back-end) programming as well.',
          },
          {
            question: 'Which is NOT a primary advantage of JavaScript?',
            options: {
                A: 'Creating interactive web pages.',
                B: 'Running directly on the server without a runtime environment like Node.js.',
                C: 'Having a large ecosystem of libraries and frameworks.',
                D: 'Being supported by all modern web browsers.'
            },
            answer: 'B',
            feedback: 'JavaScript requires a runtime environment like Node.js to run on the server-side. Client-side JS runs directly in browsers.'
          },
          {
            question: 'Where is it generally recommended to place `<script>` tags in an HTML document for better performance?',
            options: {
                A: 'Inside the `<head>` tag.',
                B: 'Just before the closing `</body>` tag.',
                C: 'At the very beginning of the `<body>` tag.',
                D: 'It does not matter where they are placed.'
            },
            answer: 'B',
            feedback: 'Placing `<script>` tags just before the closing `</body>` tag ensures that the HTML content is parsed and rendered before the script, which can improve perceived load time and prevent errors if scripts try to access DOM elements that haven\'t been created yet.'
          }
        ],
      },
    ],
  },
  {
    slug: 'module-2-variables-data-types',
    title: 'Module 2: Variables, Data Types, Type Casting, and Comments',
    description: 'Learn how to store data, understand different data types, convert between them, and comment your code effectively.',
    lessons: [
      {
        slug: 'declaring-variables',
        subTitle: 'Declaring Variables: let, const, var',
        text: 'Variables are containers for storing data values. In JavaScript, you can declare variables using `var`, `let`, and `const`.\n\n- **`var` (Older way, generally avoid in modern JS):**\n  - Function-scoped or globally-scoped.\n  - Can be re-declared and updated.\n  - Variables declared with `var` are hoisted (their declaration is moved to the top of their scope).\n  ```javascript\n  var name = "Alice";\n  var name = "Bob"; // Re-declaration allowed\n  name = "Charlie"; // Update allowed\n  ```\n\n- **`let` (Modern way, preferred for variables that might change):**\n  - Block-scoped (scope is limited to the block `{...}` where they are defined).\n  - Cannot be re-declared in the same scope.\n  - Can be updated.\n  - Not hoisted before initialization (Temporal Dead Zone).\n  ```javascript\n  let age = 30;\n  // let age = 31; // Error: Cannot re-declare block-scoped variable \'age\'.\n  age = 31; // Update allowed\n  ```\n\n- **`const` (Modern way, preferred for variables that should not change):**\n  - Block-scoped.\n  - Cannot be re-declared or re-assigned after initialization.\n  - Must be initialized during declaration.\n  - Good for values that are constant, like mathematical constants or configuration settings.\n  ```javascript\n  const PI = 3.14159;\n  // PI = 3.14; // Error: Assignment to constant variable.\n  // const PI = 3.14; // Error\n  ```\n**Recommendation:** Use `const` by default. If you know a variable needs to be reassigned, use `let`. Avoid using `var` in modern JavaScript development due to its sometimes confusing scoping and hoisting behavior.',
      },
      {
        slug: 'naming-conventions',
        subTitle: 'Naming Conventions, Reassignment, and Shadowing',
        text: '**Naming Conventions:**\nChoosing good variable names makes your code more readable and understandable.\n- **Start with a letter, underscore (`_`), or dollar sign (`$`):** Variable names cannot start with a number.\n- **Subsequent characters:** Can be letters, numbers, underscores, or dollar signs.\n- **Case-sensitive:** `myVariable` is different from `MyVariable`.\n- **CamelCase:** Commonly used in JavaScript (e.g., `firstName`, `totalAmount`). The first word is lowercase, and subsequent words start with an uppercase letter.\n- **Avoid reserved keywords:** You cannot use JavaScript keywords (like `let`, `const`, `if`, `for`, `function`) as variable names.\n- **Descriptive names:** Choose names that clearly indicate the variable\'s purpose (e.g., `userName` instead of `u` or `x`).\n\n**Reassignment:**\n- Variables declared with `let` can be reassigned to a new value.\n  ```javascript\n  let score = 100;\n  score = 150; // Valid\n  ```\n- Variables declared with `const` cannot be reassigned.\n  ```javascript\n  const apiKey = "xyz123";\n  // apiKey = "abc789"; // This would cause an error\n  ```\n  Note: If a `const` variable holds an object or an array, the object/array itself is still mutable (its properties or elements can be changed), but the variable cannot be reassigned to a *new* object/array.\n\n**Shadowing:**\nVariable shadowing occurs when a variable declared within a certain scope (e.g., inside a function or a block) has the same name as a variable declared in an outer scope. The inner variable "shadows" or hides the outer variable within its scope.\n```javascript\nlet x = 10; // Outer scope x\n\nfunction example() {\n  let x = 20; // Inner scope x, shadows the outer x\n  console.log(x); // Prints 20\n}\n\nexample();\nconsole.log(x); // Prints 10 (outer scope x is unaffected)\n```\nWhile shadowing is allowed, it can sometimes make code harder to understand and debug if not used carefully.',
      },
      {
        slug: 'primitive-data-types',
        subTitle: 'Primitive Data Types',
        text: 'Primitive data types are the most basic data types in JavaScript. They are immutable (their values cannot be changed directly; operations on them create new values).\n\n1.  **`String`**: Represents textual data. Enclosed in single quotes (`\'...\'`), double quotes (`"..."`), or backticks (`` `...` `` - template literals).\n    ```javascript\n    let greeting = "Hello";\n    let name = \'Alice\';\n    let message = `Welcome, ${name}!`; // Template literal with interpolation\n    ```\n\n2.  **`Number`**: Represents both integer and floating-point numbers. JavaScript has only one number type.\n    ```javascript\n    let integerNum = 100;\n    let floatNum = 3.14;\n    let scientificNum = 2.5e6; // 2.5 * 10^6\n    ```\n    Special numeric values: `Infinity`, `-Infinity`, `NaN` (Not a Number).\n\n3.  **`BigInt`**: Represents integers of arbitrary length. Created by appending `n` to the end of an integer literal or by calling `BigInt()`.\n    ```javascript\n    let largeNumber = 123456789012345678901234567890n;\n    let anotherBigInt = BigInt("98765432109876543210");\n    ```\n\n4.  **`Boolean`**: Represents a logical entity and can have two values: `true` or `false`.\n    ```javascript\n    let isActive = true;\n    let isLoggedIn = false;\n    ```\n\n5.  **`undefined`**: A variable that has been declared but not yet assigned a value has the value `undefined`.\n    ```javascript\n    let myVar;\n    console.log(myVar); // Output: undefined\n    ```\n\n6.  **`null`**: Represents the intentional absence of any object value. It is an assignment value, meaning it can be assigned to a variable as a representation of no value.\n    ```javascript\n    let emptyValue = null;\n    ```\n\n7.  **`Symbol`** (ES6+): A unique and immutable primitive value that may be used as the key of an Object property. Less common in everyday beginner scripting.',
      },
      {
        slug: 'type-casting-conversion',
        subTitle: 'Type Casting and Conversion',
        text: 'Type conversion (or type casting) is the process of converting a value from one data type to another.\n\n**Implicit Conversion (Coercion):**\nJavaScript often automatically converts values from one type to another when an operation involves mixed types. This can sometimes lead to unexpected results if not understood.\n```javascript\nconsole.log("5" + 3);    // Output: "53" (number 3 is coerced to string "3")\nconsole.log("5" - 3);    // Output: 2 (string "5" is coerced to number 5)\nconsole.log(5 + true);   // Output: 6 (boolean true is coerced to number 1)\nconsole.log(Boolean(0)); // Output: false (0 is falsy)\n```\n\n**Explicit Conversion:**\nYou can explicitly convert types using built-in functions:\n- **`String()` or `value.toString()`:** Converts a value to a string.\n  ```javascript\n  let num = 123;\n  let strNum = String(num); // "123"\n  console.log(typeof strNum); // "string"\n  ```\n- **`Number()`:** Converts a value to a number. If the value cannot be converted, it returns `NaN`.\n  ```javascript\n  let str = "45.6";\n  let numStr = Number(str); // 45.6\n  console.log(Number("hello")); // NaN\n  console.log(Number(true));    // 1\n  console.log(Number(false));   // 0\n  ```\n  Shorthand ways to convert to number: `+value` (unary plus operator)\n  `parseInt(string, radix)`: Parses a string and returns an integer.\n  `parseFloat(string)`: Parses a string and returns a floating-point number.\n- **`Boolean()`:** Converts a value to a boolean.\n  Values that convert to `false` (falsy values): `false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`.\n  All other values convert to `true` (truthy values).\n  ```javascript\n  console.log(Boolean("hello")); // true\n  console.log(Boolean(0));     // false\n  console.log(Boolean(undefined)); // false\n  ```',
      },
      {
        slug: 'comments-in-js',
        subTitle: 'Comments: Single-line and Multi-line',
        text: 'Comments are notes in your code that are ignored by the JavaScript engine. They are used to explain your code, make it more readable, or temporarily disable parts of it.\n\n**1. Single-line Comments:**\nStart with `//`. Everything from `//` to the end of the line is a comment.\n```javascript\n// This is a single-line comment.\nlet x = 10; // This comment explains the variable x.\n```\n\n**2. Multi-line Comments:**\nStart with `/*` and end with `*/`. Everything between `/*` and `*/` is a comment, even across multiple lines.\n```javascript\n/*\nThis is a\nmulti-line comment.\nIt can span several lines.\n*/\nlet y = 20;\n\n/* Another example: let z = 30; */\n```\n\n**Why use comments?**\n- **Explain complex logic:** Make it easier for others (and your future self) to understand what your code does.\n- **Clarify intentions:** Explain *why* you wrote the code a certain way.\n- **Leave notes or TODOs:** `// TODO: Refactor this function later.`\n- **Temporarily disable code (commenting out):** Useful for debugging.\n  ```javascript\n  // console.log("This line is temporarily disabled.");\n  ```\nGood commenting practice makes code more maintainable and collaborative.',
      },
      {
        slug: 'complex-types-arrays-objects-intro',
        subTitle: 'Complex Types: Arrays and Objects (Basic Usage)',
        text: 'Besides primitive types, JavaScript has complex data types, primarily Objects.\n\n**Objects:**\nAn object is a collection of key-value pairs (properties). Properties can be strings, numbers, booleans, functions, or even other objects.\n```javascript\n// Object literal syntax\nlet person = {\n  firstName: "John",\n  lastName: "Doe",\n  age: 30,\n  isStudent: false,\n  greet: function() { // A method (function property)\n    console.log("Hello, my name is " + this.firstName);\n  }\n};\n\nconsole.log(person.firstName); // Accessing property: "John"\nperson.age = 31; // Modifying property\nperson.greet(); // Calling a method: "Hello, my name is John"\n```\n\n**Arrays:**\nAn array is a special type of object used to store an ordered list of values. Array elements can be of any data type.\n```javascript\n// Array literal syntax\nlet colors = ["red", "green", "blue"];\nlet mixedArray = [10, "apple", true, null];\n\nconsole.log(colors[0]); // Accessing element by index: "red"\ncolors[1] = "yellow"; // Modifying element\ncolors.push("purple"); // Adding element to the end\nconsole.log(colors.length); // Getting the number of elements: 4\n\n// Iterating through an array\nfor (let i = 0; i < colors.length; i++) {\n  console.log(colors[i]);\n}\n```\nBoth objects and arrays are reference types, meaning when you assign them to another variable, you are copying a reference to the original object/array in memory, not the object/array itself.',
      },
    ],
    labs: [
      {
        slug: 'lab-2-1-variable-declaration-types',
        title: 'Variable Declaration and Types',
        description: 'Declare variables for different data types, use template literals for string formatting, and experiment with type conversion.',
        starterCode: '// Task 1: Declare variables\n// Declare a variable `studentName` and assign it your name (string).\n// Declare a variable `studentAge` and assign it your age (number).\n// Declare a variable `isEnrolled` and assign it a boolean value (true if you are learning, false otherwise).\n\n// Task 2: Use template literals\n// Create a string variable `introduction` using template literals \n// that includes studentName, studentAge, and isEnrolled.\n// Example: `My name is ${studentName}, I am ${studentAge} years old, and my enrollment status is ${isEnrolled}.`\n// Log `introduction` to the console.\n\n// Task 3: Experiment with type conversion\n// Declare a string variable `numericString` with a value like "25.5".\n// Convert `numericString` to a number and store it in `convertedNumber`. Log its type.\n// Declare a number variable `anotherNumber` with a value like 42.\n// Convert `anotherNumber` to a string and store it in `convertedString`. Log its type.',
        tasks: [
          'Declare three variables: `studentName` (string), `studentAge` (number), and `isEnrolled` (boolean). Assign them appropriate values.',
          'Create a new string variable called `introduction`. Use template literals (backticks `` ` ``) to combine the values of `studentName`, `studentAge`, and `isEnrolled` into a sentence. For example: "My name is [Name], I am [Age] years old, and my enrollment status is [true/false]."',
          'Log the `introduction` string to the console.',
          'Declare a variable `numericString` and assign it a string value that represents a number (e.g., "25.5").',
          'Convert `numericString` to an actual number using `Number()` or `parseFloat()` and store it in a new variable `convertedNumber`. Log the type of `convertedNumber` to the console using `typeof`.',
          'Declare a variable `anotherNumber` and assign it any numeric value (e.g., 42).',
          'Convert `anotherNumber` to a string using `String()` or `.toString()` and store it in `convertedString`. Log the type of `convertedString` to the console.',
        ],
        hints: [
          'Use `let` or `const` for variable declaration.',
          'Template literals are enclosed in backticks (`` ` ``) and allow embedded expressions like `${variable}`.',
          'The `typeof` operator returns a string indicating the type of its operand.',
          '`Number(value)` converts `value` to a number. `String(value)` converts `value` to a string.',
        ],
        solutionCode: '// Task 1: Declare variables\nlet studentName = "Chris Coder";\nlet studentAge = 28;\nlet isEnrolled = true;\n\n// Task 2: Use template literals\nlet introduction = `My name is ${studentName}, I am ${studentAge} years old, and my enrollment status is ${isEnrolled}.`;\nconsole.log(introduction);\n\n// Task 3: Experiment with type conversion\nlet numericString = "25.5";\nlet convertedNumber = Number(numericString);\nconsole.log(typeof convertedNumber); // Should log "number"\nconsole.log("Converted number:", convertedNumber);\n\nlet anotherNumber = 42;\nlet convertedString = String(anotherNumber);\nconsole.log(typeof convertedString); // Should log "string"\nconsole.log("Converted string:", convertedString);',
        solutionExplanation: 'The solution first declares variables for name, age, and enrollment status. It then uses a template literal to construct an introductory sentence. Finally, it demonstrates type conversion from string to number and number to string, logging the types to verify.',
        expectedOutput: "My name is Chris Coder, I am 28 years old, and my enrollment status is true.\nnumber\nConverted number: 25.5\nstring\nConverted string: 42",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-2-variables-data-types',
        title: 'Quiz 2: Variables and Data Types',
        questionsCount: 9, // Updated count
        questions: [
          {
            question: 'Which keyword is used to declare a variable in modern JavaScript that can be reassigned?',
            options: { A: 'var', B: 'let', C: 'const', D: 'static' },
            answer: 'B',
            feedback: '`let` is used for block-scoped variables that can be reassigned. `const` is for block-scoped variables that cannot be reassigned. `var` is older and function-scoped.',
          },
          {
            question: 'What is the data type of the value `true` in JavaScript?',
            options: { A: 'String', B: 'Number', C: 'Boolean', D: 'Null' },
            answer: 'C',
            feedback: '`true` and `false` are the two values of the Boolean data type, representing logical states.',
          },
          {
            question: 'Which of the following is a valid JavaScript variable name?',
            options: { A: '2myVar', B: 'my-Var', C: '$myVar', D: 'let' },
            answer: 'C',
            feedback: 'Variable names can start with a letter, underscore (`_`), or dollar sign (`$`). They cannot start with a number or be a reserved keyword. Hyphens are not allowed.',
          },
          {
            question: 'What is the result of `Number("10.5")`?',
            options: { A: '10', B: '10.5', C: 'NaN', D: '"10.5"' },
            answer: 'B',
            feedback: '`Number("10.5")` explicitly converts the string "10.5" to the number `10.5`.',
          },
          {
            question: 'How do you write a single-line comment in JavaScript?',
            options: { A: '<!-- This is a comment -->', B: '/* This is a comment */', C: '// This is a comment', D: '# This is a comment' },
            answer: 'C',
            feedback: 'Single-line comments in JavaScript start with `//`. Multi-line comments are enclosed in `/* ... */`.',
          },
          {
            question: 'What will `typeof null` return in JavaScript?',
            options: { A: '"null"', B: '"undefined"', C: '"object"', D: '"boolean"' },
            answer: 'C',
            feedback: 'This is a historical quirk in JavaScript. `typeof null` returns "object", though `null` itself is a primitive type representing no object value.',
          },
          {
            question: 'Which of these is an example of a complex data type in JavaScript?',
            options: { A: 'String', B: 'Number', C: 'Array', D: 'Boolean' },
            answer: 'C',
            feedback: 'Arrays (and Objects) are complex data types in JavaScript. Strings, Numbers, and Booleans are primitive types.',
          },
          {
            question: 'If `let x = 10;` and then `const x = 20;` is written in the same scope, what happens?',
            options: { A: 'x becomes 20.', B: 'A TypeError occurs.', C: 'A SyntaxError occurs.', D: 'x remains 10.' },
            answer: 'C',
            feedback: 'You cannot re-declare a variable defined with `let` or `const` in the same scope. This will result in a SyntaxError: "Identifier \'x\' has already been declared".'
          },
          {
            question: 'What is the value of `myVar` after this code: `let myVar;`?',
            options: { A: 'null', B: '0', C: '"" (empty string)', D: 'undefined' },
            answer: 'D',
            feedback: 'If a variable is declared using `let` or `var` without an initial value, it is automatically assigned the value `undefined`.'
          }
        ],
      },
    ],
  },
  {
    slug: 'module-3-operators-user-interaction',
    title: 'Module 3: Operators and User Interaction',
    description: 'Explore JavaScript operators for calculations and logic, and learn how to interact with users via dialog boxes.',
    lessons: [
      {
        slug: 'assignment-arithmetic-operators',
        subTitle: 'Assignment and Arithmetic Operators',
        text: '**Assignment Operator (`=`):**\nAssigns a value to a variable.\n```javascript\nlet x = 10;\nlet y = x; // y is now 10\n```\n\n**Arithmetic Operators:**\nPerform mathematical calculations.\n- `+` (Addition): `5 + 3` is `8`\n- `-` (Subtraction): `5 - 3` is `2`\n- `*` (Multiplication): `5 * 3` is `15`\n- `/` (Division): `10 / 4` is `2.5`\n- `%` (Modulus/Remainder): `10 % 3` is `1` (10 divided by 3 is 3 with a remainder of 1)\n- `**` (Exponentiation - ES2016): `2 ** 3` is `8` (2 to the power of 3)\n- `++` (Increment): Increases a number by 1. `x++` (postfix) or `++x` (prefix).\n- `--` (Decrement): Decreases a number by 1. `x--` (postfix) or `--x` (prefix).\n\n```javascript\nlet a = 5;\nlet b = 2;\nconsole.log(a + b); // 7\nconsole.log(a * b); // 10\nconsole.log(a / b); // 2.5\nconsole.log(a % b); // 1\nconsole.log(a ** b); // 25 (5*5)\n\na++; // a is now 6\nb--; // b is now 1\n```',
      },
      {
        slug: 'logical-comparison-operators',
        subTitle: 'Logical and Comparison Operators',
        text: '**Comparison Operators:**\nCompare two values and return a boolean (`true` or `false`).\n- `==` (Equal to): Checks if values are equal (performs type coercion). `5 == "5"` is `true`.\n- `===` (Strictly equal to): Checks if values AND types are equal. `5 === "5"` is `false`.\n- `!=` (Not equal to): `5 != 8` is `true`.\n- `!==` (Strictly not equal to): `5 !== "5"` is `true`.\n- `>` (Greater than): `5 > 3` is `true`.\n- `<` (Less than): `5 < 3` is `false`.\n- `>=` (Greater than or equal to): `5 >= 5` is `true`.\n- `<=` (Less than or equal to): `5 <= 3` is `false`.\n\n**Logical Operators:**\nCombine or modify boolean expressions.\n- `&&` (Logical AND): Returns `true` if both operands are `true`.\n  `true && false` is `false`.\n- `||` (Logical OR): Returns `true` if at least one operand is `true`.\n  `true || false` is `true`.\n- `!` (Logical NOT): Inverts the boolean value.\n  `!true` is `false`.\n\n```javascript\nlet age = 20;\nlet hasLicense = true;\nconsole.log(age >= 18 && hasLicense); // true\nconsole.log(age < 18 || !hasLicense); // false\n```\n**Recommendation:** Use strict equality (`===` and `!==`) to avoid unexpected behavior from type coercion.',
      },
      {
        slug: 'compound-assignments',
        subTitle: 'Compound Assignments',
        text: 'Compound assignment operators are shorthand for performing an operation and then assigning the result back to the original variable.\n\n- `+=` (Addition assignment): `x += y` is equivalent to `x = x + y`\n- `-=` (Subtraction assignment): `x -= y` is equivalent to `x = x - y`\n- `*=` (Multiplication assignment): `x *= y` is equivalent to `x = x * y`\n- `/=` (Division assignment): `x /= y` is equivalent to `x = x / y`\n- `%=` (Modulus assignment): `x %= y` is equivalent to `x = x % y`\n- `**=` (Exponentiation assignment): `x **= y` is equivalent to `x = x ** y`\n\n```javascript\nlet score = 100;\nscore += 50; // score is now 150\n\nlet price = 20;\nprice *= 0.9; // price is now 18 (10% discount)\n\nlet counter = 5;\ncounter %= 3; // counter is now 2 (remainder of 5/3)\n```\nThese operators make code more concise and often easier to read.',
      },
      {
        slug: 'special-operators',
        subTitle: 'Special Operators: typeof, instanceof, delete',
        text: '**`typeof` Operator:**\nReturns a string indicating the type of its operand.\n```javascript\nconsole.log(typeof 42);         // "number"\nconsole.log(typeof "hello");    // "string"\nconsole.log(typeof true);       // "boolean"\nconsole.log(typeof undefined);  // "undefined"\nconsole.log(typeof null);       // "object" (a known quirk in JavaScript)\nconsole.log(typeof {});         // "object"\nconsole.log(typeof []);         // "object" (arrays are a type of object)\nconsole.log(typeof function(){});// "function"\n```\n\n**`instanceof` Operator:**\nChecks if an object is an instance of a particular class or constructor function. Returns `true` or `false`.\n```javascript\nlet arr = [];\nlet date = new Date();\n\nconsole.log(arr instanceof Array);   // true\nconsole.log(date instanceof Date);   // true\nconsole.log(date instanceof Object); // true (Date inherits from Object)\nconsole.log(arr instanceof Date);    // false\n```\n\n**`delete` Operator:**\nRemoves a property from an object. It does not affect variables or functions declared with `var`, `let`, or `const` directly.\n```javascript\nlet user = { name: "Alice", age: 30 };\nconsole.log(user.age); // 30\n\ndelete user.age;\nconsole.log(user.age); // undefined\nconsole.log(user);     // { name: "Alice" }\n\nlet globalVar = 10;\ndelete globalVar; // In strict mode, this throws an error. In non-strict mode, it returns false (cannot delete non-configurable properties).\n```\nThe `delete` operator is primarily used for object properties. Using it on array elements will leave an `undefined` hole in the array, not re-index it.',
      },
      {
        slug: 'operator-precedence-associativity',
        subTitle: 'Operator Precedence and Associativity',
        text: '**Operator Precedence:**\nDetermines the order in which operators are evaluated in an expression with multiple operators. For example, multiplication and division have higher precedence than addition and subtraction.\n```javascript\nlet result = 10 + 5 * 2; // 5 * 2 is evaluated first (10), then 10 + 10\nconsole.log(result);    // Output: 20\n```\nYou can use parentheses `()` to override the default precedence and force a specific order of evaluation.\n```javascript\nlet result2 = (10 + 5) * 2; // 10 + 5 is evaluated first (15), then 15 * 2\nconsole.log(result2);     // Output: 30\n```\nRefer to the MDN documentation for a full list of JavaScript operator precedence: [MDN Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)\n\n**Operator Associativity:**\nDetermines the order in which operators of the *same precedence* are evaluated. Most operators are left-to-right associative.\n- **Left-to-right:** `a - b - c` is evaluated as `(a - b) - c`.\n- **Right-to-left:** Assignment operators (`=`, `+=`) and the exponentiation operator (`**`) are right-to-left associative.\n  `a = b = 5;` is evaluated as `a = (b = 5);` (so `b` becomes 5, then `a` becomes 5).\n  `2 ** 3 ** 2` is evaluated as `2 ** (3 ** 2)`, which is `2 ** 9 = 512` (not `(2 ** 3) ** 2 = 8 ** 2 = 64`).\n\nUnderstanding precedence and associativity is crucial for writing correct and predictable code.',
      },
      {
        slug: 'dialog-boxes',
        subTitle: 'Dialog Boxes: alert(), confirm(), prompt()',
        text: 'JavaScript provides built-in functions to create simple dialog boxes for user interaction. These are modal, meaning they block further interaction with the page until dismissed.\n\n1.  **`alert(message)`:**\n    Displays a message and an OK button.\n    ```javascript\n    alert("Welcome to our website!");\n    ```\n\n2.  **`confirm(message)`:**\n    Displays a message with an OK and a Cancel button. Returns `true` if OK is clicked, `false` if Cancel is clicked.\n    ```javascript\n    let userConfirmed = confirm("Are you sure you want to proceed?");\n    if (userConfirmed) {\n      console.log("User clicked OK.");\n    } else {\n      console.log("User clicked Cancel.");\n    }\n    ```\n\n3.  **`prompt(message, defaultValue)`:**\n    Displays a message, an input field, an OK button, and a Cancel button.\n    - Returns the text entered by the user if OK is clicked.\n    - Returns `null` if Cancel is clicked or the dialog is closed.\n    - The `defaultValue` is an optional string that will appear in the input field initially.\n    ```javascript\n    let userName = prompt("Please enter your name:", "Guest");\n    if (userName !== null && userName !== "") {\n      console.log("Hello, " + userName + "!");\n    } else {\n      console.log("User cancelled or entered no name.");\n    }\n    ```\n**Note:** While these dialogs are easy to use, they are generally considered disruptive to the user experience in modern web design. For more sophisticated user interactions, custom HTML modals or UI library components are preferred.',
      },
    ],
    labs: [
      {
        slug: 'lab-3-1-simple-calculator',
        title: 'Simple Calculator with Dialogs',
        description: 'Build a simple calculator that asks the user for two numbers and an operation, then displays the result using `alert()`.',
        starterCode: '// Task 1: Get the first number from the user\n// Use prompt() and store the result. Remember to convert it to a number!\n// let num1 = Number(prompt("Enter the first number:"));\n\n// Task 2: Get the second number from the user\n// Use prompt() and store the result. Convert to a number.\n// let num2 = ...\n\n// Task 3: Get the operation from the user\n// Use prompt() to ask for an operation (+, -, *, /).\n// let operation = prompt("Enter an operation (+, -, *, /):");\n\n// Task 4: Perform the calculation and display the result\n// Use if/else if/else statements or a switch statement to perform the correct calculation.\n// Store the result in a variable.\n// Display the result using alert(). Handle division by zero.\n\n// Example for addition:\n// if (operation === "+") {\n//   let result = num1 + num2;\n//   alert("Result: " + num1 + " + " + num2 + " = " + result);\n// }\n// Add similar blocks for -, *, /\n// Remember to handle the case where an invalid operation is entered.',
        tasks: [
          'Use `prompt()` to ask the user for the first number. Convert the input to a `Number`.',
          'Use `prompt()` to ask the user for the second number. Convert the input to a `Number`.',
          'Use `prompt()` to ask the user for an operation (e.g., "+", "-", "*", "/").',
          'Use `if`, `else if`, and `else` statements (or a `switch` statement) to check the operation entered.',
          'Based on the operation, perform the corresponding arithmetic calculation.',
          'If the operation is division, check if the second number is zero. If it is, `alert()` an error message like "Cannot divide by zero!".',
          'If the operation is valid and calculable, `alert()` the result in a user-friendly format (e.g., "Result: 5 + 3 = 8").',
          'If an invalid operation symbol is entered, `alert()` a message like "Invalid operation.".',
        ],
        hints: [
          'The `prompt()` function returns a string. Use `Number()` to convert it to a numeric type for calculations.',
          'Be careful with type coercion. `Number(prompt(...))` is safer than `prompt(...) * 1`.',
          'Use `===` for strict equality checks (e.g., `operation === "+"`).',
          'A `switch` statement can also be used to handle multiple operation choices.',
          'Consider what happens if the user clicks "Cancel" on a prompt (it returns `null`). You might want to add checks for `null` inputs.',
        ],
        solutionCode: 'let num1Str = prompt("Enter the first number:");\nlet num2Str = prompt("Enter the second number:");\n\n// Check if user cancelled any prompt\nif (num1Str === null || num2Str === null) {\n  alert("Operation cancelled.");\n} else {\n  let num1 = Number(num1Str);\n  let num2 = Number(num2Str);\n\n  // Check if conversion to number was successful\n  if (isNaN(num1) || isNaN(num2)) {\n    alert("Invalid number input.");\n  } else {\n    let operation = prompt("Enter an operation (+, -, *, /):");\n    let result;\n    let calculationString = "";\n\n    if (operation === null) {\n      alert("Operation cancelled.");\n    } else {\n        switch (operation) {\n          case "+":\n            result = num1 + num2;\n            calculationString = `${num1} + ${num2} = ${result}`;\n            break;\n          case "-":\n            result = num1 - num2;\n            calculationString = `${num1} - ${num2} = ${result}`;\n            break;\n          case "*":\n            result = num1 * num2;\n            calculationString = `${num1} * ${num2} = ${result}`;\n            break;\n          case "/":\n            if (num2 === 0) {\n              calculationString = "Error: Cannot divide by zero!";\n            } else {\n              result = num1 / num2;\n              calculationString = `${num1} / ${num2} = ${result}`;\n            }\n            break;\n          default:\n            calculationString = "Error: Invalid operation entered.";\n            break;\n        }\n        alert("Result: " + calculationString);\n    }\n  }\n}',
        solutionExplanation: 'The solution first prompts for two numbers and converts them to Numbers. It includes basic validation for `null` (if cancel is pressed) and `isNaN` (if input is not a number). Then, it prompts for an operation. A `switch` statement is used to perform the correct calculation based on the operation. Division by zero is handled. Finally, the result or an error message is displayed using `alert()`.',
        expectedOutput: 'User interaction based. Example for 5, 3, "+": Alert shows "Result: 5 + 3 = 8". Example for 10, 0, "/": Alert shows "Result: Error: Cannot divide by zero!".',
      },
    ],
    quizzes: [
      {
        slug: 'quiz-3-operators-interaction',
        title: 'Quiz 3: Operators and User Interaction',
        questionsCount: 9, // Updated count
        questions: [
          {
            question: 'What is the result of `10 % 3` in JavaScript?',
            options: { A: '3.33', B: '3', C: '1', D: '0' },
            answer: 'C',
            feedback: 'The modulus operator (`%`) returns the remainder of a division. 10 divided by 3 is 3 with a remainder of 1.',
          },
          {
            question: 'Which operator is used for strict equality (checks value and type) in JavaScript?',
            options: { A: '==', B: '===', C: '=', D: '!=' },
            answer: 'B',
            feedback: 'The triple equals (`===`) operator checks for strict equality, meaning it compares both the value and the data type without performing type coercion.',
          },
          {
            question: 'What does the `prompt("Enter your age:", "18")` function return if the user types "25" and clicks OK?',
            options: { A: 'The number 25', B: 'The string "25"', C: 'The number 18', D: 'null' },
            answer: 'B',
            feedback: 'The `prompt()` function always returns a string representing the user\'s input, or `null` if the user cancels.',
          },
          {
            question: 'What is the value of `x` after `let x = 5; x *= 2;`?',
            options: { A: '5', B: '7', C: '10', D: '2' },
            answer: 'C',
            feedback: '`x *= 2` is shorthand for `x = x * 2`. So, `x` becomes `5 * 2`, which is `10`.',
          },
          {
            question: 'Which dialog box function returns a boolean value (`true` or `false`) based on user choice?',
            options: { A: 'alert()', B: 'prompt()', C: 'confirm()', D: 'log()' },
            answer: 'C',
            feedback: 'The `confirm()` function displays a dialog with OK and Cancel buttons, returning `true` for OK and `false` for Cancel.',
          },
          {
            question: 'What is the result of the expression `!(5 > 10) && (3 < 4)`?',
            options: { A: 'true', B: 'false', C: 'undefined', D: 'Error' },
            answer: 'A',
            feedback: '`(5 > 10)` is `false`. `!(false)` is `true`. `(3 < 4)` is `true`. So the expression becomes `true && true`, which is `true`.',
          },
          {
            question: 'What does the `typeof` operator return for an array like `[1, 2, 3]`?',
            options: { A: '"array"', B: '"list"', C: '"object"', D: '"number"' },
            answer: 'C',
            feedback: 'In JavaScript, arrays are a special type of object. Therefore, `typeof [1, 2, 3]` returns `"object"`.',
          },
          {
            question: 'What is the value of `x` after `let x = 10; x++;`?',
            options: { A: '10', B: '11', C: '9', D: 'undefined' },
            answer: 'B',
            feedback: 'The postfix increment operator `x++` increments the value of `x` by 1 after its original value is used in an expression. Here, `x` becomes 11.'
          },
          {
            question: 'If `a = 5` and `b = "5"`, what is `a == b` and `a === b`?',
            options: { A: 'true, true', B: 'true, false', C: 'false, true', D: 'false, false' },
            answer: 'B',
            feedback: '`a == b` (loose equality) is `true` because type coercion converts the string "5" to the number 5. `a === b` (strict equality) is `false` because the types (number and string) are different.'
          }
        ],
      },
    ],
  },
  {
    slug: 'module-4-control-flow',
    title: 'Module 4: Control Flow – Conditionals and Loops',
    description: 'Master decision-making with `if` and `switch`, and repetitive tasks with `for` and `while` loops.',
    lessons: [
      {
        slug: 'if-else-else-if',
        subTitle: 'Conditional Statements: if, else, else if',
        text: 'Conditional statements allow your code to make decisions and execute different blocks of code based on whether a condition is true or false.\n\n- **`if` statement:** Executes a block of code if a specified condition is true.\n  ```javascript\n  let temperature = 25;\n  if (temperature > 20) {\n    console.log("It\'s a warm day!");\n  }\n  ```\n\n- **`else` statement:** Executes a block of code if the `if` condition is false.\n  ```javascript\n  let age = 16;\n  if (age >= 18) {\n    console.log("You are an adult.");\n  } else {\n    console.log("You are a minor.");\n  }\n  ```\n\n- **`else if` statement:** Allows you to test multiple conditions in sequence. If an `if` condition is false, the next `else if` condition is checked, and so on.\n  ```javascript\n  let score = 85;\n  if (score >= 90) {\n    console.log("Grade: A");\n  } else if (score >= 80) {\n    console.log("Grade: B"); // This will be executed\n  } else if (score >= 70) {\n    console.log("Grade: C");\n  } else {\n    console.log("Grade: D or F");\n  }\n  ```\nConditions are boolean expressions that evaluate to `true` or `false`.',
      },
      {
        slug: 'switch-statements',
        subTitle: 'Switch Statements',
        text: 'The `switch` statement provides an alternative way to execute different blocks of code based on the value of an expression. It\'s often used when you have multiple specific values to check against.\n\n```javascript\nlet dayOfWeek = "Monday";\n\nswitch (dayOfWeek) {\n  case "Monday":\n    console.log("Start of the work week.");\n    break; // The break statement exits the switch block.\n  case "Friday":\n    console.log("Almost weekend!");\n    break;\n  case "Saturday":\n  case "Sunday": // Multiple cases can share the same code block\n    console.log("It\'s the weekend!");\n    break;\n  default: // Optional: executes if no case matches\n    console.log("It\'s a regular day.");\n}\n```\n\n**Key points about `switch`:**\n- The expression in `switch (expression)` is evaluated once.\n- The value of the expression is compared with the values of each `case` using strict equality (`===`).\n- If a match is found, the code block associated with that `case` is executed.\n- The `break` statement is crucial. If omitted, execution will "fall through" to the next `case` block, regardless of whether its condition matches.\n- The `default` case is optional and runs if no other `case` matches.',
      },
      {
        slug: 'loops-for-while-do-while',
        subTitle: 'Loops: for, while, do...while',
        text: 'Loops are used to execute a block of code repeatedly.\n\n**1. `for` loop:**\nOften used when you know how many times you want the loop to run.\nSyntax: `for (initialization; condition; finalExpression) { // code block }`\n  - `initialization`: Executed once before the loop starts (e.g., `let i = 0`).\n  - `condition`: Evaluated before each iteration. If `true`, the loop continues.\n  - `finalExpression`: Executed at the end of each iteration (e.g., `i++`).\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log("Iteration number " + i);\n}\n// Output:\n// Iteration number 0\n// Iteration number 1\n// ...\n// Iteration number 4\n```\n\n**2. `while` loop:**\nRepeats a block of code as long as a specified condition is `true`.\n```javascript\nlet count = 0;\nwhile (count < 3) {\n  console.log("Count is " + count);\n  count++;\n}\n// Output:\n// Count is 0\n// Count is 1\n// Count is 2\n```\nEnsure the condition eventually becomes `false` to avoid an infinite loop.\n\n**3. `do...while` loop:**\nSimilar to `while`, but the code block is executed at least once before the condition is checked.\n```javascript\nlet num = 5;\ndo {\n  console.log("Number is " + num);\n  num++;\n} while (num < 5); // Condition is false, but block ran once.\n// Output: Number is 5\n```',
      },
      {
        slug: 'loops-for-of-for-in',
        subTitle: 'Loops: for...of and for...in',
        text: 'JavaScript provides other `for` loop variations for iterating over collections.\n\n**1. `for...of` loop (ES6+):**\nIterates over the values of an iterable object (like Arrays, Strings, Maps, Sets, etc.).\n```javascript\nlet colors = ["red", "green", "blue"];\nfor (let color of colors) {\n  console.log(color);\n}\n// Output:\n// red\n// green\n// blue\n\nlet message = "Hi";\nfor (let char of message) {\n  console.log(char);\n}\n// Output:\n// H\n// i\n```\nThis is generally the preferred way to iterate over the values of an array.\n\n**2. `for...in` loop:**\nIterates over the enumerable properties (keys) of an object.\n```javascript\nlet person = {\n  name: "Alice",\n  age: 30,\n  city: "New York"\n};\n\nfor (let key in person) {\n  console.log(key + ": " + person[key]);\n}\n// Output (order might vary):\n// name: Alice\n// age: 30\n// city: New York\n```\n**Caution with `for...in` for Arrays:**\nWhile you *can* use `for...in` with arrays (since arrays are objects), it iterates over array indices (as strings) and also any other enumerable properties added to the array object. This can lead to unexpected behavior. For iterating over array elements, `for...of` or a standard `for` loop with an index is generally safer and more idiomatic.',
      },
      {
        slug: 'loop-control-break-continue',
        subTitle: 'Loop Control: break and continue',
        text: '`break` and `continue` are statements that alter the normal flow of a loop.\n\n**1. `break` statement:**\nImmediately terminates the innermost loop (`for`, `while`, `do...while`, or `switch`) in which it appears. Execution continues with the statement following the terminated loop.\n```javascript\nfor (let i = 0; i < 10; i++) {\n  if (i === 5) {\n    break; // Exit the loop when i is 5\n  }\n  console.log(i);\n}\n// Output: 0, 1, 2, 3, 4\n```\n\n**2. `continue` statement:**\nSkips the remaining statements in the current iteration of the loop and proceeds to the next iteration.\n```javascript\nfor (let i = 0; i < 5; i++) {\n  if (i === 2) {\n    continue; // Skip iteration when i is 2\n  }\n  console.log(i);\n}\n// Output: 0, 1, 3, 4 (2 is skipped)\n```\n`break` and `continue` are useful for controlling loop execution based on specific conditions encountered during iteration.',
      },
    ],
    labs: [
      {
        slug: 'lab-4-1-number-properties',
        title: 'Number Properties and Loop Control',
        description: 'Write a program that takes a number (e.g., up to 20). Iterate from 1 to this number. Print whether each number is even or odd. Additionally, skip printing numbers divisible by 3, and stop the loop entirely if the number 15 is reached.',
        starterCode: 'let limit = 20; // You can change this limit to test\n\nconsole.log("Starting number analysis up to " + limit + ":");\n\nfor (let i = 1; i <= limit; i++) {\n  // Task 1: Check if the number 15 is reached to break the loop.\n  // if (i === 15) { ... }\n\n  // Task 2: Check if the number is divisible by 3 to continue to the next iteration.\n  // if (i % 3 === 0) { ... }\n\n  // Task 3: Determine if the current number `i` is even or odd.\n  let type = "";\n  // if (i % 2 === 0) { ... } else { ... }\n  \n  // Task 4: Print the number and its type (e.g., "7 is odd").\n  // console.log(i + " is " + type);\n}',
        tasks: [
          'Define a variable `limit` (e.g., set it to 20).',
          'Use a `for` loop to iterate from 1 up to `limit` (inclusive).',
          'Inside the loop, first check if the current number `i` is equal to 15. If it is, use `break` to exit the loop.',
          'Next, check if `i` is divisible by 3 (i.e., `i % 3 === 0`). If it is, use `continue` to skip the rest of the current iteration.',
          'If the loop hasn\'t broken or continued, determine if `i` is even or odd (`i % 2 === 0` for even).',
          'Print a message indicating the number and whether it\'s even or odd (e.g., "1 is odd", "2 is even").',
        ],
        hints: [
          'The `break` statement will terminate the loop immediately.',
          'The `continue` statement will skip to the next iteration.',
          'The order of your `if` conditions inside the loop matters. Think about when `break` or `continue` should happen.',
          'Use the modulus operator (`%`) to check for divisibility and even/odd.',
        ],
        solutionCode: 'let limit = 20;\n\nconsole.log("Starting number analysis up to " + limit + ":");\n\nfor (let i = 1; i <= limit; i++) {\n  if (i === 15) {\n    console.log("Loop stopped at 15.");\n    break;\n  }\n\n  if (i % 3 === 0) {\n    console.log("Skipping number divisible by 3: " + i);\n    continue;\n  }\n\n  let type = "";\n  if (i % 2 === 0) {\n    type = "even";\n  } else {\n    type = "odd";\n  }\n  console.log(i + " is " + type);\n}',
        solutionExplanation: 'The code iterates from 1 up to `limit`. It first checks if `i` is 15; if so, it prints a message and breaks. Then, it checks if `i` is divisible by 3; if so, it prints a message and continues. Otherwise, it determines if `i` is even or odd and prints the result. This demonstrates the use of `break`, `continue`, and conditional logic within a loop.',
        expectedOutput: "Starting number analysis up to 20:\n1 is odd\n2 is even\nSkipping number divisible by 3: 3\n4 is even\n5 is odd\nSkipping number divisible by 3: 6\n7 is odd\n8 is even\nSkipping number divisible by 3: 9\n10 is even\n11 is odd\nSkipping number divisible by 3: 12\n13 is odd\n14 is even\nLoop stopped at 15.",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-4-control-flow',
        title: 'Quiz 4: Control Flow',
        questionsCount: 9, // Updated count
        questions: [
          {
            question: 'Which statement is used to execute a block of code only if a condition is true?',
            options: { A: 'for', B: 'while', C: 'if', D: 'switch' },
            answer: 'C',
            feedback: 'The `if` statement is used for conditional execution based on a boolean condition.',
          },
          {
            question: 'What is the purpose of the `else` clause in an `if...else` statement?',
            options: { A: 'To specify an alternative condition to check.', B: 'To execute a block of code if the `if` condition is false.', C: 'To repeat the `if` block.', D: 'To terminate the program.' },
            answer: 'B',
            feedback: 'The `else` clause provides a block of code to be executed when the condition of the preceding `if` (or `else if`) statement is false.',
          },
          {
            question: 'Which loop is best suited for iterating a known number of times?',
            options: { A: 'while', B: 'do...while', C: 'for', D: 'for...in' },
            answer: 'C',
            feedback: 'The `for` loop (e.g., `for (let i = 0; i < 5; i++)`) is commonly used when the number of iterations is known beforehand.',
          },
          {
            question: 'What does the `break` statement do inside a loop?',
            options: { A: 'Skips the current iteration and goes to the next.', B: 'Pauses the loop.', C: 'Exits the loop entirely.', D: 'Restarts the loop.' },
            answer: 'C',
            feedback: 'The `break` statement immediately terminates the innermost loop it is in.',
          },
          {
            question: 'Which loop type guarantees that its code block will execute at least once?',
            options: { A: 'for', B: 'while', C: 'do...while', D: 'for...of' },
            answer: 'C',
            feedback: 'The `do...while` loop executes its code block once before checking the condition, ensuring at least one execution.',
          },
          {
            question: 'What is the primary use of the `for...of` loop?',
            options: { A: 'To iterate over the properties (keys) of an object.', B: 'To iterate over the values of an iterable (like an array or string).', C: 'To loop a specific number of times using a counter.', D: 'To create infinite loops.' },
            answer: 'B',
            feedback: 'The `for...of` loop is designed to iterate directly over the values of iterable objects like arrays, strings, Maps, Sets, etc.',
          },
          {
            question: 'In a `switch` statement, what is the purpose of the `break` keyword?',
            options: { A: 'To indicate the end of the switch statement.', B: 'To exit the current `case` block and prevent "fall-through" to subsequent cases.', C: 'To provide a default action if no cases match.', D: 'To compare the switch expression with case values.' },
            answer: 'B',
            feedback: 'The `break` keyword in a `switch` statement is used to terminate the execution within the switch block once a matching `case` is found and its code executed, preventing unintended execution of subsequent `case` blocks.',
          },
          {
            question: 'What will be printed by: `for (let i = 1; i <= 3; i++) { console.log(i); }`?',
            options: { A: '0 1 2', B: '1 2 3', C: '1 2', D: '0 1 2 3' },
            answer: 'B',
            feedback: 'The loop initializes `i` to 1, continues as long as `i <= 3`, and increments `i`. So it prints 1, 2, and 3.'
          },
          {
            question: 'Which keyword is used to skip the current iteration of a loop and proceed to the next?',
            options: { A: 'break', B: 'return', C: 'continue', D: 'pass' },
            answer: 'C',
            feedback: 'The `continue` statement skips the remaining code in the current loop iteration and proceeds to the next iteration.'
          }
        ],
      },
    ],
  },
  {
    slug: 'module-5-functions',
    title: 'Module 5: Functions',
    description: 'Learn to write reusable blocks of code with functions, understand scope, and explore different function types.',
    lessons: [
      {
        slug: 'declaring-calling-functions',
        subTitle: 'Declaring and Calling Functions',
        text: 'Functions are fundamental building blocks in JavaScript. They are reusable blocks of code that perform a specific task.\n\n**Declaring a Function (Function Declaration):**\nUses the `function` keyword, followed by the function name, parentheses `()` for parameters, and curly braces `{}` for the function body.\n```javascript\nfunction greet() {\n  console.log("Hello there!");\n}\n```\n\n**Calling a Function:**\nTo execute a function, you "call" or "invoke" it by its name followed by parentheses.\n```javascript\ngreet(); // Output: Hello there!\n```\n\n**Function Parameters and Arguments:**\n- **Parameters:** Variables listed in the function definition (inside the parentheses). They act as placeholders for values that will be passed to the function.\n- **Arguments:** The actual values passed to the function when it is called.\n```javascript\nfunction sayHelloTo(name) { // \'name\' is a parameter\n  console.log("Hello, " + name + "!");\n}\n\nsayHelloTo("Alice"); // "Alice" is an argument. Output: Hello, Alice!\nsayHelloTo("Bob");   // "Bob" is an argument. Output: Hello, Bob!\n```\n\n**The `return` Statement:**\nFunctions can return a value back to the caller using the `return` statement. If a function doesn\'t have a `return` statement, or has a `return` statement without a value, it implicitly returns `undefined`.\n```javascript\nfunction add(num1, num2) {\n  return num1 + num2; // Returns the sum\n}\n\nlet sum = add(5, 3);\nconsole.log(sum); // Output: 8\n\nfunction doNothing() {\n  // No return statement\n}\nlet result = doNothing();\nconsole.log(result); // Output: undefined\n```\nOnce a `return` statement is executed, the function immediately stops executing.',
      },
      {
        slug: 'function-scope',
        subTitle: 'Parameters, Return Values, Local vs. Global Variables (Scope)',
        text: '**Parameters & Arguments (Recap):**\nParameters are placeholders in the function definition. Arguments are the actual values supplied during the function call.\n\n**Return Values (Recap):**\nThe `return` statement specifies the value a function sends back to its caller. A function can only return one value, but this value can be an array or an object, allowing you to effectively return multiple pieces of data.\n\n**Scope:**\nScope determines the accessibility (visibility) of variables.\n\n- **Global Scope:** Variables declared outside of any function are in the global scope. They can be accessed from anywhere in your JavaScript code, including inside functions.\n  ```javascript\n  let globalVar = "I am global";\n\n  function showGlobal() {\n    console.log(globalVar);\n  }\n  showGlobal(); // Output: I am global\n  ```\n\n- **Local Scope (Function Scope):** Variables declared inside a function (using `let`, `const`, or `var`) are in the local scope of that function. They can only be accessed from within that function.\n  ```javascript\n  function myLocalScope() {\n    let localVar = "I am local";\n    console.log(localVar);\n  }\n\n  myLocalScope(); // Output: I am local\n  // console.log(localVar); // Error: localVar is not defined (outside its scope)\n  ```\n\n- **Block Scope (ES6+ with `let` and `const`):**\n  Variables declared with `let` and `const` inside a block (e.g., within `{}` of an `if` statement or a `for` loop) are scoped to that block. They are not accessible outside that block.\n  ```javascript\n  if (true) {\n    let blockVar = "I am block-scoped";\n    console.log(blockVar);\n  }\n  // console.log(blockVar); // Error: blockVar is not defined\n  ```\nUnderstanding scope is crucial for avoiding naming conflicts and managing your program\'s data effectively. Generally, it\'s good practice to limit the scope of your variables as much as possible.',
      },
      {
        slug: 'function-expressions-arrow-functions',
        subTitle: 'Function Expressions and Arrow Functions',
        text: '**Function Expression:**\nA function can also be defined as an expression and assigned to a variable. This is called a function expression.\n```javascript\n// Function expression\nconst multiply = function(a, b) {\n  return a * b;\n};\n\nlet product = multiply(4, 5);\nconsole.log(product); // Output: 20\n```\nFunction expressions are not hoisted in the same way as function declarations, meaning you must define them before you can call them.\n\n**Arrow Functions (ES6+):**\nArrow functions provide a more concise syntax for writing function expressions. They are especially useful for simple, one-line functions.\n\nBasic Syntax:\n`(param1, param2, ..., paramN) => expression` (implicitly returns `expression`)\nOr for multiple statements:\n`(param1, param2, ..., paramN) => {\n  // statements\n  return value; // Explicit return needed for multi-line blocks\n}`\n\nExamples:\n```javascript\n// Traditional function expression\nconst addOld = function(a, b) {\n  return a + b;\n};\n\n// Arrow function (concise body, implicit return)\nconst addArrow = (a, b) => a + b;\n\nconsole.log(addArrow(3, 7)); // Output: 10\n\n// Arrow function with multiple statements (explicit return)\nconst greetArrow = (name) => {\n  let message = "Hello, " + name;\n  return message;\n};\nconsole.log(greetArrow("Developer")); // Output: Hello, Developer\n\n// Arrow function with no parameters\nconst sayHi = () => console.log("Hi!");\nsayHi(); // Output: Hi!\n\n// Arrow function with one parameter (parentheses optional)\nconst double = x => x * 2;\nconsole.log(double(5)); // Output: 10\n```\n\n**Key differences with traditional functions:**\n- **`this` keyword binding:** Arrow functions do not have their own `this` context. They inherit `this` from the surrounding (lexical) scope. This is a significant difference and often beneficial in callbacks and methods.\n- **No `arguments` object:** Arrow functions do not have their own `arguments` object. You can use rest parameters (`...args`) instead.\n- Cannot be used as constructors (cannot be called with `new`).',
      },
      {
        slug: 'callback-functions',
        subTitle: 'Callback Functions',
        text: 'A callback function is a function passed into another function as an argument, which is then invoked (called back) inside the outer function to complete some kind of routine or action.\nCallbacks are fundamental to asynchronous programming in JavaScript (like handling responses from server requests, timers, or user events).\n\n**Synchronous Callback Example:**\n```javascript\nfunction processArray(arr, callback) {\n  let newArray = [];\n  for (let i = 0; i < arr.length; i++) {\n    newArray.push(callback(arr[i]));\n  }\n  return newArray;\n}\n\nlet numbers = [1, 2, 3, 4];\n\nfunction double(num) {\n  return num * 2;\n}\n\nfunction square(num) {\n  return num * num;\n}\n\nlet doubledNumbers = processArray(numbers, double);\nconsole.log(doubledNumbers); // Output: [2, 4, 6, 8]\n\nlet squaredNumbers = processArray(numbers, square);\nconsole.log(squaredNumbers); // Output: [1, 4, 9, 16]\n\n// Using an anonymous function as a callback\nlet incrementedNumbers = processArray(numbers, function(num) {\n  return num + 1;\n});\nconsole.log(incrementedNumbers); // Output: [2, 3, 4, 5]\n\n// Using an arrow function as a callback\nlet decrementedNumbers = processArray(numbers, num => num - 1);\nconsole.log(decrementedNumbers); // Output: [0, 1, 2, 3]\n```\nMany built-in JavaScript methods, especially for arrays, use callbacks (e.g., `forEach`, `map`, `filter`, `reduce`).',
      },
      {
        slug: 'recursion-basics',
        subTitle: 'Recursion: Understanding and Writing Basic Recursive Functions',
        text: 'Recursion is a programming technique where a function calls itself in order to solve a problem.\nA recursive function typically has two parts:\n\n1.  **Base Case:** A condition that stops the recursion. Without a base case, a recursive function would call itself indefinitely, leading to a stack overflow error.\n2.  **Recursive Step:** The part of the function where it calls itself with a modified argument, moving closer to the base case.\n\n**Example: Factorial**\nThe factorial of a non-negative integer `n`, denoted by `n!`, is the product of all positive integers less than or equal to `n`.\n`5! = 5 * 4 * 3 * 2 * 1 = 120`\n`0! = 1` (by definition)\n\n```javascript\nfunction factorial(n) {\n  // Base case: if n is 0 or 1, factorial is 1\n  if (n === 0 || n === 1) {\n    return 1;\n  }\n  // Recursive step: n * factorial of (n-1)\n  else {\n    return n * factorial(n - 1);\n  }\n}\n\nconsole.log(factorial(5)); // Output: 120\nconsole.log(factorial(0)); // Output: 1\n```\n\n**How `factorial(3)` works:**\n1. `factorial(3)` calls `3 * factorial(2)`\n2. `factorial(2)` calls `2 * factorial(1)`\n3. `factorial(1)` hits the base case and returns `1`.\n4. Back to `factorial(2)`, it returns `2 * 1 = 2`.\n5. Back to `factorial(3)`, it returns `3 * 2 = 6`.\n\nRecursion can be elegant for problems that can be broken down into smaller, self-similar subproblems (e.g., traversing tree structures, some sorting algorithms). However, it can sometimes be less efficient than iterative solutions due to function call overhead.',
      },
      {
        slug: 'timing-events-settimeout-setinterval',
        subTitle: 'Timing: setTimeout() and setInterval()',
        text: 'JavaScript provides built-in functions to execute code after a specified time delay or at regular intervals.\n\n**1. `setTimeout(callbackFunction, delayInMilliseconds, arg1, arg2, ...)`:**\nExecutes `callbackFunction` once after the `delayInMilliseconds` has passed. Any additional arguments (`arg1`, `arg2`, etc.) are passed to the callback function.\n`setTimeout` returns a timer ID, which can be used with `clearTimeout()` to cancel the timer before it executes.\n\n```javascript\nfunction greetLater() {\n  console.log("Hello after 2 seconds!");\n}\n\nlet timerId = setTimeout(greetLater, 2000); // 2000 milliseconds = 2 seconds\n\n// To cancel:\n// clearTimeout(timerId);\n\n// Using an anonymous function and arguments:\nsetTimeout(function(name) {\n  console.log("Hello, " + name + ", after 3 seconds!");\n}, 3000, "Developer");\n```\n\n**2. `setInterval(callbackFunction, intervalInMilliseconds, arg1, arg2, ...)`:**\nRepeatedly executes `callbackFunction` with a fixed time `intervalInMilliseconds` between each call.\n`setInterval` also returns a timer ID, which can be used with `clearInterval()` to stop the repeated execution.\n\n```javascript\nlet count = 0;\nfunction showCount() {\n  count++;\n  console.log("Count: " + count);\n  if (count >= 5) {\n    clearInterval(intervalId); // Stop after 5 executions\n    console.log("Interval stopped.");\n  }\n}\n\nlet intervalId = setInterval(showCount, 1000); // Execute every 1 second\n```\n\nBoth `setTimeout` and `setInterval` are asynchronous, meaning they don\'t block the execution of other JavaScript code. The JavaScript engine schedules the callback to run after the delay/interval, but continues processing other tasks in the meantime.',
      },
    ],
    labs: [
      {
        slug: 'lab-5-1-greeting-and-factorial',
        title: 'Greeting Function, Factorial, and Timed Message',
        description: 'Practice creating different types of functions: a simple greeting, a recursive factorial, and a timed message using `setTimeout`.',
        starterCode: '// Task 1: greetUser(name) function\n// Define a function called greetUser that takes one parameter `name`.\n// The function should log "Hello, [name]! Welcome." to the console.\n// Call the function with your name.\n\nfunction greetUser(name) {\n  // Your code here\n}\n// greetUser("YourName");\n\n// Task 2: Factorial function (recursive)\n// Define a function `factorial(n)` that calculates the factorial of n using recursion.\n// Base case: if n is 0 or 1, return 1.\n// Recursive step: return n * factorial(n - 1).\n// Log factorial(5) to the console.\n\nfunction factorial(n) {\n  // Your code here\n}\n// console.log("Factorial of 5:", factorial(5));\n\n// Task 3: Timed message\n// Use setTimeout to log "This message appears after 3 seconds!" to the console after a 3-second delay.\n\n// setTimeout(function() {\n  // Your code here\n// }, 3000);',
        tasks: [
          'Create a function `greetUser(name)` that takes a `name` as a parameter and logs a personalized greeting (e.g., "Hello, [name]! Welcome.") to the console. Call this function with your own name.',
          'Create a recursive function `factorial(n)` that calculates the factorial of a non-negative integer `n`. Remember the base case (factorial of 0 or 1 is 1) and the recursive step (`n * factorial(n-1)`). Log the result of `factorial(5)` to the console.',
          'Use `setTimeout` to schedule a function that logs the message "This message appears after 3 seconds!" to the console. The message should appear 3000 milliseconds (3 seconds) after the script starts running.',
        ],
        hints: [
          'For `greetUser`, use string concatenation or template literals for the message.',
          'For `factorial`, ensure your base case `(n === 0 || n === 1)` correctly returns 1 to stop the recursion.',
          '`setTimeout` takes a callback function as its first argument and the delay in milliseconds as the second.',
        ],
        solutionCode: '// Task 1: greetUser(name) function\nfunction greetUser(name) {\n  console.log(`Hello, ${name}! Welcome.`);\n}\ngreetUser("Alex");\n\n// Task 2: Factorial function (recursive)\nfunction factorial(n) {\n  if (n < 0) {\n    return "Factorial not defined for negative numbers"; // Optional: Handle negative input\n  }\n  if (n === 0 || n === 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\nconsole.log("Factorial of 5:", factorial(5));\n\n// Task 3: Timed message\nsetTimeout(function() {\n  console.log("This message appears after 3 seconds!");\n}, 3000);',
        solutionExplanation: '1. `greetUser` takes a name and logs a greeting. 2. `factorial` uses recursion: if n is 0 or 1, it returns 1; otherwise, it returns n times factorial of n-1. It also includes an optional check for negative numbers. 3. `setTimeout` is used with an anonymous function to log a message after a 3000ms delay.',
        expectedOutput: "Hello, Alex! Welcome.\nFactorial of 5: 120\n(After 3 seconds) This message appears after 3 seconds!",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-5-functions',
        title: 'Quiz 5: Functions',
        questionsCount: 9, // Updated count
        questions: [
          {
            question: 'How do you declare a basic function in JavaScript?',
            options: { A: '`function = myFunction() {}`', B: '`def myFunction() {}`', C: '`function myFunction() {}`', D: '`myFunction: function() {}`' },
            answer: 'C',
            feedback: 'A standard function declaration uses the `function` keyword, followed by the function name, parentheses for parameters, and curly braces for the body: `function myFunction() {}`.',
          },
          {
            question: 'What is a "parameter" in the context of a function?',
            options: { A: 'The value returned by the function.', B: 'A variable declared inside the function.', C: 'A placeholder for a value that a function expects to receive when it is called.', D: 'The actual value passed to a function when it is called.' },
            answer: 'C',
            feedback: 'Parameters are variables listed in a function\'s definition. They act as placeholders for the arguments that will be passed in when the function is invoked.',
          },
          {
            question: 'What does a function return by default if it does not have an explicit `return` statement or `return;`?',
            options: { A: '`null`', B: '`0`', C: '`false`', D: '`undefined`' },
            answer: 'D',
            feedback: 'If a function does not explicitly return a value, it implicitly returns `undefined`.',
          },
          {
            question: 'What is the key characteristic of an arrow function `() => ...` compared to a traditional function expression regarding the `this` keyword?',
            options: { A: 'Arrow functions have their own `this` bound to the global object.', B: 'Arrow functions do not have their own `this`; they inherit it from the surrounding lexical scope.', C: 'Arrow functions always bind `this` to the object that called them.', D: 'Arrow functions require `this` to be explicitly passed as an argument.' },
            answer: 'B',
            feedback: 'Arrow functions do not have their own `this` context. Instead, `this` is lexically bound, meaning it takes the `this` value of its enclosing scope.',
          },
          {
            question: 'What is a callback function?',
            options: { A: 'A function that calls another function.', B: 'A function that is passed as an argument to another function and is executed later.', C: 'A function that can only be called once.', D: 'A built-in JavaScript function for handling errors.' },
            answer: 'B',
            feedback: 'A callback function is a function that is passed as an argument to another function, with the intention of being "called back" (executed) at a later point in time, often after an asynchronous operation or event.',
          },
          {
            question: 'What is the primary purpose of a "base case" in a recursive function?',
            options: { A: 'To initialize the recursive function.', B: 'To perform the main calculation step.', C: 'To provide a condition that stops the recursion.', D: 'To call the function recursively.' },
            answer: 'C',
            feedback: 'The base case in a recursive function is a condition that, when met, stops further recursive calls, preventing an infinite loop and providing a terminating point for the recursion.',
          },
          {
            question: 'Which timing function is used to execute a piece of code repeatedly at a specified interval?',
            options: { A: '`setTimeout()`', B: '`setInterval()`', C: '`requestAnimationFrame()`', D: '`delay()`' },
            answer: 'B',
            feedback: '`setInterval(callback, delay)` is used to repeatedly call the `callback` function every `delay` milliseconds until `clearInterval()` is called.',
          },
          {
            question: 'Which syntax is used for an arrow function that takes no parameters and implicitly returns the string "Hello"?',
            options: { A: '`=> "Hello"`', B: '`() => "Hello"`', C: '`function() => "Hello"`', D: '`void => "Hello"`' },
            answer: 'B',
            feedback: 'An arrow function with no parameters uses empty parentheses `()`, followed by `=>` and the expression to be returned (if it\'s a concise body). `() => "Hello"` is correct.'
          },
          {
            question: 'What is the value of `x` after the following code? `function test() { let x = 10; } test();`',
            options: { A: '10', B: 'undefined', C: 'Error: x is not defined', D: 'null' },
            answer: 'C',
            feedback: '`x` is declared with `let` inside the `test` function, so it has local scope. It is not accessible outside the function, leading to a ReferenceError if you try to access `x` globally after `test()` is called.'
          }
        ],
      },
    ],
  },
  {
    slug: 'module-6-errors-debugging',
    title: 'Module 6: Errors, Debugging, and Troubleshooting',
    description: 'Learn about different types of errors in JavaScript, how to handle them, and common debugging techniques.',
    lessons: [
      {
        slug: 'error-types-syntax-runtime-logical',
        subTitle: 'Syntax vs. Runtime vs. Logical Errors',
        text: 'Understanding different types of errors is key to effective debugging.\n\n1.  **Syntax Errors:**\n    - Occur when your code violates the grammatical rules of JavaScript.\n    - The JavaScript engine cannot parse or understand the code.\n    - These errors are usually caught before the code even starts running (during the parsing phase).\n    - Examples: Missing parentheses, misspelled keywords, incorrect operator usage.\n    ```javascript\n    // let x = 5; // Correct\n    // lt x = 5;  // SyntaxError: Unexpected identifier (misspelled \'let\')\n    // console.log("Hello); // SyntaxError: Invalid or unexpected token (missing closing quote)\n    ```\n\n2.  **Runtime Errors (Exceptions):**\n    - Occur while the script is executing, after successful parsing.\n    - Happen when the engine encounters an operation that it cannot perform.\n    - Examples: Trying to call a method on an `undefined` variable, dividing by zero (though JS returns `Infinity`), accessing a property of `null`.\n    ```javascript\n    let user = null;\n    // console.log(user.name); // TypeError: Cannot read properties of null (reading \'name\')\n\n    let y;\n    // y.toUpperCase(); // TypeError: Cannot read properties of undefined (reading \'toUpperCase\')\n    ```\n\n3.  **Logical Errors:**\n    - The code is syntactically correct and runs without crashing, but it does not produce the intended or expected result.\n    - These are often the hardest to find because the JavaScript engine doesn\'t report them as errors.\n    - Requires careful testing, debugging, and understanding of the problem domain to identify.\n    ```javascript\n    // Intention: Calculate average of two numbers\n    let num1 = 10;\n    let num2 = 5;\n    let average = num1 + num2 / 2; // Logical error: division happens before addition due to precedence\n    console.log(average); // Output: 12.5 (Expected: 7.5 if (num1+num2)/2 )\n    ```',
      },
      {
        slug: 'common-js-exception-types',
        subTitle: 'Common JS Exception Types',
        text: 'JavaScript has several built-in error object types that are thrown when runtime errors occur.\n\n- **`SyntaxError`:** An error in the code\'s syntax. Usually caught during parsing.\n  Example: `let x = 5y;`\n\n- **`ReferenceError`:** Thrown when trying to access a variable that has not been declared or is not in scope.\n  Example: `console.log(undeclaredVariable);`\n\n- **`TypeError`:** Thrown when an operation cannot be performed, typically when a value is not of the expected type.\n  Examples:\n  - Calling something that is not a function: `let x = 10; x();`\n  - Accessing properties of `null` or `undefined`: `let obj = null; obj.property;`\n  - Using an operator on an incompatible type: `(10).split(\'\');`\n\n- **`RangeError`:** Thrown when a numeric variable or parameter is outside of its valid range.\n  Examples:\n  - `new Array(-1)` (Array length cannot be negative)\n  - `(10).toFixed(101)` (Number of digits for `toFixed` is out of range 0-100)\n\n- **`URIError`:** Thrown when a global URI handling function (like `encodeURIComponent()`, `decodeURI()`) was used in a way that is incompatible with its definition.\n\n- **`Error` (Generic):** A base type for all errors. Sometimes generic errors are thrown, or custom errors inherit from this.\n\nUnderstanding these common error types helps you quickly identify the nature of a problem when it appears in the console.',
      },
      {
        slug: 'error-handling-try-catch-finally-throw',
        subTitle: 'Handling Errors: try, catch, finally, throw',
        text: 'JavaScript provides mechanisms to gracefully handle runtime errors (exceptions) and prevent your program from crashing.\n\n**1. `try...catch` statement:**\n   - The `try` block contains code that might throw an error.\n   - If an error occurs within the `try` block, execution immediately jumps to the `catch` block.\n   - The `catch` block receives an error object (often named `e` or `error`) containing information about the error.\n   ```javascript\n   try {\n     let result = some riskyOperation();\n     console.log(result);\n   } catch (error) {\n     console.error("An error occurred: " + error.message);\n     // You can also log error.name or error.stack for more details\n   }\n   console.log("Execution continues after try...catch.");\n   ```\n\n**2. `try...catch...finally` statement:**\n   - The `finally` block executes after the `try` and `catch` blocks, regardless of whether an error occurred or was caught.\n   - It\'s often used for cleanup code (e.g., closing files, releasing resources).\n   ```javascript\n   try {\n     console.log("Attempting operation...");\n     // potentiallyErrorProneCode();\n     console.log("Operation successful (or no error thrown).");\n   } catch (e) {\n     console.error("Error caught: " + e.message);\n   } finally {\n     console.log("Finally block executed - cleanup tasks here.");\n   }\n   ```\n\n**3. `throw` statement:**\n   Allows you to create and throw your own custom errors or re-throw existing ones.\n   You can throw any expression, but it\'s common to throw `Error` objects or instances of custom error classes derived from `Error`.\n   ```javascript\n   function validateAge(age) {\n     if (typeof age !== \'number\') {\n       throw new TypeError("Age must be a number.");\n     }\n     if (age < 0) {\n       throw new RangeError("Age cannot be negative.");\n     }\n     console.log("Age is valid: " + age);\n   }\n\n   try {\n     validateAge(25);\n     validateAge(-5);\n   } catch (e) {\n     console.error(e.name + ": " + e.message);\n   }\n   // Output for validateAge(-5) -> RangeError: Age cannot be negative.\n   ```',
      },
      {
        slug: 'custom-error-messages',
        subTitle: 'Custom Error Messages',
        text: 'When you `throw` an error, you can provide custom messages to make debugging easier and give more specific feedback to users or other developers.\n\n**Throwing a string (simple, but less informative):**\n```javascript\nfunction checkValue(value) {\n  if (value > 100) {\n    throw "Value exceeds maximum limit of 100!";\n  }\n  return value;\n}\n\ntry {\n  checkValue(150);\n} catch (e) {\n  console.error(e); // Output: Value exceeds maximum limit of 100!\n}\n```\n\n**Throwing an `Error` object (recommended):**\nUsing the built-in `Error` constructor (or specific error types like `TypeError`, `RangeError`) is better because these objects have standard properties like `name` and `message`, and often a `stack` trace.\n```javascript\nfunction processData(data) {\n  if (!data || typeof data.id === \'undefined\') {\n    throw new Error("Invalid data object: \'id\' property is missing.");\n  }\n  console.log("Processing data ID: " + data.id);\n}\n\ntry {\n  processData({ name: "Test" });\n} catch (e) {\n  console.error("Error Name: " + e.name);\n  console.error("Error Message: " + e.message);\n  // console.error("Stack Trace: " + e.stack);\n}\n// Output:\n// Error Name: Error\n// Error Message: Invalid data object: \'id\' property is missing.\n```\n\n**Creating Custom Error Classes (Advanced):**\nFor more complex applications, you can create your own error classes by extending the built-in `Error` class. This allows you to define specific types of errors relevant to your application domain.\n```javascript\nclass NetworkError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = "NetworkError";\n  }\n}\n\ntry {\n  // Simulate a network issue\n  throw new NetworkError("Failed to connect to the server.");\n} catch (e) {\n  if (e instanceof NetworkError) {\n    console.warn("Network issue detected: " + e.message);\n  } else {\n    console.error("An unexpected error occurred: " + e.message);\n  }\n}\n```\nCustom errors improve code organization and allow for more specific `catch` blocks.',
      },
      {
        slug: 'debugging-tips',
        subTitle: 'Debugging Tips: Breakpoints, Logging, `debugger`',
        text: 'Debugging is the process of finding and fixing errors in your code.\n\n1.  **`console.log()` (and related methods):**\n    - The simplest debugging tool. Insert `console.log()` statements at various points in your code to inspect variable values, check execution flow, or confirm if a piece of code is being reached.\n    - Other console methods: `console.error()`, `console.warn()`, `console.info()`, `console.table()` (for arrays/objects), `console.trace()`.\n    ```javascript\n    function calculate(a, b) {\n      console.log("Calculating with a:", a, "and b:", b);\n      let result = a * b;\n      console.log("Result:", result);\n      return result;\n    }\n    ```\n\n2.  **Browser Developer Tools Debugger (Breakpoints):**\n    - Modern browsers have powerful built-in debuggers (usually in the "Sources" or "Debugger" tab of Developer Tools).\n    - **Breakpoints:** You can set breakpoints on specific lines of your code. When the JavaScript engine reaches a breakpoint, it pauses execution, allowing you to:\n      - Inspect the values of variables in the current scope.\n      - Step through the code line by line (`Step Over`, `Step Into`, `Step Out`).\n      - Examine the call stack (the sequence of function calls that led to the current point).\n      - Watch expressions (monitor the value of specific expressions as you step).\n    - To set a breakpoint, open your script in the Sources panel and click on the line number.\n\n3.  **`debugger;` statement:**\n    - You can insert the `debugger;` statement directly into your JavaScript code.\n    - If the browser\'s developer tools are open, execution will pause at this statement as if a breakpoint was set there.\n    ```javascript\n    function complexLogic(data) {\n      // ... some code ...\n      debugger; // Execution will pause here if DevTools are open\n      // ... more code ...\n    }\n    ```\n\n4.  **Understand Error Messages:**\n    - Pay close attention to error messages in the console. They usually provide the error type (e.g., `TypeError`), a description, and the file name and line number where the error occurred.\n\n5.  **Rubber Duck Debugging:**\n    - Explain your code, line by line, to someone else or even to an inanimate object (like a rubber duck). Often, the act of verbalizing the logic helps you spot the error yourself.\n\n6.  **Simplify and Isolate:**\n    - If you have a complex bug, try to simplify the code or create a minimal reproducible example that still exhibits the bug. This makes it easier to pinpoint the source of the problem.',
      },
    ],
    labs: [
      {
        slug: 'lab-6-1-error-handling-debugging',
        title: 'Error Handling and Debugging Practice',
        description: 'Practice using `try...catch` to handle potential errors and use `console.log` or the `debugger` statement to inspect code.',
        starterCode: '// Task 1: Error Prone Division\nfunction divideNumbers(numerator, denominator) {\n  // TODO: Add a try...catch block here.\n  // Inside try: perform division. If denominator is 0, this will throw an error.\n  // Inside catch: log a user-friendly error message like "Error: Cannot divide by zero."\n  // If no error, log the result.\n\n  // Remove this line after implementing try...catch\n  if (denominator === 0) {\n    console.error("Error: Attempted to divide by zero without try...catch.");\n    return;\n  }\n  let result = numerator / denominator;\n  console.log(`Result of ${numerator}/${denominator} = ${result}`);\n}\n\ndivideNumbers(10, 2);\ndivideNumbers(10, 0); // This should be handled by your try...catch\n\nconsole.log("\\n--- Task 2: Debugging with console.log ---\\n");\n// Task 2: Debugging a Loop\n// The function below is supposed to sum numbers from 1 to limit (inclusive)\n// but it has a logical error. Use console.log to find and fix it.\nfunction sumUpTo(limit) {\n  let total = 0;\n  for (let i = 0; i <= limit; i++) { // Potential off-by-one or starting point issue?\n    // Add console.log here to inspect \'i\' and \'total\' in each iteration\n    total = i; // This is the logical error: it should be total += i;\n  }\n  return total;\n}\n\nlet sumResult = sumUpTo(3); // Expected: 1+2+3 = 6\nconsole.log("Sum up to 3 (buggy):", sumResult);\n\n// Corrected function (for reference, make your fix in the original sumUpTo)\n/*\nfunction correctedSumUpTo(limit) {\n  let total = 0;\n  for (let i = 1; i <= limit; i++) { // Corrected loop start\n    console.log(`Iteration: i=${i}, current total=${total}`);\n    total += i; // Corrected summation\n  }\n  return total;\n}\nlet correctSum = correctedSumUpTo(3);\nconsole.log("Sum up to 3 (corrected):", correctSum);\n*/\n\nconsole.log("\\n--- Task 3: Using debugger (Optional) ---\\n");\n// Task 3 (Optional): Using the debugger statement\n// Uncomment the function below. Place the `debugger;` statement inside the loop.\n// Run this in your browser with Developer Tools open to see execution pause.\n/*\nfunction debugExample(items) {\n  for (let i = 0; i < items.length; i++) {\n    let item = items[i];\n    // Place debugger; statement here\n    console.log("Processing item:", item);\n  }\n}\ndebugExample([\'apple\', \'banana\', \'cherry\']);\n*/',
        tasks: [
          '**Task 1 (Error Handling):** Modify the `divideNumbers` function. Wrap the division operation (`numerator / denominator`) in a `try` block. Add a `catch` block that catches any error. Inside the `catch` block, `console.error()` a user-friendly message like "Error: Cannot divide by zero." or "An error occurred during division: [error message]". If the division is successful (no error), `console.log()` the result as it currently does.',
          '**Task 2 (Debugging with `console.log`):** The `sumUpTo` function has a logical error. It\'s supposed to sum numbers from 1 up to `limit`. Add `console.log()` statements inside its `for` loop to inspect the values of `i` and `total` during each iteration. Identify the bug and fix it so it correctly calculates the sum. (Hint: The loop condition and the summation logic `total = i` are areas to inspect).',
          '**Task 3 (Optional - Using `debugger;`):** Uncomment the `debugExample` function. Place a `debugger;` statement inside its `for` loop. If you run this code in a browser with the Developer Tools open, the script execution should pause at the `debugger;` statement, allowing you to inspect variables and step through the code.',
        ],
        hints: [
          'For `try...catch`, the error object in `catch(e)` has a `message` property (e.g., `e.message`).',
          'In `sumUpTo`, think about how a sum accumulates. Should `total` be reset in each loop, or added to?',
          'The `debugger;` statement only has an effect if your browser\'s developer tools are open when the script runs.',
        ],
        solutionCode: '// Task 1: Error Prone Division\nfunction divideNumbers(numerator, denominator) {\n  try {\n    if (denominator === 0) {\n      // Manually throw an error for division by zero for clearer catch handling\n      throw new Error("Cannot divide by zero explicitly.");\n    }\n    let result = numerator / denominator;\n    console.log(`Result of ${numerator}/${denominator} = ${result}`);\n  } catch (error) {\n    console.error("An error occurred during division: " + error.message);\n  }\n}\n\ndivideNumbers(10, 2);\ndivideNumbers(10, 0);\n\nconsole.log("\\n--- Task 2: Debugging with console.log ---\\n");\n// Task 2: Debugging a Loop\nfunction sumUpTo(limit) {\n  let total = 0;\n  // Corrected loop to start from 1, and correctly add to total\n  for (let i = 1; i <= limit; i++) { \n    // console.log(`Before sum: i=${i}, total=${total}`); // Debug log\n    total += i; // Corrected logic\n    // console.log(`After sum: i=${i}, total=${total}`); // Debug log\n  }\n  return total;\n}\n\nlet sumResult = sumUpTo(3);\nconsole.log("Sum up to 3 (fixed):", sumResult); // Expected: 6\n\nconsole.log("\\n--- Task 3: Using debugger (Optional) ---\\n");\n// Task 3 (Optional): Using the debugger statement\n/*\nfunction debugExample(items) {\n  for (let i = 0; i < items.length; i++) {\n    let item = items[i];\n    debugger; // Execution will pause here if DevTools are open\n    console.log("Processing item:", item);\n  }\n}\ndebugExample([\'apple\', \'banana\', \'cherry\']);\n*/\nconsole.log("Lab complete. Uncomment Task 3 and run with DevTools open to test debugger.");',
        solutionExplanation: '1. `divideNumbers` now uses `try...catch`. It explicitly throws an error if `denominator` is 0 to ensure the `catch` block handles it. 2. `sumUpTo` is corrected: the loop now starts from `i = 1` and correctly uses `total += i` to accumulate the sum. Debug `console.log` statements (commented out in solution) can be used to trace values. 3. Task 3 provides an example of using `debugger;`.',
        expectedOutput: "Result of 10/2 = 5\nAn error occurred during division: Cannot divide by zero explicitly.\n\n--- Task 2: Debugging with console.log ---\nSum up to 3 (fixed): 6\n\n--- Task 3: Using debugger (Optional) ---\nLab complete. Uncomment Task 3 and run with DevTools open to test debugger.",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-6-errors-debugging',
        title: 'Quiz 6: Errors and Debugging',
        questionsCount: 9, // Updated count
        questions: [
          {
            question: 'Which type of error occurs when code violates the grammatical rules of JavaScript, preventing it from being parsed?',
            options: { A: 'Runtime Error', B: 'Logical Error', C: 'Syntax Error', D: 'Network Error' },
            answer: 'C',
            feedback: 'Syntax errors occur when the code is not written according to the rules of the JavaScript language, so the engine cannot even understand (parse) it.',
          },
          {
            question: 'A `ReferenceError` is typically thrown when...',
            options: { A: 'A function is called with the wrong type of arguments.', B: 'Code attempts to use a variable that has not been declared.', C: 'A number is divided by zero.', D: 'There is an error in the logical flow of the program.' },
            answer: 'B',
            feedback: '`ReferenceError` occurs when you try to use a variable or function that hasn\'t been declared or is not accessible in the current scope.',
          },
          {
            question: 'What is the purpose of the `try` block in a `try...catch` statement?',
            options: { A: 'To define the error handling code.', B: 'To contain the code that might potentially throw an error.', C: 'To always execute, regardless of errors.', D: 'To throw a custom error.' },
            answer: 'B',
            feedback: 'The `try` block encloses the code that is suspected of potentially causing an error during runtime.',
          },
          {
            question: 'Which block in a `try...catch...finally` statement is executed regardless of whether an error occurred or was caught?',
            options: { A: '`try`', B: '`catch`', C: '`finally`', D: '`else` (not part of try...catch...finally)' },
            answer: 'C',
            feedback: 'The `finally` block always executes after the `try` and any `catch` blocks, making it suitable for cleanup code that must run.',
          },
          {
            question: 'What does the `debugger;` statement do in JavaScript when developer tools are open?',
            options: { A: 'It logs a debug message to the console.', B: 'It fixes common bugs automatically.', C: 'It causes the script execution to pause, acting like a breakpoint.', D: 'It reloads the current page.' },
            answer: 'C',
            feedback: 'The `debugger;` statement invokes any available debugging functionality, such as setting a breakpoint. If no debugging functionality is available, this statement has no effect. When DevTools are open, execution pauses.',
          },
          {
            question: 'If your code runs without crashing but produces incorrect results, what type of error is it most likely?',
            options: { A: 'Syntax Error', B: 'Runtime Error', C: 'Logical Error', D: 'Compilation Error' },
            answer: 'C',
            feedback: 'Logical errors are flaws in the program\'s logic that cause it to behave incorrectly, even though the syntax is valid and no runtime exceptions are thrown.',
          },
          {
            question: 'Which `console` method is specifically designed to output error messages, often styled differently in the console?',
            options: { A: '`console.log()`', B: '`console.info()`', C: '`console.warn()`', D: '`console.error()`' },
            answer: 'D',
            feedback: '`console.error()` is used to output error messages. Browsers often display these messages in red or with an error icon to distinguish them.',
          },
          {
            question: 'What is the `name` property of an error object thrown by `throw new TypeError("My type error");`?',
            options: { A: '"Error"', B: '"TypeError"', C: '"My type error"', D: 'undefined' },
            answer: 'B',
            feedback: 'When you throw an instance of a specific error class like `TypeError`, the `name` property of the error object will be the name of that class (e.g., "TypeError"). The `message` property will be "My type error".'
          },
          {
            question: 'If a `try` block executes successfully without throwing any errors, what happens to the `catch` block?',
            options: { A: 'It is executed.', B: 'It is skipped.', C: 'It causes an error.', D: 'It is executed only if there is also a `finally` block.' },
            answer: 'B',
            feedback: 'The `catch` block is only executed if an error (exception) is thrown within the corresponding `try` block. If no error occurs in `try`, `catch` is skipped.'
          }
        ],
      },
    ],
  },
];

export default jsFoundationsModules;
