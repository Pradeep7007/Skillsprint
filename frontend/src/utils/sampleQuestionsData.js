/**
 * Sample Questions Data Module
 * Provides comprehensive, verified sample questions organized by Category and Sub-Topic
 * Supports sorting, topic/sub-topic drilldown, and individual or bundled JSON downloads.
 */

export const SAMPLE_TOPICS_CONFIG = {
  Technical: [
    'Computer Networks',
    'Operating Systems',
    'DBMS',
    'Data Structures',
    'Algorithms',
    'Java',
    'OOPS',
    'Predict Output',
    'Code Debugging',
    'Pseudocode'
  ],
  Aptitude: [
    'Number System',
    'LCM and HCF',
    'Percentage',
    'Profit and Loss',
    'Ratio and Proportion',
    'Time and Work',
    'Time and Distance',
    'Average',
    'Simple and Compound Interest',
    'Ages'
  ],
  Logical: [
    'Blood Relation',
    'Coding Decoding',
    'Seating Arrangement',
    'Direction Sense',
    'Series',
    'Syllogism',
    'Puzzle',
    'Analogy'
  ],
  Verbal: [
    'Synonyms',
    'Antonyms',
    'Grammar',
    'Error Spotting',
    'Sentence Completion',
    'Para Jumbles',
    'Reading Comprehension',
    'Vocabulary'
  ]
};

