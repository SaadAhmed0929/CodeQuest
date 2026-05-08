// CHAPTERS 4-7: Control Flow, Functions, Advanced, String/RegEx
module.exports = [
  {
    chapter_id: 4, order_num: 4,
    Title: 'Chapter 4: Control Flow',
    Description: 'Make decisions and repeat actions with loops and conditions.',
    levels: [
      {
        level_id: 18, chapter_id: 4, order_num: 1, Title: 'If...Else', points_value: 25, coins_value: 10,
        content: {
          concept: `## Python If...Else\nExecute code based on conditions.\n\n\`\`\`python\nage = 20\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")\n\`\`\`\n\nShorthand (ternary): \`print("Yes") if x > 0 else print("No")\``,
          task: 'If `score = 75` is >= 50 print `Pass`, else print `Fail`.',
          initial_code: 'score = 75\n# Write if-else\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Pass' }]
        }
      },
      {
        level_id: 19, chapter_id: 4, order_num: 2, Title: 'Match Statement', points_value: 25, coins_value: 10,
        content: {
          concept: `## Python Match (Python 3.10+)\nLike a switch statement in other languages.\n\n\`\`\`python\nday = "Monday"\nmatch day:\n    case "Saturday" | "Sunday":\n        print("Weekend")\n    case "Monday":\n        print("Start of week")\n    case _:\n        print("Weekday")\n\`\`\``,
          task: 'Write a match on `color = "red"`. If `"red"` → print `Stop`, if `"green"` → print `Go`, else → print `Wait`.',
          initial_code: 'color = "red"\n# Write match statement\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Stop' }]
        }
      },
      {
        level_id: 20, chapter_id: 4, order_num: 3, Title: 'While Loops', points_value: 25, coins_value: 10,
        content: {
          concept: `## Python While Loops\nRepeats as long as condition is True.\n\n\`\`\`python\ni = 1\nwhile i <= 5:\n    print(i)\n    i += 1\n\`\`\`\n\nUse \`break\` to exit, \`continue\` to skip an iteration.\n\`\`\`python\nwhile True:\n    break  # exits immediately\n\`\`\``,
          task: 'Print numbers `1` through `5` using a while loop.',
          initial_code: 'i = 1\n# Complete the while loop\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '1\n2\n3\n4\n5' }]
        }
      },
      {
        level_id: 21, chapter_id: 4, order_num: 4, Title: 'For Loops', points_value: 25, coins_value: 10,
        content: {
          concept: `## Python For Loops\nIterates over any sequence.\n\n\`\`\`python\nfor fruit in ["apple","banana","cherry"]:\n    print(fruit)\n\`\`\`\n\nLoop through a string:\n\`\`\`python\nfor ch in "Python":\n    print(ch)\n\`\`\`\n\nUse \`range(start, stop, step)\` to loop a set number of times:\n\`\`\`python\nfor i in range(0, 10, 2):\n    print(i)  # 0 2 4 6 8\n\`\`\``,
          task: 'Loop through `["cricket","football","hockey"]` and print each item.',
          initial_code: 'sports = ["cricket", "football", "hockey"]\n# Write for loop\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'cricket\nfootball\nhockey' }]
        }
      },
      {
        level_id: 22, chapter_id: 4, order_num: 5, Title: 'Range', points_value: 25, coins_value: 10,
        content: {
          concept: `## Python range()\n\`range(stop)\` → 0 to stop-1\n\`range(start, stop)\` → start to stop-1\n\`range(start, stop, step)\` → custom step\n\n\`\`\`python\nfor i in range(5):         # 0,1,2,3,4\n    print(i)\nfor i in range(2, 10, 3): # 2,5,8\n    print(i)\n\`\`\``,
          task: 'Print even numbers from `0` to `10` (inclusive) using `range(0, 11, 2)`.',
          initial_code: '# Print even numbers 0 to 10\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '0\n2\n4\n6\n8\n10' }]
        }
      }
    ]
  },
  {
    chapter_id: 5, order_num: 5,
    Title: 'Chapter 5: Functions',
    Description: 'Write clean, reusable, and powerful code with functions.',
    levels: [
      {
        level_id: 23, chapter_id: 5, order_num: 1, Title: 'Creating Functions', points_value: 30, coins_value: 12,
        content: {
          concept: `## Python Functions\nDefine with \`def\`, call by name.\n\n\`\`\`python\ndef greet():\n    print("Hello from a function!")\n\ngreet()  # Call it\n\`\`\`\n\nFunctions prevent repetition and make code modular.`,
          task: 'Define a function `welcome` that prints `Welcome to CodeQuest!`. Then call it.',
          initial_code: '# Define and call the function\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Welcome to CodeQuest!' }]
        }
      },
      {
        level_id: 24, chapter_id: 5, order_num: 2, Title: 'Arguments', points_value: 30, coins_value: 12,
        content: {
          concept: `## Function Arguments\nPass data into functions via parameters.\n\n\`\`\`python\ndef greet(name):\n    print("Hello, " + name + "!")\n\ngreet("Alice")  # Hello, Alice!\n\`\`\`\n\n**Default values**: \`def greet(name="World"):\`\n**Multiple args**: \`def add(x, y): return x + y\``,
          task: 'Create `say_hello(name)` that prints `Hello, ` + name. Call it with `"Pakistan"`.',
          initial_code: '# Define and call say_hello\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Hello, Pakistan' }]
        }
      },
      {
        level_id: 25, chapter_id: 5, order_num: 3, Title: 'Return Values', points_value: 30, coins_value: 12,
        content: {
          concept: `## Return Values\nFunctions can return results using \`return\`.\n\n\`\`\`python\ndef square(x):\n    return x * x\n\nresult = square(5)\nprint(result)  # 25\n\`\`\`\n\nWithout \`return\`, a function returns \`None\`.`,
          task: 'Write a function `multiply(a, b)` that returns `a * b`. Call it with `6` and `7`, then print the result.',
          initial_code: '# Define multiply and print result\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '42' }]
        }
      },
      {
        level_id: 26, chapter_id: 5, order_num: 4, Title: 'Lambda Functions', points_value: 30, coins_value: 12,
        content: {
          concept: `## Lambda Functions\nAnonymous one-line functions.\n\n\`\`\`python\ndouble = lambda x: x * 2\nprint(double(5))  # 10\n\nadd = lambda a, b: a + b\nprint(add(3, 4))  # 7\n\`\`\`\n\nOften used with \`map()\`, \`filter()\`, \`sorted()\`.`,
          task: 'Create a lambda `cube` that cubes a number. Print `cube(3)`. Expected: `27`',
          initial_code: '# Create cube lambda and print cube(3)\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '27' }]
        }
      },
      {
        level_id: 27, chapter_id: 5, order_num: 5, Title: 'Iterators', points_value: 30, coins_value: 12,
        content: {
          concept: `## Python Iterators\nAn iterator is an object you can loop over. Use \`iter()\` and \`next()\`.\n\n\`\`\`python\nnums = [1, 2, 3]\nit = iter(nums)\nprint(next(it))  # 1\nprint(next(it))  # 2\n\`\`\`\n\nAll for-loops internally use iterators. Lists, tuples, dicts, and strings are all **iterable**.`,
          task: 'Create an iterator from `["X","Y","Z"]` and print the first two items using `next()`.',
          initial_code: 'items = ["X", "Y", "Z"]\nit = iter(items)\n# Print first two with next()\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'X\nY' }]
        }
      }
    ]
  },
  {
    chapter_id: 6, order_num: 6,
    Title: 'Chapter 6: Modules & Advanced',
    Description: 'Leverage Python\'s powerful built-in modules and error handling.',
    levels: [
      {
        level_id: 28, chapter_id: 6, order_num: 1, Title: 'Modules', points_value: 35, coins_value: 14,
        content: {
          concept: `## Python Modules\nA module is a file of reusable Python code. Import with \`import\`.\n\n\`\`\`python\nimport math\nprint(math.pi)       # 3.14159...\nprint(math.sqrt(16)) # 4.0\n\`\`\`\n\nImport specific items:\n\`\`\`python\nfrom math import ceil\nprint(ceil(4.2))  # 5\n\`\`\``,
          task: 'Import `math` and print `math.sqrt(144)`. Expected: `12.0`',
          initial_code: '# Import math and print sqrt(144)\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '12.0' }]
        }
      },
      {
        level_id: 29, chapter_id: 6, order_num: 2, Title: 'Python Math', points_value: 35, coins_value: 14,
        content: {
          concept: `## Python Math Module\nKey \`math\` functions:\n\n| Function | Result |\n|---|---|\n| \`math.floor(x)\` | Round down |\n| \`math.ceil(x)\` | Round up |\n| \`math.pow(x,y)\` | x to power y |\n| \`math.pi\` | 3.14159... |\n| \`math.factorial(n)\` | n! |\n\n\`\`\`python\nimport math\nprint(math.ceil(4.1))   # 5\nprint(math.floor(4.9))  # 4\n\`\`\``,
          task: 'Import `math` and print `math.factorial(5)`. Expected: `120`',
          initial_code: '# Print factorial of 5\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '120' }]
        }
      },
      {
        level_id: 30, chapter_id: 6, order_num: 3, Title: 'Try...Except', points_value: 35, coins_value: 14,
        content: {
          concept: `## Python Try...Except\nHandle errors gracefully without crashing.\n\n\`\`\`python\ntry:\n    x = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\nfinally:\n    print("This always runs")\n\`\`\`\n\nCommon exceptions: \`ZeroDivisionError\`, \`ValueError\`, \`TypeError\`, \`FileNotFoundError\``,
          task: 'Wrap `int("abc")` in a try-except. Catch the `ValueError` and print `Invalid number`.',
          initial_code: '# Try to convert "abc", catch ValueError\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Invalid number' }]
        }
      },
      {
        level_id: 31, chapter_id: 6, order_num: 4, Title: 'Python Dates', points_value: 35, coins_value: 14,
        content: {
          concept: `## Python Dates\nUse the \`datetime\` module.\n\n\`\`\`python\nimport datetime\nnow = datetime.datetime.now()\nprint(now.year)\nprint(now.strftime("%Y-%m-%d"))\n\`\`\`\n\nCreate a specific date:\n\`\`\`python\nd = datetime.date(2024, 1, 15)\nprint(d)  # 2024-01-15\n\`\`\``,
          task: 'Import `datetime` and print a date object for `2025-01-01` using `datetime.date(2025, 1, 1)`.',
          initial_code: '# Print date 2025-01-01\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: '2025-01-01' }]
        }
      },
      {
        level_id: 32, chapter_id: 6, order_num: 5, Title: 'Python JSON', points_value: 35, coins_value: 14,
        content: {
          concept: `## Python JSON\nJSON is a data format used widely in APIs and web services.\n\n\`\`\`python\nimport json\n\n# Convert Python dict → JSON string\ndata = {"name": "Ali", "age": 22}\njson_str = json.dumps(data)\nprint(json_str)  # {"name": "Ali", "age": 22}\n\n# Convert JSON string → Python dict\nd = json.loads('{"score": 100}')\nprint(d["score"])  # 100\n\`\`\``,
          task: 'Import `json`. Parse `\'{"lang": "Python"}\'` with `json.loads()` and print the value of `"lang"`.',
          initial_code: 'import json\n# Parse and print\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'Python' }]
        }
      }
    ]
  },
  {
    chapter_id: 7, order_num: 7,
    Title: 'Chapter 7: String Power & RegEx',
    Description: 'Master string manipulation and pattern matching.',
    levels: [
      {
        level_id: 33, chapter_id: 7, order_num: 1, Title: 'String Methods', points_value: 40, coins_value: 16,
        content: {
          concept: `## String Methods Reference\n\n| Method | Example | Result |\n|---|---|---|\n| \`.strip()\` | \`" hi ".strip()\` | \`"hi"\` |\n| \`.split()\` | \`"a,b".split(",")\` | \`["a","b"]\` |\n| \`.join()\` | \`"-".join(["a","b"])\` | \`"a-b"\` |\n| \`.find()\` | \`"hello".find("l")\` | \`2\` |\n| \`.startswith()\` | \`"Hi".startswith("H")\` | \`True\` |\n| \`.count()\` | \`"hello".count("l")\` | \`2\` |`,
          task: 'Split `"python,java,cpp"` by `","` and print the result.',
          initial_code: 's = "python,java,cpp"\n# Split by comma and print\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: "['python', 'java', 'cpp']" }]
        }
      },
      {
        level_id: 34, chapter_id: 7, order_num: 2, Title: 'RegEx', points_value: 40, coins_value: 16,
        content: {
          concept: `## Python RegEx\nThe \`re\` module finds patterns in strings.\n\n\`\`\`python\nimport re\n\n# Search for a pattern\nresult = re.search("qu", "CodeQuest")\nprint(result.group())  # qu  (case-sensitive)\n\n# Find all matches\nmatches = re.findall("[0-9]+", "I have 3 cats and 12 dogs")\nprint(matches)  # ['3', '12']\n\`\`\``,
          task: 'Use `re.findall("[0-9]+", "Score: 99 out of 100")` and print the result.',
          initial_code: 'import re\n# Find all numbers\n',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: "['99', '100']" }]
        }
      },
      {
        level_id: 35, chapter_id: 7, order_num: 3, Title: 'Python PIP & Packages', points_value: 40, coins_value: 16,
        content: {
          concept: `## Python PIP\nPIP is Python's package manager. Install packages from the terminal:\n\`\`\`\npip install requests\n\`\`\`\n\nThe Python Standard Library already includes tons of modules — \`math\`, \`random\`, \`os\`, \`json\`, \`datetime\`, etc.\n\n\`\`\`python\nimport random\nprint(random.randint(1, 10))  # Random 1-10\n\`\`\``,
          task: 'Import `random` and print `random.choice(["rock","paper","scissors"])`. Any of the three values will be accepted.',
          initial_code: 'import random\nrandom.seed(42)  # Fixed seed for consistent output\nresult = random.choice(["rock", "paper", "scissors"])\nprint(result)',
          test_cases: [{ label: 'Test 1', hidden_code: '', expected_output: 'paper' }]
        }
      }
    ]
  }
];
