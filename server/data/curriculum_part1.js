// CHAPTERS 1-3: Getting Started, Data Types, Collections
module.exports = [
  {
    chapter_id: 1, order_num: 1,
    Title: 'Chapter 1: Getting Started',
    Description: 'Write your very first Python programs.',
    levels: [
      {
        level_id: 1, chapter_id: 1, order_num: 1, Title: 'Hello, World!', points_value: 10, coins_value: 5,
        content: {
          concept: `## Python Introduction\nPython is a popular, easy-to-learn programming language used for web development, data science, AI, and automation.\n\nYour very first Python program:\n\`\`\`python\nprint("Hello, World!")\n\`\`\`\nThe \`print()\` function outputs text to the console.`,
          task: 'Use `print()` to display `Hello, World!`',
          initial_code: '# Your first Python program\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Hello, World!' }]
        }
      },
      {
        level_id: 2, chapter_id: 1, order_num: 2, Title: 'Python Intro & Setup', points_value: 10, coins_value: 5,
        content: {
          concept: `## What Can Python Do?\n- Web development (Django, Flask)\n- Data analysis & AI (Pandas, TensorFlow)\n- Automation & scripting\n- Game development\n\nPython runs on Windows, Mac, and Linux. It uses an **interpreter** that executes code line by line.\n\n\`\`\`python\nprint("Python is awesome!")\nprint("Version: 3.x")\n\`\`\``,
          task: 'Print two lines: `Python is fun!` then `Let us code!`',
          initial_code: '# Print two lines\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Python is fun!\nLet us code!' }]
        }
      },
      {
        level_id: 3, chapter_id: 1, order_num: 3, Title: 'Python Syntax', points_value: 10, coins_value: 5,
        content: {
          concept: `## Python Syntax\nPython uses **indentation** to define code blocks — no curly braces!\n\n\`\`\`python\nif 5 > 2:\n    print("Five is greater!")  # indented = inside block\n\`\`\`\n\n> ⚠️ Python is **case-sensitive**: \`print\` ≠ \`Print\`\n\nStatements end with a newline, not a semicolon.`,
          task: 'Fix the indentation: the `print` must be inside the `if` block.',
          initial_code: 'if 10 > 5:\nprint("Ten is greater!")',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Ten is greater!' }]
        }
      },
      {
        level_id: 4, chapter_id: 1, order_num: 4, Title: 'Python Output', points_value: 10, coins_value: 5,
        content: {
          concept: `## Python print()\nThe \`print()\` function can output multiple values separated by commas:\n\n\`\`\`python\nprint("Name:", "Alice")   # Name: Alice\nprint("Age:", 25)         # Age: 25\nprint(1, 2, 3, sep="-")  # 1-2-3\nprint("Hi", end="!")     # Hi! (no newline)\n\`\`\``,
          task: 'Print `Name: CodeQuest` and `Score: 100` each on a separate line.',
          initial_code: '# Print two labeled lines\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Name: CodeQuest\nScore: 100' }]
        }
      },
      {
        level_id: 5, chapter_id: 1, order_num: 5, Title: 'Comments', points_value: 10, coins_value: 5,
        content: {
          concept: `## Python Comments\nComments start with \`#\` and are ignored by Python.\n\n\`\`\`python\n# Single-line comment\nprint("Hello")  # inline comment\n\`\`\`\n\nMulti-line comments use triple quotes:\n\`\`\`python\n"""\nThis is a\nmulti-line comment\n"""\n\`\`\``,
          task: 'Add a comment `# My mission` on line 1, then print `Mission started!`',
          initial_code: '\nprint("")',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Mission started!' }]
        }
      }
    ]
  },
  {
    chapter_id: 2, order_num: 2,
    Title: 'Chapter 2: Variables & Data Types',
    Description: 'Store, type, and transform all kinds of data.',
    levels: [
      {
        level_id: 6, chapter_id: 2, order_num: 1, Title: 'Variables', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Variables\nVariables store data. No declaration keyword needed — just assign!\n\n\`\`\`python\nname = "Alice"\nage = 25\nheight = 5.7\nprint(name, age)\n\`\`\`\n\n- Names are **case-sensitive**: \`city\` ≠ \`City\`\n- Can start with a letter or underscore, not a number\n- Multiple assignment: \`x = y = z = 0\``,
          task: 'Create variable `city = "Lahore"` and print it.',
          initial_code: '# Create and print city\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Lahore' }]
        }
      },
      {
        level_id: 7, chapter_id: 2, order_num: 2, Title: 'Data Types', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Data Types\n| Type | Example |\n|---|---|\n| str | \`"Hello"\` |\n| int | \`42\` |\n| float | \`3.14\` |\n| bool | \`True\` |\n| list | \`[1,2,3]\` |\n| dict | \`{"a":1}\` |\n\nCheck a type with \`type()\`:\n\`\`\`python\nx = 42\nprint(type(x))  # <class 'int'>\n\`\`\``,
          task: 'Print the type of `3.14` using `type()`. Output must be `<class \'float\'>`',
          initial_code: '# Print the type of 3.14\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: "<class 'float'>" }]
        }
      },
      {
        level_id: 8, chapter_id: 2, order_num: 3, Title: 'Numbers', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Numbers\n- **int**: whole numbers → \`10\`, \`-3\`\n- **float**: decimals → \`3.14\`, \`-0.5\`\n- **complex**: \`2+3j\`\n\n\`\`\`python\nx = 10\ny = 3\nprint(x + y)   # 13\nprint(x ** 2)  # 100  (power)\nprint(x % 3)   # 1    (modulo)\n\`\`\``,
          task: 'Calculate `2 ** 8` (2 to the power of 8) and print the result.',
          initial_code: '# Print 2 to the power of 8\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '256' }]
        }
      },
      {
        level_id: 9, chapter_id: 2, order_num: 4, Title: 'Casting', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Casting\nConvert between types using built-in functions:\n\n\`\`\`python\nint("42")      # 42\nfloat(5)       # 5.0\nstr(100)       # "100"\nbool(0)        # False\nbool(1)        # True\n\`\`\`\n\nUseful when user input (always a string) needs to be a number.`,
          task: 'Cast the string `"99"` to an integer, add `1` to it, and print the result.',
          initial_code: '# Cast "99" to int, add 1, print\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '100' }]
        }
      },
      {
        level_id: 10, chapter_id: 2, order_num: 5, Title: 'Strings', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Strings\nStrings are sequences of characters.\n\n\`\`\`python\ns = "Hello, World!"\nprint(s.upper())       # HELLO, WORLD!\nprint(s.lower())       # hello, world!\nprint(len(s))          # 13\nprint(s[0:5])          # Hello\nprint(s.replace("World","Python"))  # Hello, Python!\n\`\`\`\n\nf-strings for easy formatting:\n\`\`\`python\nname = "Ali"\nprint(f"Hello, {name}!")  # Hello, Ali!\n\`\`\``,
          task: 'Create `s = "codequest"` and print it in all UPPERCASE.',
          initial_code: 's = "codequest"\n# Print in uppercase\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'CODEQUEST' }]
        }
      },
      {
        level_id: 11, chapter_id: 2, order_num: 6, Title: 'Booleans', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Booleans\nBooleans are either \`True\` or \`False\`.\n\n\`\`\`python\nprint(10 > 9)    # True\nprint(10 == 9)   # False\nprint(bool(""))  # False\nprint(bool(42))  # True\n\`\`\`\n\nAlmost any value is True except: \`0\`, \`""\`, \`[]\`, \`None\``,
          task: 'Print the result of `500 == 500`. Expected: `True`',
          initial_code: '# Print the boolean result\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'True' }]
        }
      },
      {
        level_id: 12, chapter_id: 2, order_num: 7, Title: 'Operators', points_value: 15, coins_value: 6,
        content: {
          concept: `## Python Operators\n**Arithmetic**: \`+  -  *  /  //  %  **\`\n**Comparison**: \`==  !=  >  <  >=  <=\`\n**Logical**: \`and  or  not\`\n\n\`\`\`python\nprint(10 // 3)       # 3   (floor division)\nprint(10 % 3)        # 1   (remainder)\nprint(5 > 3 and 2 < 4)  # True\nprint(not True)      # False\n\`\`\``,
          task: 'Print the remainder of `17 % 5`. Expected: `2`',
          initial_code: '# Print 17 modulo 5\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '2' }]
        }
      }
    ]
  },
  {
    chapter_id: 3, order_num: 3,
    Title: 'Chapter 3: Collections',
    Description: 'Group and organize data with Python\'s powerful collection types.',
    levels: [
      {
        level_id: 13, chapter_id: 3, order_num: 1, Title: 'Lists', points_value: 20, coins_value: 8,
        content: {
          concept: `## Python Lists\nOrdered, changeable, allows duplicates.\n\n\`\`\`python\nfruits = ["apple","banana","cherry"]\nprint(fruits[0])    # apple\nfruits.append("mango")\nfruits.remove("banana")\nprint(len(fruits))  # 3\n\`\`\`\n\nKey methods: \`.append()\` \`.remove()\` \`.sort()\` \`.pop()\``,
          task: 'Create `nums = [3, 1, 4, 1, 5]`, sort it, then print it.',
          initial_code: 'nums = [3, 1, 4, 1, 5]\n# Sort and print\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '[1, 1, 3, 4, 5]' }]
        }
      },
      {
        level_id: 14, chapter_id: 3, order_num: 2, Title: 'Tuples', points_value: 20, coins_value: 8,
        content: {
          concept: `## Python Tuples\nOrdered, **unchangeable** (immutable). Faster than lists.\n\n\`\`\`python\npoint = (10, 20, 30)\nprint(point[1])    # 20\nprint(len(point))  # 3\n\`\`\`\n\nUse tuples for data that should not change (coordinates, RGB colors, etc.)`,
          task: 'Create `colors = ("red", "green", "blue")` and print its length.',
          initial_code: '# Create tuple and print length\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '3' }]
        }
      },
      {
        level_id: 15, chapter_id: 3, order_num: 3, Title: 'Sets', points_value: 20, coins_value: 8,
        content: {
          concept: `## Python Sets\nUnordered, **no duplicates** allowed.\n\n\`\`\`python\ns = {1, 2, 3, 2, 1}\nprint(s)  # {1, 2, 3}  (duplicates removed)\ns.add(4)\ns.discard(2)\n\`\`\`\n\nGreat for checking membership fast: \`5 in s\``,
          task: 'Create `s = {5, 3, 5, 1, 3}` and print it. Duplicates will be removed automatically.',
          initial_code: 's = {5, 3, 5, 1, 3}\n# Print the set\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '{1, 3, 5}' }]
        }
      },
      {
        level_id: 16, chapter_id: 3, order_num: 4, Title: 'Dictionaries', points_value: 20, coins_value: 8,
        content: {
          concept: `## Python Dictionaries\nKey-value pairs, ordered (Python 3.7+), changeable.\n\n\`\`\`python\nperson = {"name": "Ali", "age": 22}\nprint(person["name"])   # Ali\nperson["city"] = "LHR"  # add key\ndel person["age"]       # delete key\nprint(person.keys())    # dict_keys(['name','city'])\n\`\`\``,
          task: 'Create `car = {"brand":"Toyota","year":2022}`. Print the value of `"brand"`.',
          initial_code: '# Create dictionary and print brand\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Toyota' }]
        }
      },
      {
        level_id: 17, chapter_id: 3, order_num: 5, Title: 'Arrays & List Methods', points_value: 20, coins_value: 8,
        content: {
          concept: `## Python Arrays\nPython uses **lists** as arrays. Key list methods:\n\n| Method | Description |\n|---|---|\n| \`.append(x)\` | Add item to end |\n| \`.insert(i,x)\` | Add at index i |\n| \`.pop(i)\` | Remove at index i |\n| \`.index(x)\` | Find index of x |\n| \`.count(x)\` | Count occurrences |\n| \`.reverse()\` | Reverse in place |\n\n\`\`\`python\narr = [1, 2, 3]\narr.insert(1, 99)\nprint(arr)  # [1, 99, 2, 3]\n\`\`\``,
          task: 'Create `arr = [10, 20, 30]`. Insert `99` at index `1` and print it.',
          initial_code: 'arr = [10, 20, 30]\n# Insert 99 at index 1 and print\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '[10, 99, 20, 30]' }]
        }
      }
    ]
  }
];