// Realistic question samples organized by Category and Sub-topic
export const SAMPLE_QUESTIONS_STORE = {
  Technical: {
    'Computer Networks': [
      {
        category: 'Technical',
        topic: 'Computer Networks',
        difficulty: 'Medium',
        question: 'Which layer of the OSI model is responsible for end-to-end communication, flow control, and error recovery?',
        options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Session Layer'],
        correctAnswer: 'Transport Layer',
        explanation: 'The Transport Layer (Layer 4) provides transparent transfer of data between end systems with flow control, segmentation, and error recovery (e.g., TCP).'
      },
      {
        category: 'Technical',
        topic: 'Computer Networks',
        difficulty: 'Easy',
        question: 'What is the standard port number used for HTTPS (Hypertext Transfer Protocol Secure)?',
        options: ['443', '80', '8080', '22'],
        correctAnswer: '443',
        explanation: 'HTTPS encrypts web traffic using SSL/TLS over TCP port 443 by default.'
      },
      {
        category: 'Technical',
        topic: 'Computer Networks',
        difficulty: 'Hard',
        question: 'Which routing protocol uses Dijkstra’s Shortest Path First (SPF) algorithm to calculate loop-free paths?',
        options: ['OSPF', 'RIP', 'BGP', 'EGP'],
        correctAnswer: 'OSPF',
        explanation: 'Open Shortest Path First (OSPF) is a link-state routing protocol that utilizes Dijkstra’s algorithm to determine the shortest path tree.'
      }
    ],
    'Operating Systems': [
      {
        category: 'Technical',
        topic: 'Operating Systems',
        difficulty: 'Medium',
        question: 'Which of the following is NOT one of the four necessary Coffman conditions required for a deadlock to occur?',
        options: ['Preemption allowed', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
        correctAnswer: 'Preemption allowed',
        explanation: 'Deadlock requires "No preemption". If preemption is allowed, resources can be reclaimed to resolve deadlocks.'
      },
      {
        category: 'Technical',
        topic: 'Operating Systems',
        difficulty: 'Medium',
        question: 'What is Belady’s Anomaly in operating systems memory management?',
        options: [
          'More page frames leading to more page faults in FIFO',
          'CPU thrashing when swapping processes',
          'Starvation occurring in priority scheduling',
          'Disk head scheduling thrash in SCAN'
        ],
        correctAnswer: 'More page frames leading to more page faults in FIFO',
        explanation: 'Belady’s Anomaly is the phenomenon where increasing the number of page frames results in an increased number of page faults in FIFO replacement.'
      },
      {
        category: 'Technical',
        topic: 'Operating Systems',
        difficulty: 'Hard',
        question: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
        options: [
          'A fast hardware cache for virtual-to-physical address translations',
          'A disk buffer for swap space operations',
          'An interrupt handling lookup register',
          'A scheduler queue for blocked threads'
        ],
        correctAnswer: 'A fast hardware cache for virtual-to-physical address translations',
        explanation: 'The TLB is an associative memory cache used by the MMU to speed up virtual memory address translation.'
      }
    ],
    'DBMS': [
      {
        category: 'Technical',
        topic: 'DBMS',
        difficulty: 'Medium',
        question: 'In database normalization, which normal form requires eliminating transitive functional dependencies?',
        options: ['Third Normal Form (3NF)', 'First Normal Form (1NF)', 'Second Normal Form (2NF)', 'BCNF'],
        correctAnswer: 'Third Normal Form (3NF)',
        explanation: '3NF requires that every non-prime attribute must not be transitively dependent on any candidate key.'
      },
      {
        category: 'Technical',
        topic: 'DBMS',
        difficulty: 'Easy',
        question: 'Which ACID property guarantees that all operations within a transaction either execute completely or abort without changes?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 'Atomicity',
        explanation: 'Atomicity ensures the "all or nothing" property for database transactions.'
      },
      {
        category: 'Technical',
        topic: 'DBMS',
        difficulty: 'Hard',
        question: 'Which index structure is most widely used in relational databases for efficient range queries and sequential access?',
        options: ['B+ Tree', 'Hash Index', 'Binary Search Tree', 'Inverted Index'],
        correctAnswer: 'B+ Tree',
        explanation: 'B+ Trees store all data/pointers in leaf nodes linked as a doubly-linked list, allowing rapid range scans and logarithmic lookups.'
      }
    ],
    'Data Structures': [
      {
        category: 'Technical',
        topic: 'Data Structures',
        difficulty: 'Medium',
        question: 'What is the worst-case time complexity of searching for an element in an AVL self-balancing binary search tree?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
        correctAnswer: 'O(log n)',
        explanation: 'Because an AVL tree guarantees height strictly bounded by ~1.44 log2(n), search is strictly O(log n) even in the worst case.'
      },
      {
        category: 'Technical',
        topic: 'Data Structures',
        difficulty: 'Easy',
        question: 'Which linear data structure follows the Last-In, First-Out (LIFO) principle?',
        options: ['Stack', 'Queue', 'Array', 'Linked List'],
        correctAnswer: 'Stack',
        explanation: 'A Stack operates under LIFO, where items are pushed and popped from the same top end.'
      },
      {
        category: 'Technical',
        topic: 'Data Structures',
        difficulty: 'Hard',
        question: 'How do you detect a cycle in a singly linked list in O(n) time and O(1) auxiliary space?',
        options: ['Floyd’s Cycle-Finding Algorithm (Tortoise and Hare)', 'Depth First Search with visited set', 'Hash Set of node addresses', 'Recursive backpointer inspection'],
        correctAnswer: 'Floyd’s Cycle-Finding Algorithm (Tortoise and Hare)',
        explanation: 'Floyd’s two-pointer algorithm advances one slow pointer by 1 step and one fast pointer by 2 steps to detect cycles in O(1) memory.'
      }
    ],
    'Algorithms': [
      {
        category: 'Technical',
        topic: 'Algorithms',
        difficulty: 'Medium',
        question: 'What is the average time complexity of the QuickSort algorithm?',
        options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
        correctAnswer: 'O(n log n)',
        explanation: 'On average, partitioning splits the list roughly in half at each recursive level, resulting in O(n log n) comparisons.'
      },
      {
        category: 'Technical',
        topic: 'Algorithms',
        difficulty: 'Medium',
        question: 'Which algorithm design paradigm is used by Dijkstra’s single-source shortest path algorithm?',
        options: ['Greedy Algorithm', 'Dynamic Programming', 'Divide and Conquer', 'Branch and Bound'],
        correctAnswer: 'Greedy Algorithm',
        explanation: 'Dijkstra greedily chooses the unvisited vertex with the smallest tentative distance at each step.'
      },
      {
        category: 'Technical',
        topic: 'Algorithms',
        difficulty: 'Hard',
        question: 'Which algorithm solves the 0/1 Knapsack Problem with optimal substructure in pseudo-polynomial time?',
        options: ['Dynamic Programming', 'Greedy Fractional Selection', 'Topological Sorting', 'Prim’s Algorithm'],
        correctAnswer: 'Dynamic Programming',
        explanation: '0/1 Knapsack is solved using DP in O(n * W) time where n is items and W is capacity.'
      }
    ],
    'Java': [
      {
        category: 'Technical',
        topic: 'Java',
        difficulty: 'Medium',
        question: 'Which memory segment in JVM memory architecture stores loaded class bytecode, method data, and static fields?',
        options: ['Metaspace / Method Area', 'JVM Stack', 'Heap Memory', 'Program Counter Register'],
        correctAnswer: 'Metaspace / Method Area',
        explanation: 'In Java 8+, Metaspace (formerly PermGen) is allocated from native memory and stores class metadata and static variables.'
      },
      {
        category: 'Technical',
        topic: 'Java',
        difficulty: 'Easy',
        question: 'Can an abstract class in Java have constructor methods?',
        options: ['Yes, and it is invoked during subclass instantiation via super()', 'No, abstract classes cannot have constructors', 'Only if declared private', 'Only if the class has zero abstract methods'],
        correctAnswer: 'Yes, and it is invoked during subclass instantiation via super()',
        explanation: 'Abstract classes have constructors to initialize common state, which subclasses invoke using super().'
      },
      {
        category: 'Technical',
        topic: 'Java',
        difficulty: 'Hard',
        question: 'What does the volatile keyword in Java guarantee for a variable across multiple threads?',
        options: ['Visibility and ordering (prevents instruction reordering)', 'Mutual exclusion and atomic compound operations', 'Thread sleep locking', 'Immutable constant value'],
        correctAnswer: 'Visibility and ordering (prevents instruction reordering)',
        explanation: 'volatile ensures reads and writes go directly to main memory (visibility) and establishes a happens-before relationship, but does not make compound increments atomic.'
      }
    ],
    'OOPS': [
      {
        category: 'Technical',
        topic: 'OOPS',
        difficulty: 'Easy',
        question: 'Which OOP concept binds data attributes and methods that manipulate them into a single unit while hiding internal representation?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Composition'],
        correctAnswer: 'Encapsulation',
        explanation: 'Encapsulation bundles data and methods while keeping fields private with getter/setter access control.'
      },
      {
        category: 'Technical',
        topic: 'OOPS',
        difficulty: 'Medium',
        question: 'Method overloading in object-oriented programming is an example of which type of polymorphism?',
        options: ['Compile-time (Static) Polymorphism', 'Run-time (Dynamic) Polymorphism', 'Ad-hoc Casting', 'Subtyping Abstraction'],
        correctAnswer: 'Compile-time (Static) Polymorphism',
        explanation: 'Method overloading is resolved at compile-time by method signature inspection.'
      }
    ],
    'Predict Output': [
      {
        category: 'Technical',
        topic: 'Predict Output',
        difficulty: 'Medium',
        question: 'What is the output of `console.log(typeof NaN)` in JavaScript?',
        options: ['"number"', '"NaN"', '"undefined"', '"object"'],
        correctAnswer: '"number"',
        explanation: 'Under IEEE-754 floating point specifications implemented in JavaScript, NaN is a numeric value representing an undefined numeric result.'
      },
      {
        category: 'Technical',
        topic: 'Predict Output',
        difficulty: 'Medium',
        question: 'What does the expression `10 + 20 + "Hello" + 10 + 20` evaluate to in Java?',
        options: ['"30Hello1020"', '"30Hello30"', '"1020Hello1020"', '"30Hello"'],
        correctAnswer: '"30Hello1020"',
        explanation: 'Left-to-right evaluation: 10 + 20 = 30; 30 + "Hello" = "30Hello"; "30Hello" + 10 = "30Hello10"; + 20 = "30Hello1020".'
      }
    ],
    'Code Debugging': [
      {
        category: 'Technical',
        topic: 'Code Debugging',
        difficulty: 'Medium',
        question: 'What exception is thrown when an application attempts to use null where an object instance is required?',
        options: ['NullPointerException', 'IllegalArgumentException', 'ClassCastException', 'IndexOutOfBoundsException'],
        correctAnswer: 'NullPointerException',
        explanation: 'Dereferencing a null reference causes a NullPointerException in Java and similar managed languages.'
      },
      {
        category: 'Technical',
        topic: 'Code Debugging',
        difficulty: 'Hard',
        question: 'In multi-threaded code, what bug occurs when two threads attempt to acquire two locks in reverse order?',
        options: ['Deadlock', 'Memory Leak', 'Race Condition on counter', 'Thrashing'],
        correctAnswer: 'Deadlock',
        explanation: 'Inconsistent lock acquisition ordering creates a circular wait, resulting in deadlock.'
      }
    ],
    'Pseudocode': [
      {
        category: 'Technical',
        topic: 'Pseudocode',
        difficulty: 'Easy',
        question: 'What values will be printed by the loop: `FOR i = 1 TO 5 STEP 2: PRINT i`?',
        options: ['1, 3, 5', '1, 2, 3, 4, 5', '2, 4', '1, 3'],
        correctAnswer: '1, 3, 5',
        explanation: 'Starting at 1 with step 2 increments to 1, 3, 5 before stopping at boundary 5.'
      },
      {
        category: 'Technical',
        topic: 'Pseudocode',
        difficulty: 'Medium',
        question: 'What mathematical function does this recursive pseudocode compute?\n`FUNCTION f(n): IF n <= 1 RETURN 1 ELSE RETURN n * f(n - 1)`',
        options: ['Factorial of n (n!)', 'Fibonacci sequence', 'Sum of first n numbers', 'Power of 2^n'],
        correctAnswer: 'Factorial of n (n!)',
        explanation: 'The function multiplies n by f(n-1) until base case 1, computing the factorial.'
      }
    ]
  },
  Aptitude: {
    'Number System': [
      {
        category: 'Aptitude',
        topic: 'Number System',
        difficulty: 'Easy',
        question: 'What is the remainder when 2^31 is divided by 5?',
        options: ['3', '1', '2', '4'],
        correctAnswer: '3',
        explanation: 'Powers of 2 mod 5 cycle every 4: 2^1=2, 2^2=4, 2^3=3, 2^4=1. 31 mod 4 = 3, so 2^31 mod 5 = 2^3 mod 5 = 3.'
      },
      {
        category: 'Aptitude',
        topic: 'Number System',
        difficulty: 'Medium',
        question: 'What is the sum of the first 20 natural numbers?',
        options: ['210', '200', '190', '220'],
        correctAnswer: '210',
        explanation: 'Sum = n * (n + 1) / 2 = 20 * 21 / 2 = 210.'
      }
    ],
    'LCM and HCF': [
      {
        category: 'Aptitude',
        topic: 'LCM and HCF',
        difficulty: 'Medium',
        question: 'The product of two numbers is 2028 and their HCF is 13. What is the number of possible pairs of such numbers?',
        options: ['2', '1', '3', '4'],
        correctAnswer: '2',
        explanation: 'Let numbers be 13a and 13b. 13a * 13b = 2028 => ab = 12. Co-prime pairs for ab=12 are (1,12) and (3,4). So 2 pairs.'
      }
    ],
    'Percentage': [
      {
        category: 'Aptitude',
        topic: 'Percentage',
        difficulty: 'Easy',
        question: 'If the price of sugar increases by 25%, by what percentage must a family reduce consumption to keep expenditure unchanged?',
        options: ['20%', '25%', '16.67%', '15%'],
        correctAnswer: '20%',
        explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.'
      }
    ],
    'Profit and Loss': [
      {
        category: 'Aptitude',
        topic: 'Profit and Loss',
        difficulty: 'Medium',
        question: 'A shopkeeper sells an article at a profit of 20%. If cost price increases by 10% and selling price increases by 8%, what is the new profit percentage?',
        options: ['17.8%', '15.5%', '20%', '18.2%'],
        correctAnswer: '17.8%',
        explanation: 'Let CP = 100, SP = 120. New CP = 110. New SP = 120 * 1.08 = 129.6. Profit = 19.6 / 110 * 100 = 17.8%.'
      }
    ],
    'Ratio and Proportion': [
      {
        category: 'Aptitude',
        topic: 'Ratio and Proportion',
        difficulty: 'Easy',
        question: 'If A:B = 2:3 and B:C = 4:5, what is the ratio A:B:C?',
        options: ['8:12:15', '2:4:5', '8:10:15', '6:9:15'],
        correctAnswer: '8:12:15',
        explanation: 'Multiply first ratio by 4 (8:12) and second ratio by 3 (12:15) => 8:12:15.'
      }
    ],
    'Time and Work': [
      {
        category: 'Aptitude',
        topic: 'Time and Work',
        difficulty: 'Medium',
        question: 'A can finish a work in 12 days and B can finish it in 18 days. If they work together, in how many days will the work be completed?',
        options: ['7.2 days', '6.5 days', '8 days', '7 days'],
        correctAnswer: '7.2 days',
        explanation: 'Together 1 day work = 1/12 + 1/18 = 5/36. Total days = 36/5 = 7.2 days.'
      }
    ],
    'Time and Distance': [
      {
        category: 'Aptitude',
        topic: 'Time and Distance',
        difficulty: 'Medium',
        question: 'A train 150 meters long passes a pole in 9 seconds. What is the speed of the train in km/h?',
        options: ['60 km/h', '54 km/h', '72 km/h', '45 km/h'],
        correctAnswer: '60 km/h',
        explanation: 'Speed = 150 / 9 m/s = (150/9) * (18/5) = 60 km/h.'
      }
    ],
    'Average': [
      {
        category: 'Aptitude',
        topic: 'Average',
        difficulty: 'Easy',
        question: 'The average of 5 consecutive odd numbers is 27. What is the largest of these numbers?',
        options: ['31', '29', '33', '35'],
        correctAnswer: '31',
        explanation: 'For consecutive odd numbers, the average is the middle number (3rd). So the numbers are 23, 25, 27, 29, 31.'
      }
    ],
    'Simple and Compound Interest': [
      {
        category: 'Aptitude',
        topic: 'Simple and Compound Interest',
        difficulty: 'Medium',
        question: 'What is the difference between simple interest and compound interest on $5,000 for 2 years at 10% per annum?',
        options: ['$50', '$40', '$60', '$25'],
        correctAnswer: '$50',
        explanation: 'Difference for 2 years = P * (R/100)^2 = 5000 * (10/100)^2 = 5000 * 0.01 = $50.'
      }
    ],
    'Ages': [
      {
        category: 'Aptitude',
        topic: 'Ages',
        difficulty: 'Easy',
        question: 'The ratio of present ages of father and son is 5:2. Four years hence, the ratio will be 2:1. What is the son’s present age?',
        options: ['8 years', '10 years', '12 years', '6 years'],
        correctAnswer: '8 years',
        explanation: '(5x + 4) / (2x + 4) = 2/1 => 5x + 4 = 4x + 8 => x = 4. Son’s age = 2 * 4 = 8 years.'
      }
    ]
  },
  Logical: {
    'Blood Relation': [
      {
        category: 'Logical',
        topic: 'Blood Relation',
        difficulty: 'Easy',
        question: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?',
        options: ['Uncle', 'Father', 'Grandfather', 'Brother'],
        correctAnswer: 'Uncle',
        explanation: 'Daughter\'s father = Deepak himself. The gentleman\'s brother is Deepak\'s father. Hence the gentleman is Deepak\'s Uncle.'
      }
    ],
    'Coding Decoding': [
      {
        category: 'Logical',
        topic: 'Coding Decoding',
        difficulty: 'Easy',
        question: 'If "CLOUD" is coded as "DNPUT", how is "RAIN" coded in that pattern?',
        options: ['SBKP', 'SZJM', 'SBKO', 'TBKP'],
        correctAnswer: 'SBKP',
        explanation: 'Each letter is shifted by: C(+1)->D, L(+2)->N, O(+1)->P, U(+0)->U... checking pattern R(+1)=S, A(+1)=B, I(+2)=K, N(+2)=P -> SBKP.'
      }
    ],
    'Seating Arrangement': [
      {
        category: 'Logical',
        topic: 'Seating Arrangement',
        difficulty: 'Medium',
        question: 'Five people P, Q, R, S, T are sitting in a row facing North. S is to the immediate right of P. Q is between R and T. R is at the extreme left. Who is sitting in the middle?',
        options: ['T', 'Q', 'P', 'S'],
        correctAnswer: 'T',
        explanation: 'From left: R, Q, T, P, S. T sits right in the middle position (3rd of 5).'
      }
    ],
    'Direction Sense': [
      {
        category: 'Logical',
        topic: 'Direction Sense',
        difficulty: 'Easy',
        question: 'A man walks 4 km North, turns right and walks 3 km. How far and in which direction is he from his starting point?',
        options: ['5 km North-East', '7 km North-East', '5 km North-West', '7 km East'],
        correctAnswer: '5 km North-East',
        explanation: 'Distance = sqrt(4^2 + 3^2) = sqrt(16 + 9) = 5 km in the North-East direction.'
      }
    ],
    'Series': [
      {
        category: 'Logical',
        topic: 'Series',
        difficulty: 'Easy',
        question: 'Find the next number in the sequence: 3, 7, 15, 31, 63, ?',
        options: ['127', '125', '129', '124'],
        correctAnswer: '127',
        explanation: 'Each number is (2 * previous) + 1. 2 * 63 + 1 = 127.'
      }
    ],
    'Syllogism': [
      {
        category: 'Logical',
        topic: 'Syllogism',
        difficulty: 'Medium',
        question: 'Statements: All pens are books. All books are clocks. Conclusion: 1. All pens are clocks. 2. Some clocks are pens.',
        options: ['Both conclusions 1 and 2 follow', 'Only conclusion 1 follows', 'Only conclusion 2 follows', 'Neither follows'],
        correctAnswer: 'Both conclusions 1 and 2 follow',
        explanation: 'Pens are a subset of Books, which are a subset of Clocks. Therefore, all pens are clocks and some clocks are pens.'
      }
    ],
    'Puzzle': [
      {
        category: 'Logical',
        topic: 'Puzzle',
        difficulty: 'Medium',
        question: 'Four boxes A, B, C, D are placed one above another. Box C is above Box A but below Box D. Box B is at the bottom. Which box is at the top?',
        options: ['D', 'C', 'A', 'B'],
        correctAnswer: 'D',
        explanation: 'Order from top to bottom: D, C, A, B. Box D is at the very top.'
      }
    ],
    'Analogy': [
      {
        category: 'Logical',
        topic: 'Analogy',
        difficulty: 'Easy',
        question: 'Doctor : Hospital :: Teacher : ?',
        options: ['School', 'Student', 'Chalk', 'Principal'],
        correctAnswer: 'School',
        explanation: 'A doctor works in a hospital; similarly, a teacher works in a school (workplace relationship).'
      }
    ]
  },
  Verbal: {
    'Synonyms': [
      {
        category: 'Verbal',
        topic: 'Synonyms',
        difficulty: 'Easy',
        question: 'Choose the word that is most nearly identical in meaning to "CANDID":',
        options: ['Frank', 'Secretive', 'Deceitful', 'Hesitant'],
        correctAnswer: 'Frank',
        explanation: '"Candid" means truthful and straightforward; frank.'
      }
    ],
    'Antonyms': [
      {
        category: 'Verbal',
        topic: 'Antonyms',
        difficulty: 'Easy',
        question: 'Choose the word opposite in meaning to "METICULOUS":',
        options: ['Careless', 'Thorough', 'Precise', 'Painstaking'],
        correctAnswer: 'Careless',
        explanation: '"Meticulous" means showing great attention to detail; the antonym is "Careless".'
      }
    ],
    'Grammar': [
      {
        category: 'Verbal',
        topic: 'Grammar',
        difficulty: 'Medium',
        question: 'Choose the correct sentence following subject-verb agreement rules:',
        options: [
          'Neither the manager nor the employees were informed.',
          'Neither the manager nor the employees was informed.',
          'Neither the manager or the employees was informed.',
          'Neither the manager nor the employees is informed.'
        ],
        correctAnswer: 'Neither the manager nor the employees were informed.',
        explanation: 'When subjects are joined by "neither...nor", the verb agrees with the subject closest to it ("employees", plural -> were).'
      }
    ],
    'Error Spotting': [
      {
        category: 'Verbal',
        topic: 'Error Spotting',
        difficulty: 'Medium',
        question: 'Identify the segment with grammatical error: "He is one of those men (A) / who always does (B) / their best in crisis (C) / No error (D)"',
        options: ['(B) who always does', '(A) He is one of those men', '(C) their best in crisis', '(D) No error'],
        correctAnswer: '(B) who always does',
        explanation: 'The relative pronoun "who" refers to the plural antecedent "men", so the verb must be plural: "who always do".'
      }
    ],
    'Sentence Completion': [
      {
        category: 'Verbal',
        topic: 'Sentence Completion',
        difficulty: 'Medium',
        question: 'Although the team faced severe hurdles, their ______ determination led to eventual triumph.',
        options: ['unwavering', 'hesitant', 'tentative', 'ephemeral'],
        correctAnswer: 'unwavering',
        explanation: '"Unwavering" means steady and resolute, contrasting with the severe hurdles faced.'
      }
    ],
    'Para Jumbles': [
      {
        category: 'Verbal',
        topic: 'Para Jumbles',
        difficulty: 'Medium',
        question: 'Rearrange into a coherent paragraph:\n1. However, with continuous practice, confidence builds.\n2. Public speaking initially terrifies most individuals.\n3. This newfound assurance enables clear communication.',
        options: ['2, 1, 3', '1, 2, 3', '3, 2, 1', '2, 3, 1'],
        correctAnswer: '2, 1, 3',
        explanation: 'Sentence 2 introduces the fear, 1 shows the remedy with practice, and 3 concludes with the positive result.'
      }
    ],
    'Reading Comprehension': [
      {
        category: 'Verbal',
        topic: 'Reading Comprehension',
        difficulty: 'Medium',
        question: 'When an author presents an opposing argument before systematically dismantling it, what rhetorical technique is being employed?',
        options: ['Refutation / Counterargument', 'Hyperbole', 'Ad hominem', 'Equivocation'],
        correctAnswer: 'Refutation / Counterargument',
        explanation: 'Addressing and disproving an opponent’s thesis is known as refutation.'
      }
    ],
    'Vocabulary': [
      {
        category: 'Verbal',
        topic: 'Vocabulary',
        difficulty: 'Medium',
        question: 'What is the definition of "UBIQUITOUS"?',
        options: [
          'Present, appearing, or found everywhere',
          'Extremely rare and endangered',
          'Harmful and toxic to environment',
          'Ancient and outdated'
        ],
        correctAnswer: 'Present, appearing, or found everywhere',
        explanation: '"Ubiquitous" describes things found everywhere simultaneously, such as smartphones or oxygen.'
      }
    ]
  }
};

