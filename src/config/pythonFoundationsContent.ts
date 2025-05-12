
import type { LessonModule } from '@/types/lessons';

const pythonFoundationsModules: LessonModule[] = [
  {
    slug: 'module-1-introduction',
    title: 'Module 1: Introduction to Python and Computer Programming',
    description: 'Learn what Python is, how programming languages work, and write your first program.',
    content: [
      {
        slug: 'python-as-tool',
        subTitle: 'Python - a tool, not a reptile',
        text: 'Python is a popular, versatile, and beginner-friendly programming language. Created by Guido van Rossum and first released in 1991, Python emphasizes readability and simplicity. Its name was inspired by the British comedy group Monty Python, not the snake!\n\nWhy Python is Great for Beginners:\n- **Easy to Read:** Python\'s syntax is designed to be clear and intuitive, almost like reading English.\n- **Large Community:** A vast and active community means plenty of resources, libraries, and support.\n- **Versatile:** Used in web development, data science, artificial intelligence, automation, and more.\n- **Interpreted:** Python code is executed line by line, making it easier to test and debug.',
      },
      {
        slug: 'compilation-vs-interpretation',
        subTitle: 'Compilation vs. Interpretation',
        text: 'Computers don\'t understand human-readable programming languages directly. Code needs to be translated into machine code (binary instructions) that the computer\'s processor can execute. There are two main ways this translation happens:\n\n- **Compilation:** A compiler translates the entire program into machine code before it runs. This creates an executable file. Examples: C++, Java (compiles to bytecode, then interpreted by JVM).\n  - *Pros:* Often faster execution once compiled.\n  - *Cons:* Entire program needs to be recompiled after changes.\n\n- **Interpretation:** An interpreter reads and executes the code line by line. No separate executable file is created. Python is primarily an interpreted language.\n  - *Pros:* Easier to test and debug, more flexible.\n  - *Cons:* Can be slower than compiled languages for CPU-intensive tasks.',
      },
      {
        slug: 'machine-vs-high-level',
        subTitle: 'Machine vs. High-Level Languages',
        text: 'Programming languages exist at different levels of abstraction:\n\n- **Machine Language (Low-Level):** This is the most basic language, consisting of binary (0s and 1s) or hexadecimal instructions that a computer\'s CPU can execute directly. It\'s very difficult for humans to read or write.\n\n- **Assembly Language (Low-Level):** A step above machine language, assembly uses mnemonic codes (like ADD, MOV) to represent machine instructions. It still requires a deep understanding of computer architecture.\n\n- **High-Level Languages:** These languages (like Python, Java, C#, JavaScript) are designed to be human-readable and easier to work with. They use English-like syntax and abstract away many of the complex details of the computer\'s hardware. High-level code must be translated (compiled or interpreted) into machine language to run.',
      },
      {
        slug: 'syntax-semantics-lexis',
        subTitle: 'Syntax, Semantics, Lexis',
        text: 'Like human languages, programming languages have rules and components:\n\n- **Lexis:** The set of all valid words or symbols in a language. In Python, this includes keywords (like `if`, `for`, `def`), operators (`+`, `=`, `>`), and identifiers (variable names).\n\n- **Syntax:** The rules that govern how words and symbols can be combined to form valid statements or expressions. For example, in Python, an `if` statement must end with a colon (`:`), and the code block below it must be indented.\n  `if x > 5: print("Greater")` (Correct syntax)\n\n- **Semantics:** The meaning of syntactically correct statements. A program can be syntactically correct but semantically wrong if it doesn\'t do what the programmer intended. For example, using `+` to add two numbers has a clear semantic meaning. If you try to add a number and a string without proper conversion, it might be a syntax error or a semantic error (a TypeError in Python) depending on the language.',
      },
    ],
    labs: [
      {
        slug: 'lab-1-1-hello-world',
        title: 'Lab 1.1: Hello World',
        description: 'Write your first Python program using `print()`. Print "Hello, Plenty of π!". Then, on new lines, print your name and your favorite number.',
        starterCode: 'print("Hello, Plenty of π!")\n# Your code here\n# Print your name on a new line\n# Print your favorite number on another new line',
        tasks: [
          'Use the `print()` function to display "Hello, Plenty of π!" on the console.',
          'On a new line, use `print()` to display your name.',
          'On another new line, use `print()` to display your favorite number.',
        ],
        hints: [
          'The `print()` function takes a string (text in quotes) or a number as an argument.',
          'Each `print()` statement usually creates a new line of output.',
        ],
        solutionCode: 'print("Hello, Plenty of π!")\nprint("My Name") # Replace "My Name" with your actual name\nprint(7) # Replace 7 with your favorite number',
        solutionExplanation: 'This solution uses three `print()` statements. The first prints the greeting. The second prints a placeholder for a name (you should customize this). The third prints a number (customize this too!). Each `print()` automatically moves to a new line.',
      },
    ],
    quizzes: [
      {
        slug: 'quiz-1-intro-concepts',
        title: 'Quiz 1: Introduction to Programming Concepts',
        questionsCount: 5,
        questions: [
          {
            question: 'What is the primary role of a compiler?',
            options: {
              A: 'To execute code line by line.',
              B: 'To translate the entire program into machine code before execution.',
              C: 'To manage computer memory.',
              D: 'To provide a user interface.',
            },
            answer: 'B',
            feedback: 'A compiler translates the entire high-level program into machine code (or an intermediate bytecode) before the program runs, creating an executable file.',
          },
          {
            question: 'Is Python primarily considered a compiled or an interpreted language?',
            options: {
              A: 'Compiled',
              B: 'Interpreted',
              C: 'Both equally',
              D: 'Neither',
            },
            answer: 'B',
            feedback: 'Python is primarily an interpreted language. The Python interpreter executes code line by line without needing to compile the entire program into a separate machine code file first.',
          },
          {
            question: 'What is machine code?',
            options: {
              A: 'A high-level programming language that is easy for humans to read.',
              B: 'A textual representation of algorithms.',
              C: 'A set of binary instructions that a computer\'s CPU can execute directly.',
              D: 'A style guide for writing Python code.',
            },
            answer: 'C',
            feedback: 'Machine code is the lowest-level programming language, consisting of binary (0s and 1s) or hexadecimal instructions that the computer\'s central processing unit (CPU) executes directly.',
          },
          {
            question: 'In Python, what is the main purpose of the `print()` function?',
            options: {
              A: 'To get input from the user.',
              B: 'To perform mathematical calculations.',
              C: 'To display information (text, numbers, etc.) on the console or screen.',
              D: 'To define a new variable.',
            },
            answer: 'C',
            feedback: 'The `print()` function in Python is used to output data to the standard output device, which is typically the console or screen.',
          },
          {
            question: 'Which of these languages is generally considered a high-level language?',
            options: {
              A: 'Assembly Language',
              B: 'Machine Code',
              C: 'Python',
              D: 'CPU Instruction Set',
            },
            answer: 'C',
            feedback: 'Python is a high-level language, designed to be human-readable and abstract away complex hardware details. Assembly and machine code are low-level languages.',
          },
        ],
      },
    ],
  },
  {
    slug: 'module-2-python-basics',
    title: 'Module 2: Python Basics - Data Types, Variables, I/O, and Operators',
    description: 'Explore fundamental data types, learn how to store information in variables, interact with users, and perform calculations.',
    content: [
      {
        slug: 'first-program-print',
        subTitle: 'Your first program: `print()`',
        text: 'The `print()` function is one of the first functions you\'ll encounter. It\'s used to display output to the console.\nExample: `print("Hello, Python!")` will show "Hello, Python!" on your screen.\nYou can print strings (text in quotes), numbers, variables, and even the results of expressions.',
      },
      {
        slug: 'literals-data-types',
        subTitle: 'Literals and Data Types',
        text: 'A literal is a fixed value in code, like `5`, `"Hello"`, or `True`.\nPython has several built-in data types:\n- **Integer (`int`):** Whole numbers, e.g., `10`, `-3`, `0`.\n- **Float (`float`):** Numbers with a decimal point, e.g., `3.14`, `-0.5`, `2.0`.\n- **String (`str`):** Sequences of characters, enclosed in single (`\' \'`) or double (`" "`) quotes, e.g., `"Python"`, `\'world\'`.\n- **Boolean (`bool`):** Represents truth values, either `True` or `False` (capitalized).',
      },
      {
        slug: 'variables',
        subTitle: 'Variables',
        text: 'Variables are like containers that store data values. You assign a value to a variable using the assignment operator (`=`).\nExample: `age = 30`, `name = "Alice"`\n\n**Naming Rules & Best Practices:**\n- Must start with a letter (a-z, A-Z) or an underscore (`_`).\n- Can be followed by letters, numbers, or underscores.\n- Case-sensitive (`age` is different from `Age`).\n- Cannot be a Python keyword (like `if`, `for`).\n- Use descriptive names (e.g., `user_age` instead of `x`). Snake case (`my_variable_name`) is common in Python.',
      },
      {
        slug: 'basic-io',
        subTitle: 'Basic Input and Output (I/O)',
        text: '- **Output (`print()`):** We\'ve seen `print()` for displaying information.\n  `print("Name:", name, "Age:", age)`\n\n- **Input (`input()`):** Used to get data from the user. It always returns the input as a string.\n  `user_name = input("Enter your name: ")`\n  If you need a number, you must convert it: `user_age_str = input("Enter your age: "); user_age_int = int(user_age_str)`',
      },
      {
        slug: 'operators',
        subTitle: 'Operators',
        text: 'Operators are special symbols that perform operations on values (operands).\n\n- **Arithmetic Operators:**\n  - `+` (addition), `-` (subtraction), `*` (multiplication)\n  - `/` (division - always results in a float, e.g., `10 / 4 = 2.5`)\n  - `//` (floor division - discards the fractional part, e.g., `10 // 4 = 2`)\n  - `%` (modulus - remainder of division, e.g., `10 % 3 = 1`)\n  - `**` (exponentiation - raise to the power, e.g., `2 ** 3 = 8`)\n\n- **Assignment Operators:** ` = ` (assign), `+=`, `-=`, `*=`, `/=` (e.g., `x += 1` is `x = x + 1`)\n\n- **Comparison (Relational) Operators:** Return `True` or `False`.\n  - `==` (equal to), `!=` (not equal to)\n  - `>` (greater than), `<` (less than)\n  - `>=` (greater than or equal to), `<=` (less than or equal to)\n\n- **Logical Operators:** Combine boolean expressions.\n  - `and`: `True` if both operands are true.\n  - `or`: `True` if at least one operand is true.\n  - `not`: Inverts the truth value (`not True` is `False`).',
      },
      {
        slug: 'comments',
        subTitle: 'Comments',
        text: 'Comments are notes in your code that are ignored by the Python interpreter. They are used to explain code or make it more readable.\n- Single-line comments start with `#`: `# This is a comment`\n- Multi-line comments (docstrings) are often enclosed in triple quotes (`"""..."""` or `\'\'\'...\'\'\'`), typically used for function/class documentation.'
      }
    ],
    labs: [
      {
        slug: 'lab-2-1-variable-play', // Updated slug to match convention
        title: 'Lab 2.1: Variable Play & Simple Calculator',
        description: 'Create a program that asks the user for two numbers and then prints their sum, difference, product, and quotient.',
        starterCode: 'num1_str = input("Enter first number: ")\nnum2_str = input("Enter second number: ")\n\n# Convert inputs to numbers (integers or floats)\n# Example: num1 = float(num1_str)\n# Your code here for num1 and num2\n\n# Perform calculations\n# sum_result = num1 + num2\n# Your code here for difference, product, quotient\n\n# Print results\n# print("Sum:", sum_result)\n# Your code here to print other results',
        tasks: [
          'Get two numbers as input from the user.',
          'Convert these inputs to numerical types (e.g., `float` to handle decimals).',
          'Calculate their sum, difference, product, and quotient.',
          'Print each result with a descriptive label (e.g., "Sum: ...").',
        ],
        hints: [
          'Remember `input()` returns strings. Use `float()` or `int()` to convert.',
          'Use the arithmetic operators: `+`, `-`, `*`, `/`.',
          'To prevent errors with division by zero, you might want to check if the second number is zero before dividing (optional for this lab).',
        ],
        solutionCode: 'num1_str = input("Enter first number: ")\nnum2_str = input("Enter second number: ")\n\nnum1 = float(num1_str)\nnum2 = float(num2_str)\n\nsum_result = num1 + num2\ndifference_result = num1 - num2\nproduct_result = num1 * num2\n\n# Handle division by zero for quotient\nif num2 != 0:\n    quotient_result = num1 / num2\nelse:\n    quotient_result = "Cannot divide by zero"\n\nprint("Sum:", sum_result)\nprint("Difference:", difference_result)\nprint("Product:", product_result)\nprint("Quotient:", quotient_result)',
        solutionExplanation: 'This solution first gets two inputs as strings. Then, it converts them to `float` to allow for decimal numbers. It calculates the sum, difference, and product. For the quotient, it includes a check to prevent division by zero, providing a message if `num2` is 0. Finally, it prints all results.',
      },
    ],
    quizzes: [
      {
        slug: 'quiz-2-basics-operators',
        title: 'Quiz 2: Python Basics, Data Types, and Operators',
        questionsCount: 6,
        questions: [
          {
            question: 'What is the data type of the value `42` in Python?',
            options: { A: 'string', B: 'integer', C: 'float', D: 'boolean' },
            answer: 'B',
            feedback: '`42` is a whole number, which is an integer (`int`) type in Python.',
          },
          {
            question: 'What is the result of the expression `int("5") + float("2.5")`?',
            options: { A: '7.5 (string)', B: '7 (integer)', C: '7.5 (float)', D: 'Error' },
            answer: 'C',
            feedback: '`int("5")` becomes `5` (integer). `float("2.5")` becomes `2.5` (float). Adding an integer and a float results in a float: `5 + 2.5 = 7.5`.',
          },
          {
            question: 'By default, what data type does the `input()` function return?',
            options: { A: 'integer', B: 'float', C: 'string', D: 'boolean' },
            answer: 'C',
            feedback: 'The `input()` function always returns the user\'s input as a string, regardless of what the user types.',
          },
          {
            question: 'Which operator is used for exponentiation (raising a number to a power) in Python?',
            options: { A: '^', B: '**', C: 'pow()', D: 'exp()' },
            answer: 'B',
            feedback: 'The `**` operator is used for exponentiation. For example, `2 ** 3` means 2 raised to the power of 3, which is 8.',
          },
          {
            question: 'How do you write a single-line comment in Python?',
            options: { A: '// This is a comment', B: '/* This is a comment */', C: '# This is a comment', D: '-- This is a comment' },
            answer: 'C',
            feedback: 'Single-line comments in Python start with the hash symbol (`#`).',
          },
          {
            question: 'True or False: Variable names in Python can start with a number.',
            options: { A: 'True', B: 'False' },
            answer: 'B',
            feedback: 'False. Variable names must start with a letter (a-z, A-Z) or an underscore (`_`). They cannot start with a number.',
          },
        ],
      },
    ],
  },
  {
    slug: 'module-3-control-flow',
    title: 'Module 3: Control Flow - Conditional Execution and Loops',
    description: 'Learn how to make decisions in your code with `if` statements and repeat tasks using `while` and `for` loops.',
    content: [
      {
        slug: 'booleans-conditionals',
        subTitle: 'Boolean Values and Conditional Execution',
        text: 'Boolean values represent truth and can be either `True` or `False`.\nConditional execution allows your program to make decisions. The `if` statement is fundamental for this.\nSyntax: `if condition: # code to execute if condition is True`\nThe `condition` is an expression that evaluates to `True` or `False`. The indented code block only runs if the condition is `True`.',
      },
      {
        slug: 'if-else-elif',
        subTitle: 'The `if-else` and `elif` statements',
        text: '- **`if-else`:** Provides an alternative block of code to execute if the `if` condition is `False`.\n  `if condition:\n    # code if True\n  else:\n    # code if False`\n\n- **`elif` (else if):** Allows you to check multiple conditions in sequence.\n  `if condition1:\n    # code if condition1 is True\n  elif condition2:\n    # code if condition1 is False and condition2 is True\n  else:\n    # code if all preceding conditions are False`',
      },
      {
        slug: 'loops-while-for',
        subTitle: 'Loops: `while` and `for`',
        text: 'Loops are used to repeat a block of code multiple times.\n\n- **`while` loop:** Repeats a block of code as long as a condition is `True`.\n  `count = 0\n  while count < 5:\n    print(count)\n    count += 1`\n  Be careful to avoid infinite loops by ensuring the condition eventually becomes `False`.\n\n- **`for` loop:** Iterates over a sequence (like a list, string, or range) or other iterable objects.\n  `for letter in "Python": print(letter)`\n  `for i in range(5): print(i)  # Prints 0, 1, 2, 3, 4`\n  The `range()` function is commonly used with `for` loops to iterate a specific number of times. `range(start, stop, step)` generates numbers from `start` up to (but not including) `stop`, incrementing by `step`. If `start` is omitted, it defaults to 0. If `step` is omitted, it defaults to 1.',
      },
      {
        slug: 'loop-control-break-continue-else',
        subTitle: 'Controlling Loop Execution: `break`, `continue`, and `else` in Loops',
        text: '- **`break`:** Immediately exits the current loop (both `for` and `while`).\n\n- **`continue`:** Skips the rest of the current iteration and proceeds to the next iteration of the loop.\n\n- **`else` clause in loops:** An optional `else` block can be used with loops. For a `for` loop, the `else` block executes after the loop finishes all iterations, but *only if the loop was not terminated by a `break` statement*. For a `while` loop, the `else` block executes when the loop\'s condition becomes `False`, but *not if the loop was exited with `break`*. \n  Example with `for`:\n  `for i in range(3):\n    print(i)\n  else:\n    print("Loop finished normally")`',
      },
    ],
    labs: [
      {
        slug: 'lab-3-1-loop-master',
        title: 'Lab 3.1: Loop Master - Number Printer',
        description: 'Write a loop that prints numbers from 1 to 10 (inclusive). Inside the loop, add logic to skip printing the number 5 and to stop the loop entirely if the number 9 is reached (so 9 should not be printed).',
        starterCode: '# Your loop here\n# Remember range(start, stop) goes up to stop-1\nfor i in range(1, 11):\n    # Your logic for skipping 5 and breaking at 9 here\n    # if i == 5: ...\n    # if i == 9: ...\n    print(i)',
        tasks: [
          'Create a `for` loop that iterates from 1 to 10.',
          'Inside the loop, use an `if` statement to check if the current number is 5. If it is, use `continue` to skip printing it.',
          'Add another `if` statement to check if the current number is 9. If it is, use `break` to exit the loop.',
          'Print the current number if it\'s not skipped or if the loop hasn\'t broken.',
        ],
        hints: [
          '`range(1, 11)` will give you numbers from 1 up to (but not including) 11.',
          'The `continue` statement skips the rest of the current iteration.',
          'The `break` statement exits the loop immediately.',
        ],
        solutionCode: 'for i in range(1, 11):\n    if i == 9:\n        break  # Stop before printing 9\n    if i == 5:\n        continue  # Skip printing 5\n    print(i)',
        solutionExplanation: 'This solution uses a `for` loop with `range(1, 11)`. The check for `i == 9` and `break` is placed *before* the check for `i == 5` and `continue`. This ensures that if `i` is 9, the loop breaks immediately, and 9 is not printed. If `i` is 5 (and not 9), the `continue` statement skips the `print(i)` for that iteration. All other numbers (1, 2, 3, 4, 6, 7, 8) are printed.',
      },
    ],
    quizzes: [
      {
        slug: 'quiz-3-control-flow',
        title: 'Quiz 3: Control Flow - Conditionals and Loops',
        questionsCount: 8,
        questions: [
          {
            question: 'What does the statement `if x == 5:` check for?',
            options: { A: 'If x is assigned the value 5.', B: 'If x is not equal to 5.', C: 'If x is equal to 5.', D: 'If x is greater than 5.' },
            answer: 'C',
            feedback: 'The `==` operator is a comparison operator that checks for equality. So, `if x == 5:` checks if the value of variable `x` is equal to 5.',
          },
          {
            question: 'What is the primary difference between the `=` operator and the `==` operator in Python?',
            options: { A: '`=` is for comparison, `==` is for assignment.', B: '`=` is for assignment, `==` is for comparison.', C: 'They are interchangeable.', D: '`=` is for strings, `==` is for numbers.' },
            answer: 'B',
            feedback: '`=` is the assignment operator (used to assign a value to a variable). `==` is the equality comparison operator (used to check if two values are equal).',
          },
          {
            question: 'How does a `while` loop generally differ from a `for` loop in terms of how they iterate?',
            options: { A: '`while` loops always iterate a fixed number of times; `for` loops iterate based on a condition.', B: '`while` loops iterate as long as a condition is true; `for` loops iterate over a sequence of items.', C: '`for` loops cannot have a condition.', D: '`while` loops are only for numbers; `for` loops are for strings.' },
            answer: 'B',
            feedback: 'A `while` loop continues to execute as long as its condition remains true. A `for` loop iterates over the items of a sequence (like a list, tuple, string, or range) in order.',
          },
          {
            question: 'What does the `break` statement do when used inside a loop?',
            options: { A: 'Skips the current iteration and moves to the next.', B: 'Pauses the loop indefinitely.', C: 'Terminates the loop immediately and transfers execution to the statement following the loop.', D: 'Restarts the loop from the beginning.' },
            answer: 'C',
            feedback: 'The `break` statement immediately terminates the innermost enclosing `for` or `while` loop.',
          },
          {
            question: 'When is the `else` block of a `for` loop executed?',
            options: { A: 'Always after the loop finishes.', B: 'Only if the loop is terminated by a `break` statement.', C: 'If the loop completes all its iterations without being terminated by a `break` statement.', D: 'During every iteration of the loop.' },
            answer: 'C',
            feedback: 'The `else` clause of a `for` loop is executed when the loop has exhausted iterating the list (with `for` loops) or when the condition becomes false (with `while` loops), but not when the loop is terminated by a `break` statement.',
          },
          {
            question: 'How many times will the loop `for i in range(0, 5):` execute its body?',
            options: { A: '0 times', B: '4 times', C: '5 times', D: '6 times' },
            answer: 'C',
            feedback: '`range(0, 5)` generates numbers 0, 1, 2, 3, 4. The loop will execute its body for each of these 5 values.',
          },
          {
            question: 'What is the output of the Python expression `not False`?',
            options: { A: 'True', B: 'False', C: 'None', D: 'Error' },
            answer: 'A',
            feedback: 'The `not` operator negates a boolean value. `not False` evaluates to `True`.',
          },
          {
            question: 'What is the boolean value of the expression `True and False`?',
            options: { A: 'True', B: 'False', C: 'None', D: 'Error' },
            answer: 'B',
            feedback: 'The `and` operator returns `True` only if both operands are true. Since one is `False`, the expression `True and False` evaluates to `False`.',
          },
        ],
      },
    ],
  },
  {
    slug: 'module-4-data-collections-functions',
    title: 'Module 4: Data Collections and Functions',
    description: 'Learn to group data using lists, tuples, and dictionaries, and write reusable code blocks with functions.',
    content: [
      {
        slug: 'lists',
        subTitle: 'Lists',
        text: 'Lists are ordered, mutable (changeable) collections of items. Items can be of different types.\n- **Creating:** `my_list = [1, "hello", 3.14]`\n- **Accessing:** Use index (starts at 0). `my_list[0]` is `1`.\n- **Slicing:** Get a sub-list. `my_list[1:3]` is `["hello", 3.14]`.\n- **Modifying:** `my_list[1] = "world"`\n- **Common Methods:** `append(item)`, `insert(index, item)`, `pop(index_optional)`, `remove(item)`, `sort()`, `len(list)` (gets length).',
      },
      {
        slug: 'tuples',
        subTitle: 'Tuples',
        text: 'Tuples are ordered, immutable (unchangeable) collections of items. Defined using parentheses `()`.\nExample: `my_tuple = (1, "apple", True)`\nOnce created, you cannot change, add, or remove items. They are often used for fixed collections of items, like coordinates `(x, y)`. Accessing items is similar to lists (using index).',
      },
      {
        slug: 'dictionaries',
        subTitle: 'Dictionaries',
        text: 'Dictionaries are unordered collections of key-value pairs. They are mutable.\n- **Creating:** `my_dict = {"name": "Alice", "age": 30, "city": "New York"}` or `my_dict = dict(name="Alice", age=30)`\n- **Accessing:** Use keys. `my_dict["age"]` is `30`.\n- **Modifying/Adding:** `my_dict["age"] = 31`, `my_dict["country"] = "USA"`\n- **Common Methods:** `keys()`, `values()`, `items()`, `get(key, default_value_optional)`, `pop(key)`. Keys must be unique and immutable (e.g., strings, numbers, tuples).',
      },
      {
        slug: 'functions',
        subTitle: 'Functions',
        text: 'Functions are reusable blocks of code that perform a specific task. They help organize code and make it more modular.\n- **Defining:** Use the `def` keyword.\n  `def greet(name):\n    print(f"Hello, {name}!")`\n- **Calling:** Use the function name followed by parentheses with arguments.\n  `greet("Bob")`  # Output: Hello, Bob!\n- **Parameters:** Variables listed inside the parentheses in the function definition (e.g., `name` in `greet(name)`).\n- **Arguments:** Values passed to the function when it is called (e.g., `"Bob"`).\n- **`return` statement:** Used to send a value back from the function. If omitted, the function returns `None` by default.\n  `def add(x, y):\n    return x + y\n  result = add(5, 3)  # result is 8`\n- **Scope:** Variables defined inside a function (local scope) are not accessible outside it, unless declared global (generally avoided).',
      },
      {
        slug: 'error-handling-try-except',
        subTitle: 'Error Handling: `try` and `except`',
        text: 'Programs can encounter errors (exceptions) during execution. `try-except` blocks allow you to handle these errors gracefully instead of crashing the program.\n- **`try` block:** Contains the code that might raise an exception.\n- **`except` block:** Contains the code to execute if a specific exception occurs in the `try` block.\nExample:\n`try:\n  num = int(input("Enter a number: "))\n  result = 10 / num\n  print(result)\nexcept ValueError:\n  print("That was not a valid number!")\nexcept ZeroDivisionError:\n  print("You cannot divide by zero!")`\nYou can have multiple `except` blocks for different error types, or a generic `except Exception:` to catch any error.',
      },
    ],
    labs: [
      {
        slug: 'lab-4-1-function-fun',
        title: 'Lab 4.1: Function Fun - Simple Adder',
        description: 'Create a function `add_numbers(a, b)` that takes two numbers as parameters and returns their sum. Then, get two numbers from user input, call your function with these numbers, and print the returned result.',
        starterCode: '# Define your function add_numbers(a, b) here\n# def add_numbers(a, b):\n#     return ...\n\n# Get input from the user\n# num1_str = input("Enter first number: ")\n# num2_str = input("Enter second number: ")\n\n# Convert inputs to numbers\n# num1 = float(num1_str)\n# num2 = float(num2_str)\n\n# Call your function and store the result\n# sum_result = add_numbers(num1, num2)\n\n# Print the result\n# print("The sum is:", sum_result)',
        tasks: [
          'Define a function named `add_numbers` that accepts two parameters (e.g., `a` and `b`).',
          'Inside the function, calculate the sum of `a` and `b`.',
          'Use the `return` statement to send the sum back from the function.',
          'Outside the function, prompt the user to enter two numbers.',
          'Convert these user inputs from strings to numerical types (e.g., `float`).',
          'Call your `add_numbers` function with the user\'s numbers as arguments.',
          'Print the value returned by the function in a user-friendly way (e.g., "The sum is: ...").',
        ],
        hints: [
          'Function definition starts with `def function_name(param1, param2):`.',
          'Use `return value` to send a value out of a function.',
          'Remember to convert `input()` results using `int()` or `float()` before performing math.',
        ],
        solutionCode: 'def add_numbers(a, b):\n    return a + b\n\nnum1_str = input("Enter first number: ")\nnum2_str = input("Enter second number: ")\n\nnum1 = float(num1_str)\nnum2 = float(num2_str)\n\nsum_result = add_numbers(num1, num2)\n\nprint("The sum is:", sum_result)',
        solutionExplanation: 'The `add_numbers` function takes two arguments `a` and `b` and simply returns their sum. Outside the function, we get two numbers from the user, convert them to `float`, call `add_numbers` with these values, and print the result.',
      },
      {
        slug: 'lab-4-2-student-grades',
        title: 'Lab 4.2: Data Structures Challenge - Student Grades',
        description: 'Create a dictionary called `grades` to store the grades of three students: Alice (85), Bob (92), and Charlie (78). Then, calculate and print the average grade of these students.',
        starterCode: '# Create the grades dictionary\ngrades = {"Alice": 85, "Bob": 92, "Charlie": 78}\n\n# Calculate the sum of grades\n# Hint: Use sum() and grades.values()\n# total_grades = ...\n\n# Calculate the number of students\n# Hint: Use len()\n# num_students = ...\n\n# Calculate the average\n# average_grade = ...\n\n# Print the average grade\n# print("Average grade:", average_grade)',
        tasks: [
          'Create a dictionary named `grades`.',
          'Add three entries: "Alice" with a value of 85, "Bob" with 92, and "Charlie" with 78.',
          'Use the `sum()` function on `grades.values()` to get the total of all grades.',
          'Use the `len()` function on `grades` (or `grades.keys()`, `grades.values()`) to get the number of students.',
          'Calculate the average grade (total grades / number of students).',
          'Print the average grade.',
        ],
        hints: [
          'A dictionary is created with curly braces: `my_dict = {"key1": value1, "key2": value2}`.',
          '`grades.values()` returns a view object that displays a list of all the values in the dictionary.',
          'The `sum()` function can take an iterable (like a list of numbers) and return their total.',
          'The `len()` function returns the number of items in a collection.',
        ],
        solutionCode: 'grades = {"Alice": 85, "Bob": 92, "Charlie": 78}\n\ntotal_grades = sum(grades.values())\nnum_students = len(grades)\n\naverage_grade = total_grades / num_students\n\nprint("Average grade:", average_grade)',
        solutionExplanation: 'First, the `grades` dictionary is created. Then, `sum(grades.values())` calculates the total of all grade values. `len(grades)` gets the number of students (which is the number of key-value pairs). The average is computed by dividing the total by the number of students, and then printed.',
      },
    ],
    quizzes: [
      {
        slug: 'quiz-4-collections-functions',
        title: 'Quiz 4: Data Collections and Functions',
        questionsCount: 10,
        questions: [
          {
            question: 'How do you define a function in Python?',
            options: { A: '`function myFunc():`', B: '`def myFunc():`', C: '`define myFunc():`', D: '`func myFunc():`' },
            answer: 'B',
            feedback: 'Functions in Python are defined using the `def` keyword, followed by the function name and parentheses, e.g., `def my_function():`.',
          },
          {
            question: 'How do you call a function named `calculate_sum` that takes two arguments, `a` and `b`?',
            options: { A: '`calculate_sum a, b`', B: '`call calculate_sum(a, b)`', C: '`calculate_sum(a, b)`', D: '`calculate_sum[a, b]`' },
            answer: 'C',
            feedback: 'To call a function, you use its name followed by parentheses containing the arguments: `calculate_sum(value_for_a, value_for_b)`.',
          },
          {
            question: 'What is the output of `len([1, 2, 3])`?',
            options: { A: '1', B: '2', C: '3', D: '6' },
            answer: 'C',
            feedback: 'The `len()` function returns the number of items in a list. The list `[1, 2, 3]` has 3 items.',
          },
          {
            question: 'Can items in a tuple be changed after the tuple is created?',
            options: { A: 'Yes, tuples are mutable.', B: 'No, tuples are immutable.', C: 'Only if the tuple contains numbers.', D: 'Only if the tuple contains strings.' },
            answer: 'B',
            feedback: 'Tuples are immutable, meaning their contents cannot be changed after creation. Lists are mutable.',
          },
          {
            question: 'What does the `keys()` method of a dictionary return?',
            options: { A: 'A list of all values in the dictionary.', B: 'A list of all key-value pairs (tuples).', C: 'A view object that displays a list of all the keys.', D: 'The first key of the dictionary.' },
            answer: 'C',
            feedback: 'The `keys()` method returns a view object that displays a list of all the keys in the dictionary.',
          },
          {
            question: 'What is the purpose of a `try` block in Python error handling?',
            options: { A: 'To define a function that might fail.', B: 'To always execute a block of code, regardless of errors.', C: 'To contain code that might raise an exception.', D: 'To specify the type of error to catch.' },
            answer: 'C',
            feedback: 'The `try` block encloses the code that you suspect might raise an exception (an error that occurs during execution).',
          },
          {
            question: 'How do you specify the code to run when a particular type of error (e.g., `ValueError`) occurs in a `try` block?',
            options: { A: 'Using an `if ValueError:` block.', B: 'Using a `catch ValueError:` block.', C: 'Using an `except ValueError:` block.', D: 'Using an `handle ValueError:` block.' },
            answer: 'C',
            feedback: 'You use an `except ExceptionType:` block (e.g., `except ValueError:`) following a `try` block to define the code that should run if that specific exception occurs.',
          },
          {
            question: 'In a function definition like `def greet(name):`, what is `name` called?',
            options: { A: 'An argument', B: 'A return value', C: 'A parameter', D: 'A literal' },
            answer: 'C',
            feedback: '`name` in `def greet(name):` is a parameter – a variable name listed in the function definition that acts as a placeholder for an argument.',
          },
          {
            question: 'What is the `return` statement used for in a Python function?',
            options: { A: 'To print a value to the console.', B: 'To stop the execution of the entire program.', C: 'To send a value back from the function to the caller.', D: 'To define the start of a function.' },
            answer: 'C',
            feedback: 'The `return` statement is used to exit a function and optionally send a value back to the part of the code that called the function.',
          },
          {
            question: 'True or False: Python lists and dictionaries are both mutable.',
            options: { A: 'True', B: 'False' },
            answer: 'A',
            feedback: 'True. Both lists and dictionaries are mutable, meaning their contents can be changed after they are created (e.g., items can be added, removed, or modified). Tuples are immutable.',
          },
        ],
      },
    ],
  },
  {
    slug: 'module-5-oop-introduction',
    title: "Module 5: Introduction to Object-Oriented Programming (OOP)",
    description: 'Discover the basics of Object-Oriented Programming by creating classes and objects to model real-world things.',
    content: [
      {
        slug: 'what-is-oop',
        subTitle: "What is OOP? - Classes and Objects",
        text: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of \"objects\", which can contain data in the form of fields (often known as attributes or properties) and code in the form of procedures (often known as methods).\n\n- **Class:** A blueprint or template for creating objects. It defines a set of attributes and methods that the created objects will have. Think of a class like a cookie cutter.\n- **Object (Instance):** An instance of a class. It's a concrete entity created from the class blueprint. Using the cookie cutter analogy, an object is an actual cookie made from the cutter.\n\nKey principles of OOP often include encapsulation, inheritance, and polymorphism (though these are more advanced topics beyond the scope of an introductory module).",
      },
      {
        slug: 'creating-classes-init-self',
        subTitle: "Creating Classes: `class`, `__init__`, and `self`",
        text: "- **`class` keyword:** Used to define a new class.\n  `class Dog:\n    pass  # pass means 'do nothing', a placeholder`\n\n- **`__init__` method (Constructor):** A special method that is automatically called when you create a new object (instance) of a class. It's used to initialize the object's attributes. The name `__init__` has double underscores before and after.\n\n- **`self` parameter:** The first parameter of any method within a class (including `__init__`) is conventionally named `self`. It refers to the instance of the class itself. Through `self`, methods can access the attributes and other methods of the same object.",
      },
      {
        slug: 'attributes-methods',
        subTitle: "Attributes and Methods",
        text: "- **Attributes (Instance Variables):** Variables that belong to an object. They store the data or state of the object. Attributes are typically defined within the `__init__` method using `self.attribute_name = value`.\n  \`\`\`python\n  class Dog:\n    def __init__(self, name, age):\n      self.name = name  # Instance attribute\n      self.age = age    # Instance attribute\n  \`\`\`\n\n- **Methods:** Functions that belong to a class. They define the behavior or actions that an object can perform. Methods always have `self` as their first parameter.\n  \`\`\`python\n  class Dog:\n    def __init__(self, name, age):\n      self.name = name\n      self.age = age\n\n    def bark(self):  # Instance method\n      print(f\"{self.name} says Woof!\")\n  \`\`\`"
      },
      {
        slug: 'using-objects-instantiation-methods',
        subTitle: "Using Objects: Instantiation and Calling Methods",
        text: "- **Instantiation (Creating an Object):** You create an object by calling the class name as if it were a function, passing any arguments required by the `__init__` method (excluding `self`).\n  \`my_dog = Dog(\"Buddy\", 3)\`  # Creates an instance of the Dog class\n\n- **Accessing Attributes:** Use the dot notation: `object_name.attribute_name`.\n  \`print(my_dog.name)\`  # Output: Buddy\n\n- **Calling Methods:** Use the dot notation: `object_name.method_name()`.\n  \`my_dog.bark()\`  # Output: Buddy says Woof!"
      },
      {
        slug: 'simple-inheritance-overview',
        subTitle: "Simple Inheritance (Brief Overview)",
        text: "Inheritance is a way to form new classes using classes that have already been defined. The new classes, known as derived classes or child classes, inherit attributes and methods of the parent (or base/superclass) classes. This promotes code reuse.\nExample (very basic):\n\`\`\`python\nclass Animal:\n  def speak(self):\n    print(\"Animal speaks\")\n\nclass Cat(Animal):  # Cat inherits from Animal\n  def meow(self):\n    print(\"Meow\")\n\nmy_cat = Cat()\nmy_cat.speak()  # Inherited from Animal: Output: Animal speaks\nmy_cat.meow()   # Output: Meow\n\`\`\`\nThis module focuses on understanding the basics of classes and objects rather than deep inheritance concepts.",
      },
    ],
    labs: [
      {
        slug: 'lab-5-1-class-builder',
        title: "Lab 5.1: Class Builder - My First Object",
        description: "Create a `Car` class. The constructor (`__init__`) should take `brand` and `year` as arguments and store them as attributes. Add a method called `display_info()` that prints a message like \"This is a 2020 Toyota.\". Create an instance of your Car class and call its `display_info()` method.",
        starterCode: "class Car:\n    # Define __init__ method here\n    # It should take self, brand, and year as parameters\n    def __init__(self, brand, year):\n        # Assign brand and year to self.brand and self.year\n        self.brand = brand\n        self.year = year\n\n    # Define display_info method here\n    # It should take self as a parameter\n    def display_info(self):\n        # It should print the car's information, e.g., using an f-string\n        print(f\"This is a {self.year} {self.brand}.\")\n\n# Create an instance of Car (e.g., my_car = Car(\"Honda\", 2022))\n# your_car = ...\n\n# Call the display_info method on your car instance\n# your_car.display_info()",
        tasks: [
          "Define a class named `Car`.",
          "Inside the `Car` class, define the `__init__` method. It should accept `self`, `brand`, and `year` as parameters and assign `brand` and `year` to instance attributes (e.g., `self.brand = brand`).",
          "Define another method named `display_info` within the `Car` class. It should take `self` as a parameter.",
          "Inside `display_info`, print a formatted string like \"This is a [year] [brand].\" using the instance attributes.",
          "Create an object (instance) of the `Car` class, providing a brand (e.g., \"Toyota\") and a year (e.g., 2020).",
          "Call the `display_info()` method on the object you created.",
        ],
        hints: [
          "Class definition: `class ClassName:`",
          "Constructor: `def __init__(self, param1, param2):`",
          "Instance attributes: `self.attribute_name = value`",
          "Instance methods: `def method_name(self):`",
          "Creating an object: `my_object = ClassName(arg1, arg2)`",
          "Calling a method: `my_object.method_name()`",
          "Use an f-string for easy string formatting: `print(f\"Year: {self.year}\")`",
        ],
        solutionCode: "class Car:\n    def __init__(self, brand, year):\n        self.brand = brand\n        self.year = year\n\n    def display_info(self):\n        print(f\"This is a {self.year} {self.brand}.\")\n\nmy_car = Car(\"Honda\", 2022)\nmy_car.display_info()\n\nanother_car = Car(\"Ford\", 2019)\nanother_car.display_info()",
        solutionExplanation: "The `Car` class is defined with an `__init__` method to set the `brand` and `year` for each car object. The `display_info` method prints these attributes. Two instances, `my_car` and `another_car`, are created with different values, and their `display_info` methods are called, showing their respective details.",
      },
    ],
    quizzes: [
      {
        slug: 'quiz-5-classes-objects',
        title: "Quiz 5: Classes and Objects Fundamentals",
        questionsCount: 8,
        questions: [
          {
            question: "What is the primary purpose of the `__init__` method in a Python class?",
            options: { A: "To destroy an object.", B: "To initialize a new object's attributes.", C: "To define class-level variables.", D: "To be called explicitly by the user after object creation." },
            answer: 'B',
            feedback: "The `__init__` method is a special constructor method that is automatically called when an object is created (instantiated). Its main purpose is to initialize the instance attributes of the object.",
          },
          {
            question: "In a class method definition, what does the `self` parameter refer to?",
            options: { A: "The class itself.", B: "A global variable.", C: "The specific instance of the class on which the method is called.", D: "The parent class." },
            answer: 'C',
            feedback: "`self` refers to the instance of the class that the method is being called on. It allows methods to access and modify the object's attributes and call other methods of the object.",
          },
          {
            question: "How do you create an object (an instance) of a class named `MyClass`?",
            options: { A: "`MyClass.create()`", B: "`new MyClass()`", C: "`MyClass()`", D: "`object MyClass = new`" },
            answer: 'C',
            feedback: "You create an instance of a class by calling the class name as if it were a function: `my_object = MyClass()`. If `__init__` takes arguments (other than `self`), you pass them here.",
          },
          {
            question: "If `my_object` is an instance of a class that has a method `do_something()`, how do you call this method?",
            options: { A: "`call my_object.do_something()`", B: "`my_object.do_something()`", C: "`do_something(my_object)`", D: "`MyClass.do_something(my_object)`" },
            answer: 'B',
            feedback: "You call an instance method using dot notation on the object: `my_object.method_name()`. Python automatically passes the `my_object` instance as the `self` argument to the method.",
          },
          {
            question: "What is a class in Object-Oriented Programming?",
            options: { A: "A specific, concrete entity with data and behavior.", B: "A blueprint or template for creating objects.", C: "A function that performs an action.", D: "A built-in Python data type like list or dict." },
            answer: 'B',
            feedback: "A class is a blueprint or template that defines the attributes (data) and methods (behavior) that its objects will have. An object is an instance of a class.",
          },
          {
            question: "What is a primary goal of Object-Oriented Programming (OOP)?",
            options: { A: "To write code that is as short as possible.", B: "To make all data globally accessible.", C: "To model real-world entities and their interactions by organizing code into objects and classes, promoting reusability and modularity.", D: "To execute code faster than procedural programming." },
            answer: 'C',
            feedback: "OOP aims to structure programs by modeling real-world or abstract entities as objects. This approach helps in organizing complex systems, improving code reusability, and making code easier to maintain and understand.",
          },
          {
            question: "Can a Python class have multiple methods?",
            options: { A: "No, only one method per class.", B: "Yes, a class can define multiple methods.", C: "Only if it's a very complex class.", D: "Yes, but they must all have different names for `self`." },
            answer: 'B',
            feedback: "Yes, a class can have many methods, each defining a specific behavior or action that objects of that class can perform.",
          },
          {
            question: "If `car1` is an object of a `Car` class and `brand` is an attribute, how do you access its value?",
            options: { A: "`car1.getBrand()`", B: "`car1[brand]`", C: "`car1.brand`", D: "`Car.brand(car1)`" },
            answer: 'C',
            feedback: "You access an object's attributes using dot notation: `object_name.attribute_name`. So, `car1.brand` would access the `brand` attribute of the `car1` object.",
          },
        ],
      },
    ],
  },
];

export default pythonFoundationsModules;
