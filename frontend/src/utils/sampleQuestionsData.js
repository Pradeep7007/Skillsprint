export const SAMPLE_QUESTIONS_BY_CATEGORY = {
  "Technical": [
    {
      "category": "Technical",
      "topic": "Computer Networks",
      "difficulty": "Easy",
      "question": "Which layer of the OSI model is responsible for routing packets across networks?",
      "options": [
        "Data Link Layer",
        "Network Layer",
        "Transport Layer",
        "Session Layer"
      ],
      "correctAnswer": "Network Layer",
      "explanation": "The Network Layer handles logical addressing, packet routing, and forwarding across networks."
    },
    {
      "category": "Technical",
      "topic": "Operating Systems",
      "difficulty": "Easy",
      "question": "Which CPU scheduling algorithm leads to starvation of longer processes?",
      "options": [
        "Round Robin",
        "Shortest Job First (SJF) Non-Preemptive",
        "First Come First Served (FCFS)",
        "Priority-based / Shortest Remaining Time First"
      ],
      "correctAnswer": "Priority-based / Shortest Remaining Time First",
      "explanation": "Shortest Remaining Time First (and SJF) continuously schedules shorter processes first, causing longer processes to starve."
    },
    {
      "category": "Technical",
      "topic": "DBMS",
      "difficulty": "Easy",
      "question": "Which of the following properties ensures that all database transactions are either fully completed or not executed at all?",
      "options": [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability"
      ],
      "correctAnswer": "Atomicity",
      "explanation": "Atomicity ensures that a transaction is treated as a single unit, which either succeeds entirely or fails completely (all-or-nothing)."
    },
    {
      "category": "Technical",
      "topic": "OOPS",
      "difficulty": "Easy",
      "question": "What OOPS concept allows a subclass to provide a specific implementation of a method that is already defined in its superclass?",
      "options": [
        "Method Overriding",
        "Method Overloading",
        "Encapsulation",
        "Abstraction"
      ],
      "correctAnswer": "Method Overriding",
      "explanation": "Method overriding allows a child class to rewrite a method of its parent class to execute specialized code."
    },
    {
      "category": "Technical",
      "topic": "Java",
      "difficulty": "Easy",
      "question": "Which area of Java memory is used to store objects created via the 'new' keyword?",
      "options": [
        "Stack Memory",
        "Heap Memory",
        "Method Area",
        "PC Register"
      ],
      "correctAnswer": "Heap Memory",
      "explanation": "All objects in Java are dynamically allocated on the Heap Memory."
    },
    {
      "category": "Technical",
      "topic": "Data Structures",
      "difficulty": "Easy",
      "question": "Which data structure follows the Last In First Out (LIFO) principle?",
      "options": [
        "Queue",
        "Stack",
        "Linked List",
        "Binary Tree"
      ],
      "correctAnswer": "Stack",
      "explanation": "A stack is a linear data structure that operates under the LIFO principle (elements added last are retrieved first)."
    },
    {
      "category": "Technical",
      "topic": "Algorithms",
      "difficulty": "Easy",
      "question": "Which sorting algorithm has a worst-case time complexity of O(n^2)?",
      "options": [
        "Merge Sort",
        "Quick Sort",
        "Heap Sort",
        "All of the above"
      ],
      "correctAnswer": "Quick Sort",
      "explanation": "Quick Sort has a worst-case time complexity of O(n^2) when the pivot divides the array unevenly (e.g. sorted arrays). Merge/Heap sorts are O(n log n) in worst cases."
    },
    {
      "category": "Technical",
      "topic": "Predict Output",
      "difficulty": "Medium",
      "question": "Predict the output of the following Java code:\n\nint a = 5;\nint b = a++;\nSystem.out.println(\"a=\" + a + \", b=\" + b);",
      "options": [
        "a=6, b=5",
        "a=5, b=5",
        "a=6, b=6",
        "a=5, b=6"
      ],
      "correctAnswer": "a=6, b=5",
      "explanation": "In post-increment (a++), the current value 5 is assigned to b first, and then a is incremented to 6."
    },
    {
      "category": "Technical",
      "topic": "Code Debugging",
      "difficulty": "Medium",
      "question": "Debug this C code snippet:\n\nfor (int i = 0; i <= 5; i++);\n{\n    printf(\"%d \", i);\n}\n\nWhat is the bug?",
      "options": [
        "Semicolon at the end of for-loop makes it an empty loop, printing only 6 once.",
        "The loop will print 0 to 5.",
        "Infinite loop occurs.",
        "Syntax error on printf."
      ],
      "correctAnswer": "Semicolon at the end of for-loop makes it an empty loop, printing only 6 once.",
      "explanation": "The semicolon terminates the for-statement. The block following it is executed once after the loop completes with i=6."
    },
    {
      "category": "Technical",
      "topic": "Pseudocode",
      "difficulty": "Medium",
      "question": "What is the output of the following pseudocode?\n\nFunction compute(X, Y):\n    Set X = X + Y\n    Set Y = X - Y\n    Set X = X - Y\n    Print X, \", \", Y\nEnd Function\n\nCall compute(10, 20)",
      "options": [
        "10, 20",
        "20, 10",
        "30, 20",
        "30, 10"
      ],
      "correctAnswer": "20, 10",
      "explanation": "This pseudocode executes a classic swap algorithm. X becomes 30, Y becomes 10, and X becomes 20. Output is 20, 10."
    },
    {
      "category": "Technical",
      "topic": "JavaScript",
      "difficulty": "Easy",
      "question": "Which keyword is used to declare block-scoped variables in modern ES6 JavaScript?",
      "options": [
        "var",
        "let",
        "global",
        "def"
      ],
      "correctAnswer": "let",
      "explanation": "In ES6 JavaScript, 'let' and 'const' provide block scoping, whereas 'var' provides function scoping."
    },
    {
      "category": "Technical",
      "topic": "AngularJS",
      "difficulty": "Easy",
      "question": "Which directive in AngularJS achieves two-way data binding between input elements and scope variables?",
      "options": [
        "ng-bind",
        "ng-model",
        "ng-repeat",
        "ng-app"
      ],
      "correctAnswer": "ng-model",
      "explanation": "The 'ng-model' directive binds the value of HTML controls (input, select, textarea) to application scope data in AngularJS."
    },
    {
      "category": "Technical",
      "topic": "Node.js",
      "difficulty": "Easy",
      "question": "Which built-in Node.js module provides utilities for working with file and directory paths?",
      "options": [
        "fs",
        "path",
        "http",
        "url"
      ],
      "correctAnswer": "path",
      "explanation": "The Node.js 'path' module provides utilities for joining, resolving, and manipulating file and directory paths across different OS platforms."
    },
    {
      "category": "Technical",
      "topic": "Express.js",
      "difficulty": "Easy",
      "question": "In Express.js, which method registers a middleware function that runs for all incoming HTTP requests?",
      "options": [
        "app.all()",
        "app.use()",
        "app.get()",
        "app.listen()"
      ],
      "correctAnswer": "app.use()",
      "explanation": "app.use() mounts specified middleware functions at the path specified (or globally if no path is given)."
    },
    {
      "category": "Technical",
      "topic": "MongoDB",
      "difficulty": "Easy",
      "question": "What binary data format does MongoDB use to store document data internally?",
      "options": [
        "JSON",
        "XML",
        "BSON",
        "Protocol Buffers"
      ],
      "correctAnswer": "BSON",
      "explanation": "MongoDB stores data records as BSON (Binary JSON) documents, extending JSON to support data types like Date and Binary."
    },
    {
      "category": "Technical",
      "topic": "HTML & CSS",
      "difficulty": "Easy",
      "question": "Which HTML element specifies a header for a document or section, and which CSS property sets element font size?",
      "options": [
        "<header> and font-size",
        "<head> and text-size",
        "<top> and font-weight",
        "<section> and text-style"
      ],
      "correctAnswer": "<header> and font-size",
      "explanation": "The <header> HTML tag defines introductory content, and the CSS 'font-size' property controls text scale."
    }
  ],
  "Aptitude": [
    {
      "category": "Aptitude",
      "topic": "Number System",
      "difficulty": "Easy",
      "question": "What is the unit digit in the product (3^65 * 6^59 * 7^71)?",
      "options": [
        "1",
        "2",
        "4",
        "6"
      ],
      "correctAnswer": "4",
      "explanation": "Unit digit of 3^65 = 3^(4*16 + 1) = 3^1 = 3. Unit digit of 6^59 = 6. Unit digit of 7^71 = 7^(4*17 + 3) = 7^3 = 3. Product of unit digits = 3 * 6 * 3 = 54. Therefore, the unit digit is 4."
    },
    {
      "category": "Aptitude",
      "topic": "LCM",
      "difficulty": "Easy",
      "question": "Find the LCM of 2/3, 3/5, 4/7 and 9/13.",
      "options": [
        "36",
        "1/36",
        "12/455",
        "36/455"
      ],
      "correctAnswer": "36",
      "explanation": "LCM of fractions = LCM of Numerators / HCF of Denominators. Numerators are 2, 3, 4, 9 (LCM = 36). Denominators are 3, 5, 7, 13 (HCF = 1). LCM = 36/1 = 36."
    },
    {
      "category": "Aptitude",
      "topic": "HCF",
      "difficulty": "Easy",
      "question": "Find the HCF of 18/25, 12/10, and 24/35.",
      "options": [
        "6/350",
        "6/5",
        "6/175",
        "12/175"
      ],
      "correctAnswer": "6/175",
      "explanation": "HCF of fractions = HCF of Numerators / LCM of Denominators. HCF(18, 12, 24) = 6. LCM(25, 10, 35) = 175. Thus, HCF = 6/175."
    },
    {
      "category": "Aptitude",
      "topic": "Percentage",
      "difficulty": "Easy",
      "question": "If A's salary is 25% more than B's salary, then by what percent is B's salary less than A's salary?",
      "options": [
        "15%",
        "20%",
        "25%",
        "30%"
      ],
      "correctAnswer": "20%",
      "explanation": "Let B's salary be 100. Then A's salary is 125. Difference is 25. B's salary is less than A's by (25 / 125) * 100 = 20%."
    },
    {
      "category": "Aptitude",
      "topic": "Profit and Loss",
      "difficulty": "Easy",
      "question": "An article is sold for $300 at a loss of 25%. What is the cost price of the article?",
      "options": [
        "$375",
        "$400",
        "$425",
        "$450"
      ],
      "correctAnswer": "$400",
      "explanation": "Loss is 25%, meaning selling price is 75% of Cost Price. 0.75 * CP = 300 => CP = 300 / 0.75 = 400."
    },
    {
      "category": "Aptitude",
      "topic": "Ratio",
      "difficulty": "Easy",
      "question": "If A : B = 2 : 3 and B : C = 4 : 5, find A : B : C.",
      "options": [
        "8 : 12 : 15",
        "2 : 4 : 5",
        "6 : 9 : 15",
        "8 : 10 : 15"
      ],
      "correctAnswer": "8 : 12 : 15",
      "explanation": "Multiply A:B by 4 to get 8:12. Multiply B:C by 3 to get 12:15. Combining them gives A:B:C = 8:12:15."
    },
    {
      "category": "Aptitude",
      "topic": "Average",
      "difficulty": "Easy",
      "question": "The average of 5 consecutive odd numbers is 25. What is the largest of these numbers?",
      "options": [
        "27",
        "29",
        "31",
        "33"
      ],
      "correctAnswer": "29",
      "explanation": "The average of consecutive numbers is the middle term. So the numbers are 21, 23, 25, 27, 29. The largest is 29."
    },
    {
      "category": "Aptitude",
      "topic": "SI",
      "difficulty": "Easy",
      "question": "A sum of money at simple interest doubles itself in 8 years. What is the rate of interest per annum?",
      "options": [
        "10%",
        "12.5%",
        "15%",
        "16.67%"
      ],
      "correctAnswer": "12.5%",
      "explanation": "If Principal P doubles, the Simple Interest (SI) gained is P. SI = (P * R * T) / 100 => P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%."
    },
    {
      "category": "Aptitude",
      "topic": "CI",
      "difficulty": "Easy",
      "question": "Find the compound interest on $10,000 for 2 years at 10% per annum compounded annually.",
      "options": [
        "$2000",
        "$2100",
        "$2200",
        "$2300"
      ],
      "correctAnswer": "$2100",
      "explanation": "Amount = P(1 + R/100)^T = 10000(1.1)^2 = 12100. CI = Amount - Principal = 12100 - 10000 = 2100."
    },
    {
      "category": "Aptitude",
      "topic": "Time and Work",
      "difficulty": "Easy",
      "question": "A can do a piece of work in 10 days and B can do it in 15 days. In how many days can they complete it working together?",
      "options": [
        "5 days",
        "6 days",
        "8 days",
        "9 days"
      ],
      "correctAnswer": "6 days",
      "explanation": "A's 1-day work = 1/10. B's 1-day work = 1/15. Together 1-day work = 1/10 + 1/15 = 5/30 = 1/6. Time taken = 6 days."
    },
    {
      "category": "Aptitude",
      "topic": "Time and Distance",
      "difficulty": "Easy",
      "question": "A train 120 m long passes a telegraph post in 6 seconds. Find the speed of the train in km/h.",
      "options": [
        "60 km/h",
        "72 km/h",
        "80 km/h",
        "90 km/h"
      ],
      "correctAnswer": "72 km/h",
      "explanation": "Speed = Distance / Time = 120 / 6 = 20 m/s. In km/h = 20 * 18/5 = 72 km/h."
    },
    {
      "category": "Aptitude",
      "topic": "Ages",
      "difficulty": "Easy",
      "question": "The ratio of ages of Ram and Shyam is 4:5. If the sum of their ages is 81, what is Shyam's age?",
      "options": [
        "36",
        "45",
        "54",
        "60"
      ],
      "correctAnswer": "45",
      "explanation": "Ram's age = 4x, Shyam's age = 5x. 4x + 5x = 9x = 81 => x = 9. Shyam's age = 5 * 9 = 45."
    }
  ],
  "Logical": [
    {
      "category": "Logical",
      "topic": "Blood Relation",
      "difficulty": "Easy",
      "question": "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
      "options": [
        "His own",
        "His son's",
        "His father's",
        "His nephew's"
      ],
      "correctAnswer": "His son's",
      "explanation": "Since the man has no brother or sister, 'my father's son' is himself. Thus, 'that man's father is myself'. Therefore, the photograph is of his son."
    },
    {
      "category": "Logical",
      "topic": "Coding Decoding",
      "difficulty": "Easy",
      "question": "If in a certain language, SYSTEM is written as SYSMET and NEARER is written as AENRER, then how will FRACTION be written?",
      "options": [
        "CARFTION",
        "CARFNOIT",
        "ARFCNOIT",
        "CARFTNOI"
      ],
      "correctAnswer": "CARFNOIT",
      "explanation": "The word is split into two halves. First half: SYS becomes SYS (reversed is SYS). MET becomes MET (reversed is TEM). For FRACTION: first half FRAC reversed is CARF, second half TION reversed is NOIT. Combined: CARFNOIT."
    },
    {
      "category": "Logical",
      "topic": "Seating Arrangement",
      "difficulty": "Easy",
      "question": "Five boys A, B, C, D, and E are sitting in a row. A is to the right of B, E is to the left of B but to the right of C. A is to the left of D. Who is sitting in the middle?",
      "options": [
        "A",
        "B",
        "D",
        "E"
      ],
      "correctAnswer": "B",
      "explanation": "Order from left to right: E is left of B, C is left of E => C - E - B. A is right of B and left of D => B - A - D. Combined: C - E - B - A - D. Middle boy is B."
    },
    {
      "category": "Logical",
      "topic": "Direction",
      "difficulty": "Easy",
      "question": "A man walks 5 km East, then turns right and walks 4 km. Finally, he turns left and walks 5 km. Which direction is he facing now?",
      "options": [
        "East",
        "West",
        "North",
        "South"
      ],
      "correctAnswer": "East",
      "explanation": "He starts facing East. Turning right makes him face South. Turning left from South makes him face East again."
    },
    {
      "category": "Logical",
      "topic": "Series",
      "difficulty": "Easy",
      "question": "Find the missing term in the series: 3, 5, 9, 17, 33, ...",
      "options": [
        "50",
        "60",
        "65",
        "80"
      ],
      "correctAnswer": "65",
      "explanation": "Differences are powers of 2. 5-3=2, 9-5=4, 17-9=8, 33-17=16. Next difference is 32. 33 + 32 = 65."
    },
    {
      "category": "Logical",
      "topic": "Puzzle",
      "difficulty": "Easy",
      "question": "In a race of 5 runners, John finished ahead of Sarah but behind Mike. Kevin finished ahead of Mike but behind Dave. Who won the race?",
      "options": [
        "John",
        "Mike",
        "Kevin",
        "Dave"
      ],
      "correctAnswer": "Dave",
      "explanation": "Order: Sarah < John < Mike. Mike < Kevin < Dave. Combining: Sarah < John < Mike < Kevin < Dave. Winner is Dave."
    },
    {
      "category": "Logical",
      "topic": "Syllogism",
      "difficulty": "Easy",
      "question": "Statements: All pens are books. All books are pencils. Conclusions: I. All pens are pencils. II. All pencils are pens.",
      "options": [
        "Only conclusion I follows",
        "Only conclusion II follows",
        "Both I and II follow",
        "Neither I nor II follows"
      ],
      "correctAnswer": "Only conclusion I follows",
      "explanation": "Pen is a subset of Book, and Book is a subset of Pencil. Hence, Pen is a subset of Pencil (All pens are pencils). Conclusion II is not necessarily true."
    },
    {
      "category": "Logical",
      "topic": "Analogy",
      "difficulty": "Easy",
      "question": "Doctor : Patient :: Politician : ?",
      "options": [
        "Voter",
        "Minister",
        "Election",
        "Parliament"
      ],
      "correctAnswer": "Voter",
      "explanation": "A doctor serves patients; a politician serves voters/constituents."
    }
  ],
  "Verbal": [
    {
      "category": "Verbal",
      "topic": "Synonyms",
      "difficulty": "Easy",
      "question": "Choose the correct synonym of the word: ABANDON",
      "options": [
        "Keep",
        "Forsake",
        "Adopt",
        "Cherish"
      ],
      "correctAnswer": "Forsake",
      "explanation": "Abandon means to leave completely or desert. Forsake has the same meaning."
    },
    {
      "category": "Verbal",
      "topic": "Antonyms",
      "difficulty": "Easy",
      "question": "Choose the correct antonym of the word: FRUGAL",
      "options": [
        "Thrifty",
        "Extravagant",
        "Miserly",
        "Economical"
      ],
      "correctAnswer": "Extravagant",
      "explanation": "Frugal means sparing or economical with money or food. Extravagant is the opposite."
    },
    {
      "category": "Verbal",
      "topic": "Grammar",
      "difficulty": "Easy",
      "question": "Complete the sentence: Neither of the two candidates ________ qualified for the post.",
      "options": [
        "is",
        "are",
        "were",
        "have"
      ],
      "correctAnswer": "is",
      "explanation": "'Neither' is a singular pronoun and takes a singular verb. Therefore, 'is' is the correct verb."
    },
    {
      "category": "Verbal",
      "topic": "Reading",
      "difficulty": "Easy",
      "question": "According to a study, trees help reduce city noise by absorbing sound waves. Which of the following is true?",
      "options": [
        "Trees increase city noise.",
        "Trees have no impact on city noise.",
        "Trees help mitigate city noise.",
        "Only tall trees absorb noise."
      ],
      "correctAnswer": "Trees help mitigate city noise.",
      "explanation": "The text states trees help reduce city noise, which is synonymous with mitigating it."
    },
    {
      "category": "Verbal",
      "topic": "Vocabulary",
      "difficulty": "Easy",
      "question": "Select the correct word to fill in the blank: The doctor gave him a ________ to relieve the pain.",
      "options": [
        "prescription",
        "prescribe",
        "prescribed",
        "prescriptive"
      ],
      "correctAnswer": "prescription",
      "explanation": "A noun is required after the article 'a'. 'Prescription' is the noun form."
    },
    {
      "category": "Verbal",
      "topic": "Error Spotting",
      "difficulty": "Easy",
      "question": "Identify the error in: 'She is more taller than her sister.'",
      "options": [
        "She is",
        "more taller",
        "than her",
        "sister"
      ],
      "correctAnswer": "more taller",
      "explanation": "'Taller' is already a comparative adjective. Adding 'more' before it is redundant."
    },
    {
      "category": "Verbal",
      "topic": "Sentence Completion",
      "difficulty": "Easy",
      "question": "Fill in the blank: Although she was tired, she ________ working.",
      "options": [
        "continued",
        "stops",
        "has stopped",
        "refused"
      ],
      "correctAnswer": "continued",
      "explanation": "'Although' shows a contrast. Despite being tired, she kept working. 'Continued' fits the past tense and the meaning."
    },
    {
      "category": "Verbal",
      "topic": "Para Jumbles",
      "difficulty": "Easy",
      "question": "Rearrange sentences to form a coherent paragraph: A. He opened the door. B. John reached home. C. He walked inside. D. He took out his keys.",
      "options": [
        "BDAC",
        "BADC",
        "DBAC",
        "ACDB"
      ],
      "correctAnswer": "BDAC",
      "explanation": "Sequence: B (reached home) -> D (took out keys) -> A (opened door) -> C (walked inside). Thus, BDAC."
    }
  ],
  "All Categories": [
    {
      "category": "Technical",
      "topic": "Computer Networks",
      "difficulty": "Easy",
      "question": "Which layer of the OSI model is responsible for routing packets across networks?",
      "options": [
        "Data Link Layer",
        "Network Layer",
        "Transport Layer",
        "Session Layer"
      ],
      "correctAnswer": "Network Layer",
      "explanation": "The Network Layer handles logical addressing, packet routing, and forwarding across networks."
    },
    {
      "category": "Technical",
      "topic": "Operating Systems",
      "difficulty": "Easy",
      "question": "Which CPU scheduling algorithm leads to starvation of longer processes?",
      "options": [
        "Round Robin",
        "Shortest Job First (SJF) Non-Preemptive",
        "First Come First Served (FCFS)",
        "Priority-based / Shortest Remaining Time First"
      ],
      "correctAnswer": "Priority-based / Shortest Remaining Time First",
      "explanation": "Shortest Remaining Time First (and SJF) continuously schedules shorter processes first, causing longer processes to starve."
    },
    {
      "category": "Technical",
      "topic": "DBMS",
      "difficulty": "Easy",
      "question": "Which of the following properties ensures that all database transactions are either fully completed or not executed at all?",
      "options": [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability"
      ],
      "correctAnswer": "Atomicity",
      "explanation": "Atomicity ensures that a transaction is treated as a single unit, which either succeeds entirely or fails completely (all-or-nothing)."
    },
    {
      "category": "Technical",
      "topic": "OOPS",
      "difficulty": "Easy",
      "question": "What OOPS concept allows a subclass to provide a specific implementation of a method that is already defined in its superclass?",
      "options": [
        "Method Overriding",
        "Method Overloading",
        "Encapsulation",
        "Abstraction"
      ],
      "correctAnswer": "Method Overriding",
      "explanation": "Method overriding allows a child class to rewrite a method of its parent class to execute specialized code."
    },
    {
      "category": "Technical",
      "topic": "Java",
      "difficulty": "Easy",
      "question": "Which area of Java memory is used to store objects created via the 'new' keyword?",
      "options": [
        "Stack Memory",
        "Heap Memory",
        "Method Area",
        "PC Register"
      ],
      "correctAnswer": "Heap Memory",
      "explanation": "All objects in Java are dynamically allocated on the Heap Memory."
    },
    {
      "category": "Technical",
      "topic": "Data Structures",
      "difficulty": "Easy",
      "question": "Which data structure follows the Last In First Out (LIFO) principle?",
      "options": [
        "Queue",
        "Stack",
        "Linked List",
        "Binary Tree"
      ],
      "correctAnswer": "Stack",
      "explanation": "A stack is a linear data structure that operates under the LIFO principle (elements added last are retrieved first)."
    },
    {
      "category": "Technical",
      "topic": "Algorithms",
      "difficulty": "Easy",
      "question": "Which sorting algorithm has a worst-case time complexity of O(n^2)?",
      "options": [
        "Merge Sort",
        "Quick Sort",
        "Heap Sort",
        "All of the above"
      ],
      "correctAnswer": "Quick Sort",
      "explanation": "Quick Sort has a worst-case time complexity of O(n^2) when the pivot divides the array unevenly (e.g. sorted arrays). Merge/Heap sorts are O(n log n) in worst cases."
    },
    {
      "category": "Technical",
      "topic": "Predict Output",
      "difficulty": "Medium",
      "question": "Predict the output of the following Java code:\n\nint a = 5;\nint b = a++;\nSystem.out.println(\"a=\" + a + \", b=\" + b);",
      "options": [
        "a=6, b=5",
        "a=5, b=5",
        "a=6, b=6",
        "a=5, b=6"
      ],
      "correctAnswer": "a=6, b=5",
      "explanation": "In post-increment (a++), the current value 5 is assigned to b first, and then a is incremented to 6."
    },
    {
      "category": "Technical",
      "topic": "Code Debugging",
      "difficulty": "Medium",
      "question": "Debug this C code snippet:\n\nfor (int i = 0; i <= 5; i++);\n{\n    printf(\"%d \", i);\n}\n\nWhat is the bug?",
      "options": [
        "Semicolon at the end of for-loop makes it an empty loop, printing only 6 once.",
        "The loop will print 0 to 5.",
        "Infinite loop occurs.",
        "Syntax error on printf."
      ],
      "correctAnswer": "Semicolon at the end of for-loop makes it an empty loop, printing only 6 once.",
      "explanation": "The semicolon terminates the for-statement. The block following it is executed once after the loop completes with i=6."
    },
    {
      "category": "Technical",
      "topic": "Pseudocode",
      "difficulty": "Medium",
      "question": "What is the output of the following pseudocode?\n\nFunction compute(X, Y):\n    Set X = X + Y\n    Set Y = X - Y\n    Set X = X - Y\n    Print X, \", \", Y\nEnd Function\n\nCall compute(10, 20)",
      "options": [
        "10, 20",
        "20, 10",
        "30, 20",
        "30, 10"
      ],
      "correctAnswer": "20, 10",
      "explanation": "This pseudocode executes a classic swap algorithm. X becomes 30, Y becomes 10, and X becomes 20. Output is 20, 10."
    },
    {
      "category": "Technical",
      "topic": "JavaScript",
      "difficulty": "Easy",
      "question": "Which keyword is used to declare block-scoped variables in modern ES6 JavaScript?",
      "options": [
        "var",
        "let",
        "global",
        "def"
      ],
      "correctAnswer": "let",
      "explanation": "In ES6 JavaScript, 'let' and 'const' provide block scoping, whereas 'var' provides function scoping."
    },
    {
      "category": "Technical",
      "topic": "AngularJS",
      "difficulty": "Easy",
      "question": "Which directive in AngularJS achieves two-way data binding between input elements and scope variables?",
      "options": [
        "ng-bind",
        "ng-model",
        "ng-repeat",
        "ng-app"
      ],
      "correctAnswer": "ng-model",
      "explanation": "The 'ng-model' directive binds the value of HTML controls (input, select, textarea) to application scope data in AngularJS."
    },
    {
      "category": "Technical",
      "topic": "Node.js",
      "difficulty": "Easy",
      "question": "Which built-in Node.js module provides utilities for working with file and directory paths?",
      "options": [
        "fs",
        "path",
        "http",
        "url"
      ],
      "correctAnswer": "path",
      "explanation": "The Node.js 'path' module provides utilities for joining, resolving, and manipulating file and directory paths across different OS platforms."
    },
    {
      "category": "Technical",
      "topic": "Express.js",
      "difficulty": "Easy",
      "question": "In Express.js, which method registers a middleware function that runs for all incoming HTTP requests?",
      "options": [
        "app.all()",
        "app.use()",
        "app.get()",
        "app.listen()"
      ],
      "correctAnswer": "app.use()",
      "explanation": "app.use() mounts specified middleware functions at the path specified (or globally if no path is given)."
    },
    {
      "category": "Technical",
      "topic": "MongoDB",
      "difficulty": "Easy",
      "question": "What binary data format does MongoDB use to store document data internally?",
      "options": [
        "JSON",
        "XML",
        "BSON",
        "Protocol Buffers"
      ],
      "correctAnswer": "BSON",
      "explanation": "MongoDB stores data records as BSON (Binary JSON) documents, extending JSON to support data types like Date and Binary."
    },
    {
      "category": "Technical",
      "topic": "HTML & CSS",
      "difficulty": "Easy",
      "question": "Which HTML element specifies a header for a document or section, and which CSS property sets element font size?",
      "options": [
        "<header> and font-size",
        "<head> and text-size",
        "<top> and font-weight",
        "<section> and text-style"
      ],
      "correctAnswer": "<header> and font-size",
      "explanation": "The <header> HTML tag defines introductory content, and the CSS 'font-size' property controls text scale."
    },
    {
      "category": "Aptitude",
      "topic": "Number System",
      "difficulty": "Easy",
      "question": "What is the unit digit in the product (3^65 * 6^59 * 7^71)?",
      "options": [
        "1",
        "2",
        "4",
        "6"
      ],
      "correctAnswer": "4",
      "explanation": "Unit digit of 3^65 = 3^(4*16 + 1) = 3^1 = 3. Unit digit of 6^59 = 6. Unit digit of 7^71 = 7^(4*17 + 3) = 7^3 = 3. Product of unit digits = 3 * 6 * 3 = 54. Therefore, the unit digit is 4."
    },
    {
      "category": "Aptitude",
      "topic": "LCM",
      "difficulty": "Easy",
      "question": "Find the LCM of 2/3, 3/5, 4/7 and 9/13.",
      "options": [
        "36",
        "1/36",
        "12/455",
        "36/455"
      ],
      "correctAnswer": "36",
      "explanation": "LCM of fractions = LCM of Numerators / HCF of Denominators. Numerators are 2, 3, 4, 9 (LCM = 36). Denominators are 3, 5, 7, 13 (HCF = 1). LCM = 36/1 = 36."
    },
    {
      "category": "Aptitude",
      "topic": "HCF",
      "difficulty": "Easy",
      "question": "Find the HCF of 18/25, 12/10, and 24/35.",
      "options": [
        "6/350",
        "6/5",
        "6/175",
        "12/175"
      ],
      "correctAnswer": "6/175",
      "explanation": "HCF of fractions = HCF of Numerators / LCM of Denominators. HCF(18, 12, 24) = 6. LCM(25, 10, 35) = 175. Thus, HCF = 6/175."
    },
    {
      "category": "Aptitude",
      "topic": "Percentage",
      "difficulty": "Easy",
      "question": "If A's salary is 25% more than B's salary, then by what percent is B's salary less than A's salary?",
      "options": [
        "15%",
        "20%",
        "25%",
        "30%"
      ],
      "correctAnswer": "20%",
      "explanation": "Let B's salary be 100. Then A's salary is 125. Difference is 25. B's salary is less than A's by (25 / 125) * 100 = 20%."
    },
    {
      "category": "Aptitude",
      "topic": "Profit and Loss",
      "difficulty": "Easy",
      "question": "An article is sold for $300 at a loss of 25%. What is the cost price of the article?",
      "options": [
        "$375",
        "$400",
        "$425",
        "$450"
      ],
      "correctAnswer": "$400",
      "explanation": "Loss is 25%, meaning selling price is 75% of Cost Price. 0.75 * CP = 300 => CP = 300 / 0.75 = 400."
    },
    {
      "category": "Aptitude",
      "topic": "Ratio",
      "difficulty": "Easy",
      "question": "If A : B = 2 : 3 and B : C = 4 : 5, find A : B : C.",
      "options": [
        "8 : 12 : 15",
        "2 : 4 : 5",
        "6 : 9 : 15",
        "8 : 10 : 15"
      ],
      "correctAnswer": "8 : 12 : 15",
      "explanation": "Multiply A:B by 4 to get 8:12. Multiply B:C by 3 to get 12:15. Combining them gives A:B:C = 8:12:15."
    },
    {
      "category": "Aptitude",
      "topic": "Average",
      "difficulty": "Easy",
      "question": "The average of 5 consecutive odd numbers is 25. What is the largest of these numbers?",
      "options": [
        "27",
        "29",
        "31",
        "33"
      ],
      "correctAnswer": "29",
      "explanation": "The average of consecutive numbers is the middle term. So the numbers are 21, 23, 25, 27, 29. The largest is 29."
    },
    {
      "category": "Aptitude",
      "topic": "SI",
      "difficulty": "Easy",
      "question": "A sum of money at simple interest doubles itself in 8 years. What is the rate of interest per annum?",
      "options": [
        "10%",
        "12.5%",
        "15%",
        "16.67%"
      ],
      "correctAnswer": "12.5%",
      "explanation": "If Principal P doubles, the Simple Interest (SI) gained is P. SI = (P * R * T) / 100 => P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%."
    },
    {
      "category": "Aptitude",
      "topic": "CI",
      "difficulty": "Easy",
      "question": "Find the compound interest on $10,000 for 2 years at 10% per annum compounded annually.",
      "options": [
        "$2000",
        "$2100",
        "$2200",
        "$2300"
      ],
      "correctAnswer": "$2100",
      "explanation": "Amount = P(1 + R/100)^T = 10000(1.1)^2 = 12100. CI = Amount - Principal = 12100 - 10000 = 2100."
    },
    {
      "category": "Aptitude",
      "topic": "Time and Work",
      "difficulty": "Easy",
      "question": "A can do a piece of work in 10 days and B can do it in 15 days. In how many days can they complete it working together?",
      "options": [
        "5 days",
        "6 days",
        "8 days",
        "9 days"
      ],
      "correctAnswer": "6 days",
      "explanation": "A's 1-day work = 1/10. B's 1-day work = 1/15. Together 1-day work = 1/10 + 1/15 = 5/30 = 1/6. Time taken = 6 days."
    },
    {
      "category": "Aptitude",
      "topic": "Time and Distance",
      "difficulty": "Easy",
      "question": "A train 120 m long passes a telegraph post in 6 seconds. Find the speed of the train in km/h.",
      "options": [
        "60 km/h",
        "72 km/h",
        "80 km/h",
        "90 km/h"
      ],
      "correctAnswer": "72 km/h",
      "explanation": "Speed = Distance / Time = 120 / 6 = 20 m/s. In km/h = 20 * 18/5 = 72 km/h."
    },
    {
      "category": "Aptitude",
      "topic": "Ages",
      "difficulty": "Easy",
      "question": "The ratio of ages of Ram and Shyam is 4:5. If the sum of their ages is 81, what is Shyam's age?",
      "options": [
        "36",
        "45",
        "54",
        "60"
      ],
      "correctAnswer": "45",
      "explanation": "Ram's age = 4x, Shyam's age = 5x. 4x + 5x = 9x = 81 => x = 9. Shyam's age = 5 * 9 = 45."
    },
    {
      "category": "Logical",
      "topic": "Blood Relation",
      "difficulty": "Easy",
      "question": "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
      "options": [
        "His own",
        "His son's",
        "His father's",
        "His nephew's"
      ],
      "correctAnswer": "His son's",
      "explanation": "Since the man has no brother or sister, 'my father's son' is himself. Thus, 'that man's father is myself'. Therefore, the photograph is of his son."
    },
    {
      "category": "Logical",
      "topic": "Coding Decoding",
      "difficulty": "Easy",
      "question": "If in a certain language, SYSTEM is written as SYSMET and NEARER is written as AENRER, then how will FRACTION be written?",
      "options": [
        "CARFTION",
        "CARFNOIT",
        "ARFCNOIT",
        "CARFTNOI"
      ],
      "correctAnswer": "CARFNOIT",
      "explanation": "The word is split into two halves. First half: SYS becomes SYS (reversed is SYS). MET becomes MET (reversed is TEM). For FRACTION: first half FRAC reversed is CARF, second half TION reversed is NOIT. Combined: CARFNOIT."
    },
    {
      "category": "Logical",
      "topic": "Seating Arrangement",
      "difficulty": "Easy",
      "question": "Five boys A, B, C, D, and E are sitting in a row. A is to the right of B, E is to the left of B but to the right of C. A is to the left of D. Who is sitting in the middle?",
      "options": [
        "A",
        "B",
        "D",
        "E"
      ],
      "correctAnswer": "B",
      "explanation": "Order from left to right: E is left of B, C is left of E => C - E - B. A is right of B and left of D => B - A - D. Combined: C - E - B - A - D. Middle boy is B."
    },
    {
      "category": "Logical",
      "topic": "Direction",
      "difficulty": "Easy",
      "question": "A man walks 5 km East, then turns right and walks 4 km. Finally, he turns left and walks 5 km. Which direction is he facing now?",
      "options": [
        "East",
        "West",
        "North",
        "South"
      ],
      "correctAnswer": "East",
      "explanation": "He starts facing East. Turning right makes him face South. Turning left from South makes him face East again."
    },
    {
      "category": "Logical",
      "topic": "Series",
      "difficulty": "Easy",
      "question": "Find the missing term in the series: 3, 5, 9, 17, 33, ...",
      "options": [
        "50",
        "60",
        "65",
        "80"
      ],
      "correctAnswer": "65",
      "explanation": "Differences are powers of 2. 5-3=2, 9-5=4, 17-9=8, 33-17=16. Next difference is 32. 33 + 32 = 65."
    },
    {
      "category": "Logical",
      "topic": "Puzzle",
      "difficulty": "Easy",
      "question": "In a race of 5 runners, John finished ahead of Sarah but behind Mike. Kevin finished ahead of Mike but behind Dave. Who won the race?",
      "options": [
        "John",
        "Mike",
        "Kevin",
        "Dave"
      ],
      "correctAnswer": "Dave",
      "explanation": "Order: Sarah < John < Mike. Mike < Kevin < Dave. Combining: Sarah < John < Mike < Kevin < Dave. Winner is Dave."
    },
    {
      "category": "Logical",
      "topic": "Syllogism",
      "difficulty": "Easy",
      "question": "Statements: All pens are books. All books are pencils. Conclusions: I. All pens are pencils. II. All pencils are pens.",
      "options": [
        "Only conclusion I follows",
        "Only conclusion II follows",
        "Both I and II follow",
        "Neither I nor II follows"
      ],
      "correctAnswer": "Only conclusion I follows",
      "explanation": "Pen is a subset of Book, and Book is a subset of Pencil. Hence, Pen is a subset of Pencil (All pens are pencils). Conclusion II is not necessarily true."
    },
    {
      "category": "Logical",
      "topic": "Analogy",
      "difficulty": "Easy",
      "question": "Doctor : Patient :: Politician : ?",
      "options": [
        "Voter",
        "Minister",
        "Election",
        "Parliament"
      ],
      "correctAnswer": "Voter",
      "explanation": "A doctor serves patients; a politician serves voters/constituents."
    },
    {
      "category": "Verbal",
      "topic": "Synonyms",
      "difficulty": "Easy",
      "question": "Choose the correct synonym of the word: ABANDON",
      "options": [
        "Keep",
        "Forsake",
        "Adopt",
        "Cherish"
      ],
      "correctAnswer": "Forsake",
      "explanation": "Abandon means to leave completely or desert. Forsake has the same meaning."
    },
    {
      "category": "Verbal",
      "topic": "Antonyms",
      "difficulty": "Easy",
      "question": "Choose the correct antonym of the word: FRUGAL",
      "options": [
        "Thrifty",
        "Extravagant",
        "Miserly",
        "Economical"
      ],
      "correctAnswer": "Extravagant",
      "explanation": "Frugal means sparing or economical with money or food. Extravagant is the opposite."
    },
    {
      "category": "Verbal",
      "topic": "Grammar",
      "difficulty": "Easy",
      "question": "Complete the sentence: Neither of the two candidates ________ qualified for the post.",
      "options": [
        "is",
        "are",
        "were",
        "have"
      ],
      "correctAnswer": "is",
      "explanation": "'Neither' is a singular pronoun and takes a singular verb. Therefore, 'is' is the correct verb."
    },
    {
      "category": "Verbal",
      "topic": "Reading",
      "difficulty": "Easy",
      "question": "According to a study, trees help reduce city noise by absorbing sound waves. Which of the following is true?",
      "options": [
        "Trees increase city noise.",
        "Trees have no impact on city noise.",
        "Trees help mitigate city noise.",
        "Only tall trees absorb noise."
      ],
      "correctAnswer": "Trees help mitigate city noise.",
      "explanation": "The text states trees help reduce city noise, which is synonymous with mitigating it."
    },
    {
      "category": "Verbal",
      "topic": "Vocabulary",
      "difficulty": "Easy",
      "question": "Select the correct word to fill in the blank: The doctor gave him a ________ to relieve the pain.",
      "options": [
        "prescription",
        "prescribe",
        "prescribed",
        "prescriptive"
      ],
      "correctAnswer": "prescription",
      "explanation": "A noun is required after the article 'a'. 'Prescription' is the noun form."
    },
    {
      "category": "Verbal",
      "topic": "Error Spotting",
      "difficulty": "Easy",
      "question": "Identify the error in: 'She is more taller than her sister.'",
      "options": [
        "She is",
        "more taller",
        "than her",
        "sister"
      ],
      "correctAnswer": "more taller",
      "explanation": "'Taller' is already a comparative adjective. Adding 'more' before it is redundant."
    },
    {
      "category": "Verbal",
      "topic": "Sentence Completion",
      "difficulty": "Easy",
      "question": "Fill in the blank: Although she was tired, she ________ working.",
      "options": [
        "continued",
        "stops",
        "has stopped",
        "refused"
      ],
      "correctAnswer": "continued",
      "explanation": "'Although' shows a contrast. Despite being tired, she kept working. 'Continued' fits the past tense and the meaning."
    },
    {
      "category": "Verbal",
      "topic": "Para Jumbles",
      "difficulty": "Easy",
      "question": "Rearrange sentences to form a coherent paragraph: A. He opened the door. B. John reached home. C. He walked inside. D. He took out his keys.",
      "options": [
        "BDAC",
        "BADC",
        "DBAC",
        "ACDB"
      ],
      "correctAnswer": "BDAC",
      "explanation": "Sequence: B (reached home) -> D (took out keys) -> A (opened door) -> C (walked inside). Thus, BDAC."
    }
  ]
};

export const downloadSampleJSON = (category = 'Technical') => {
  const data = SAMPLE_QUESTIONS_BY_CATEGORY[category] || SAMPLE_QUESTIONS_BY_CATEGORY['Technical'];
  const fileName = `sample_questions_${category.toLowerCase().replace(/\s+/g, '_')}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