/**
 * Returns available categories
 */
export const getAvailableCategories = () => {
  return Object.keys(SAMPLE_TOPICS_CONFIG);
};

/**
 * Returns sub-topics for a category with optional sorting ('default' | 'asc' | 'desc')
 */
export const getSubtopicsByCategory = (category, sortOrder = 'default') => {
  const topics = SAMPLE_TOPICS_CONFIG[category] || [];
  const copy = [...topics];

  if (sortOrder === 'asc') {
    return copy.sort((a, b) => a.localeCompare(b));
  } else if (sortOrder === 'desc') {
    return copy.sort((a, b) => b.localeCompare(a));
  }
  return copy;
};

/**
 * Gets questions for a specific sub-topic
 */
export const getQuestionsBySubtopic = (category, subTopic) => {
  if (category === 'All Categories') {
    // Search across all categories
    for (const cat of Object.keys(SAMPLE_QUESTIONS_STORE)) {
      if (SAMPLE_QUESTIONS_STORE[cat]?.[subTopic]) {
        return SAMPLE_QUESTIONS_STORE[cat][subTopic];
      }
    }
    return [];
  }

  return SAMPLE_QUESTIONS_STORE[category]?.[subTopic] || [];
};

/**
 * Gets all questions in a category
 */
export const getQuestionsByCategory = (category) => {
  if (category === 'All Categories') {
    const all = [];
    Object.keys(SAMPLE_QUESTIONS_STORE).forEach((cat) => {
      Object.keys(SAMPLE_QUESTIONS_STORE[cat]).forEach((sub) => {
        all.push(...SAMPLE_QUESTIONS_STORE[cat][sub]);
      });
    });
    return all;
  }

  const categoryStore = SAMPLE_QUESTIONS_STORE[category];
  if (!categoryStore) return [];

  const list = [];
  Object.keys(categoryStore).forEach((sub) => {
    list.push(...categoryStore[sub]);
  });
  return list;
};

