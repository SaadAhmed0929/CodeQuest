// Full curriculum — used as frontend fallback when backend is unreachable.
// Keep in sync with server/data/curriculum_part1.js and curriculum_part2.js

const CURRICULUM = [
  {
    chapter_id: 1, order_num: 1,
    Title: 'Chapter 1: Getting Started', Description: 'Write your very first Python programs.',
    levels: [
      { level_id:1, Title:'Hello, World!', points_value:10, coins_value:5, content: { concept:`## Python Introduction\nPython is a popular, easy-to-learn programming language used for web development, data science, AI, and automation.\n\nYour very first Python program:\n\`\`\`python\nprint("Hello, World!")\n\`\`\`\nThe \`print()\` function outputs text to the console.`, task:'Use `print()` to display `Hello, World!`', initial_code:'# Your first Python program\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Hello, World!'}] } },
      { level_id:2, Title:'Python Intro & Setup', points_value:10, coins_value:5, content: { concept:`## What Can Python Do?\n- Web development (Django, Flask)\n- Data analysis & AI (Pandas, TensorFlow)\n- Automation & scripting\n\n\`\`\`python\nprint("Python is awesome!")\n\`\`\``, task:'Print two lines: `Python is fun!` then `Let us code!`', initial_code:'# Print two lines\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Python is fun!\nLet us code!'}] } },
      { level_id:3, Title:'Python Syntax', points_value:10, coins_value:5, content: { concept:`## Python Syntax\nPython uses **indentation** to define code blocks.\n\n\`\`\`python\nif 5 > 2:\n    print("Five is greater!")\n\`\`\``, task:'Fix the indentation: the `print` must be inside the `if` block.', initial_code:'if 10 > 5:\nprint("Ten is greater!")', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Ten is greater!'}] } },
      { level_id:4, Title:'Python Output', points_value:10, coins_value:5, content: { concept:`## Python print()\nThe \`print()\` function can output multiple values.\n\n\`\`\`python\nprint("Name:", "Alice")\nprint("Age:", 25)\n\`\`\``, task:'Print `Name: CodeQuest` and `Score: 100` each on a separate line.', initial_code:'# Print two labeled lines\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Name: CodeQuest\nScore: 100'}] } },
      { level_id:5, Title:'Comments', points_value:10, coins_value:5, content: { concept:`## Python Comments\nComments start with \`#\` and are ignored by Python.\n\n\`\`\`python\n# Single-line comment\nprint("Hello")  # inline comment\n\`\`\``, task:'Add a comment `# My mission` on line 1, then print `Mission started!`', initial_code:'\nprint("")', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Mission started!'}] } },
    ]
  },
  {
    chapter_id: 2, order_num: 2,
    Title: 'Chapter 2: Variables & Data Types', Description: 'Store, type, and transform all kinds of data.',
    levels: [
      { level_id:6,  Title:'Variables',  points_value:15, coins_value:6, content: { concept:`## Python Variables\nVariables store data. No declaration keyword needed.\n\n\`\`\`python\nname = "Alice"\nage = 25\nprint(name, age)\n\`\`\``, task:'Create variable `city = "Lahore"` and print it.', initial_code:'# Create and print city\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Lahore'}] } },
      { level_id:7,  Title:'Data Types', points_value:15, coins_value:6, content: { concept:`## Python Data Types\n| Type | Example |\n|---|---|\n| str | \`"Hello"\` |\n| int | \`42\` |\n| float | \`3.14\` |\n| bool | \`True\` |\n\nCheck type with \`type()\`.`, task:"Print the type of `3.14`. Output must be `<class 'float'>`", initial_code:'# Print the type of 3.14\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:"<class 'float'>"}] } },
      { level_id:8,  Title:'Numbers',    points_value:15, coins_value:6, content: { concept:`## Python Numbers\n\`\`\`python\nx = 10\nprint(x ** 2)  # 100 (power)\nprint(x % 3)   # 1   (modulo)\n\`\`\``, task:'Calculate `2 ** 8` and print the result.', initial_code:'# Print 2 to the power of 8\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'256'}] } },
      { level_id:9,  Title:'Casting',    points_value:15, coins_value:6, content: { concept:`## Python Casting\n\`\`\`python\nint("42")   # 42\nfloat(5)    # 5.0\nstr(100)    # "100"\n\`\`\``, task:'Cast the string `"99"` to an integer, add `1`, and print the result.', initial_code:'# Cast "99" to int, add 1, print\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'100'}] } },
      { level_id:10, Title:'Strings',    points_value:15, coins_value:6, content: { concept:`## Python Strings\n\`\`\`python\ns = "Hello, World!"\nprint(s.upper())  # HELLO, WORLD!\nprint(len(s))     # 13\n\`\`\``, task:'Create `s = "codequest"` and print it in all UPPERCASE.', initial_code:'s = "codequest"\n# Print in uppercase\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'CODEQUEST'}] } },
      { level_id:11, Title:'Booleans',   points_value:15, coins_value:6, content: { concept:`## Python Booleans\n\`\`\`python\nprint(10 > 9)    # True\nprint(bool("")) # False\n\`\`\``, task:'Print the result of `500 == 500`. Expected: `True`', initial_code:'# Print the boolean result\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'True'}] } },
      { level_id:12, Title:'Operators',  points_value:15, coins_value:6, content: { concept:`## Python Operators\n**Arithmetic**: \`+ - * / // % **\`\n**Comparison**: \`== != > < >= <=\`\n**Logical**: \`and or not\``, task:'Print the remainder of `17 % 5`. Expected: `2`', initial_code:'# Print 17 modulo 5\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'2'}] } },
    ]
  },
  {
    chapter_id: 3, order_num: 3,
    Title: 'Chapter 3: Collections', Description: "Group and organize data with Python's collection types.",
    levels: [
      { level_id:13, Title:'Lists',              points_value:20, coins_value:8, content: { concept:`## Python Lists\n\`\`\`python\nfruits = ["apple","banana"]\nfruits.append("mango")\nprint(len(fruits))  # 3\n\`\`\``, task:'Create `nums = [3, 1, 4, 1, 5]`, sort it, then print it.', initial_code:'nums = [3, 1, 4, 1, 5]\n# Sort and print\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'[1, 1, 3, 4, 5]'}] } },
      { level_id:14, Title:'Tuples',             points_value:20, coins_value:8, content: { concept:`## Python Tuples\nOrdered, **unchangeable**.\n\`\`\`python\npoint = (10, 20, 30)\nprint(point[1])  # 20\n\`\`\``, task:'Create `colors = ("red", "green", "blue")` and print its length.', initial_code:'# Create tuple and print length\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'3'}] } },
      { level_id:15, Title:'Sets',               points_value:20, coins_value:8, content: { concept:`## Python Sets\nUnordered, **no duplicates**.\n\`\`\`python\ns = {1, 2, 3, 2, 1}\nprint(s)  # {1, 2, 3}\n\`\`\``, task:'Create `s = {5, 3, 5, 1, 3}` and print it.', initial_code:'s = {5, 3, 5, 1, 3}\n# Print the set\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'{1, 3, 5}'}] } },
      { level_id:16, Title:'Dictionaries',        points_value:20, coins_value:8, content: { concept:`## Python Dictionaries\n\`\`\`python\nperson = {"name": "Ali", "age": 22}\nprint(person["name"])  # Ali\n\`\`\``, task:'Create `car = {"brand":"Toyota","year":2022}`. Print the value of `"brand"`.', initial_code:'# Create dictionary and print brand\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Toyota'}] } },
      { level_id:17, Title:'Arrays & List Methods', points_value:20, coins_value:8, content: { concept:`## List Methods\n| Method | Description |\n|---|---|\n| \`.append(x)\` | Add to end |\n| \`.insert(i,x)\` | Add at index |\n| \`.pop(i)\` | Remove at index |\n| \`.reverse()\` | Reverse in place |`, task:'Create `arr = [10, 20, 30]`. Insert `99` at index `1` and print it.', initial_code:'arr = [10, 20, 30]\n# Insert 99 at index 1 and print\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'[10, 99, 20, 30]'}] } },
    ]
  },
  {
    chapter_id: 4, order_num: 4,
    Title: 'Chapter 4: Control Flow', Description: 'Make decisions and repeat actions.',
    levels: [
      { level_id:18, Title:'If...Else',       points_value:25, coins_value:10, content: { concept:`## Python If...Else\n\`\`\`python\nage = 20\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")\n\`\`\``, task:'If `score = 75` is >= 50 print `Pass`, else print `Fail`.', initial_code:'score = 75\n# Write if-else\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Pass'}] } },
      { level_id:19, Title:'Match Statement', points_value:25, coins_value:10, content: { concept:`## Python Match (3.10+)\n\`\`\`python\nday = "Monday"\nmatch day:\n    case "Saturday": print("Weekend")\n    case _: print("Weekday")\n\`\`\``, task:'Match on `color = "red"`: `"red"` → `Stop`, `"green"` → `Go`, else → `Wait`.', initial_code:'color = "red"\n# Write match statement\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Stop'}] } },
      { level_id:20, Title:'While Loops',     points_value:25, coins_value:10, content: { concept:`## While Loops\n\`\`\`python\ni = 1\nwhile i <= 5:\n    print(i)\n    i += 1\n\`\`\``, task:'Print numbers `1` through `5` using a while loop.', initial_code:'i = 1\n# Complete the while loop\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'1\n2\n3\n4\n5'}] } },
      { level_id:21, Title:'For Loops',       points_value:25, coins_value:10, content: { concept:`## For Loops\n\`\`\`python\nfor fruit in ["apple","banana"]:\n    print(fruit)\n\`\`\``, task:'Loop through `["cricket","football","hockey"]` and print each item.', initial_code:'sports = ["cricket", "football", "hockey"]\n# Write for loop\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'cricket\nfootball\nhockey'}] } },
      { level_id:22, Title:'Range',           points_value:25, coins_value:10, content: { concept:`## range()\n\`range(stop)\` · \`range(start,stop)\` · \`range(start,stop,step)\`\n\n\`\`\`python\nfor i in range(0, 10, 2):\n    print(i)  # 0 2 4 6 8\n\`\`\``, task:'Print even numbers from `0` to `10` using `range(0, 11, 2)`.', initial_code:'# Print even numbers 0 to 10\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'0\n2\n4\n6\n8\n10'}] } },
    ]
  },
  {
    chapter_id: 5, order_num: 5,
    Title: 'Chapter 5: Functions', Description: 'Write clean, reusable, and powerful code.',
    levels: [
      { level_id:23, Title:'Creating Functions', points_value:30, coins_value:12, content: { concept:`## Functions\n\`\`\`python\ndef greet():\n    print("Hello!")\ngreet()\n\`\`\``, task:'Define a function `welcome` that prints `Welcome to CodeQuest!`. Then call it.', initial_code:'# Define and call the function\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Welcome to CodeQuest!'}] } },
      { level_id:24, Title:'Arguments',         points_value:30, coins_value:12, content: { concept:`## Function Arguments\n\`\`\`python\ndef greet(name):\n    print("Hello, " + name + "!")\ngreet("Alice")\n\`\`\``, task:'Create `say_hello(name)` that prints `Hello, ` + name. Call it with `"Pakistan"`.', initial_code:'# Define and call say_hello\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Hello, Pakistan'}] } },
      { level_id:25, Title:'Return Values',     points_value:30, coins_value:12, content: { concept:`## Return Values\n\`\`\`python\ndef square(x):\n    return x * x\nprint(square(5))  # 25\n\`\`\``, task:'Write `multiply(a, b)` that returns `a * b`. Call it with `6, 7` and print the result.', initial_code:'# Define multiply and print result\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'42'}] } },
      { level_id:26, Title:'Lambda Functions', points_value:30, coins_value:12, content: { concept:`## Lambda\n\`\`\`python\ndouble = lambda x: x * 2\nprint(double(5))  # 10\n\`\`\``, task:'Create a lambda `cube` that cubes a number. Print `cube(3)`. Expected: `27`', initial_code:'# Create cube lambda and print cube(3)\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'27'}] } },
      { level_id:27, Title:'Iterators',        points_value:30, coins_value:12, content: { concept:`## Iterators\n\`\`\`python\nnums = [1, 2, 3]\nit = iter(nums)\nprint(next(it))  # 1\n\`\`\``, task:'Create an iterator from `["X","Y","Z"]` and print the first two items using `next()`.', initial_code:'items = ["X", "Y", "Z"]\nit = iter(items)\n# Print first two with next()\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'X\nY'}] } },
    ]
  },
  {
    chapter_id: 6, order_num: 6,
    Title: 'Chapter 6: Modules & Advanced', Description: "Leverage Python's built-in modules and error handling.",
    levels: [
      { level_id:28, Title:'Modules',      points_value:35, coins_value:14, content: { concept:`## Modules\n\`\`\`python\nimport math\nprint(math.sqrt(16))  # 4.0\n\`\`\``, task:'Import `math` and print `math.sqrt(144)`. Expected: `12.0`', initial_code:'# Import math and print sqrt(144)\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'12.0'}] } },
      { level_id:29, Title:'Python Math',  points_value:35, coins_value:14, content: { concept:`## Math Module\n\`\`\`python\nimport math\nprint(math.ceil(4.1))   # 5\nprint(math.floor(4.9))  # 4\n\`\`\``, task:'Import `math` and print `math.factorial(5)`. Expected: `120`', initial_code:'# Print factorial of 5\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'120'}] } },
      { level_id:30, Title:'Try...Except', points_value:35, coins_value:14, content: { concept:`## Try...Except\n\`\`\`python\ntry:\n    x = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\n\`\`\``, task:'Wrap `int("abc")` in a try-except. Catch `ValueError` and print `Invalid number`.', initial_code:'# Try to convert "abc", catch ValueError\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Invalid number'}] } },
      { level_id:31, Title:'Python Dates', points_value:35, coins_value:14, content: { concept:`## Datetime Module\n\`\`\`python\nimport datetime\nd = datetime.date(2024, 1, 15)\nprint(d)  # 2024-01-15\n\`\`\``, task:'Import `datetime` and print `datetime.date(2025, 1, 1)`.', initial_code:'# Print date 2025-01-01\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'2025-01-01'}] } },
      { level_id:32, Title:'Python JSON',  points_value:35, coins_value:14, content: { concept:`## JSON Module\n\`\`\`python\nimport json\nd = json.loads('{"score": 100}')\nprint(d["score"])  # 100\n\`\`\``, task:`Import \`json\`. Parse \`'{"lang": "Python"}'\` and print the value of \`"lang"\`.`, initial_code:'import json\n# Parse and print\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'Python'}] } },
    ]
  },
  {
    chapter_id: 7, order_num: 7,
    Title: 'Chapter 7: String Power & RegEx', Description: 'Master string manipulation and pattern matching.',
    levels: [
      { level_id:33, Title:'String Methods', points_value:40, coins_value:16, content: { concept:`## String Methods\n| Method | Result |\n|---|---|\n| \`.strip()\` | Remove whitespace |\n| \`.split()\` | Split to list |\n| \`.join()\` | Join list to string |\n| \`.find()\` | Find index |`, task:'Split `"python,java,cpp"` by `","` and print the result.', initial_code:'s = "python,java,cpp"\n# Split by comma and print\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:"['python', 'java', 'cpp']"}] } },
      { level_id:34, Title:'RegEx',          points_value:40, coins_value:16, content: { concept:`## RegEx\n\`\`\`python\nimport re\nmatches = re.findall("[0-9]+", "I have 3 cats and 12 dogs")\nprint(matches)  # ['3', '12']\n\`\`\``, task:'Use `re.findall("[0-9]+", "Score: 99 out of 100")` and print the result.', initial_code:'import re\n# Find all numbers\n', test_cases:[{label:'Test 1',hidden_code:'',expected_output:"['99', '100']"}] } },
      { level_id:35, Title:'PIP & Packages', points_value:40, coins_value:16, content: { concept:`## PIP\nInstall packages: \`pip install requests\`\n\n\`\`\`python\nimport random\nprint(random.randint(1, 10))\n\`\`\``, task:'Import `random`, set `random.seed(42)`, then print `random.choice(["rock","paper","scissors"])`.', initial_code:'import random\nrandom.seed(42)\nresult = random.choice(["rock", "paper", "scissors"])\nprint(result)', test_cases:[{label:'Test 1',hidden_code:'',expected_output:'paper'}] } },
    ]
  },
];

// Build flat lookup map: level_id → level object
export const LEVEL_MAP = {};
for (const chapter of CURRICULUM) {
  for (const level of chapter.levels) {
    LEVEL_MAP[level.level_id] = level;
  }
}

export default CURRICULUM;