// Flattened lookup for backward compatibility
export const SAMPLE_QUESTIONS_BY_CATEGORY = {
  Technical: getQuestionsByCategory('Technical'),
  Aptitude: getQuestionsByCategory('Aptitude'),
  Logical: getQuestionsByCategory('Logical'),
  Verbal: getQuestionsByCategory('Verbal'),
  'All Categories': getQuestionsByCategory('All Categories')
};

/**
 * Trigger download of sub-topic specific JSON
 */
export const downloadSubtopicJSON = (category, subTopic) => {
  const data = getQuestionsBySubtopic(category, subTopic);
  const cleanSub = subTopic.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const cleanCat = category.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const fileName = `sample_${cleanCat}_${cleanSub}.json`;

  triggerFileDownload(fileName, data);
};

/**
 * Trigger download of full category bundle JSON
 */
export const downloadCategoryJSON = (category) => {
  const data = getQuestionsByCategory(category);
  const cleanCat = category.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const fileName = `sample_${cleanCat}_all_topics.json`;

  triggerFileDownload(fileName, data);
};

/**
 * Generic sample download function (supports subTopic if provided)
 */
export const downloadSampleJSON = (category = 'Technical', subTopic = null) => {
  if (subTopic) {
    downloadSubtopicJSON(category, subTopic);
  } else {
    downloadCategoryJSON(category);
  }
};

/**
 * Internal browser download trigger
 */
function triggerFileDownload(fileName, data) {
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
}
