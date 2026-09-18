const technicalSample = [
  {
    category: "Technical",
    topic: "Sample Technical Topic",
    difficulty: "Medium",
    question: "Sample technical question description?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correctAnswer: "Option A",
    explanation: "Sample explanation for why Option A is the correct answer."
  }
];

const aptitudeSample = [
  {
    category: "Aptitude",
    topic: "Sample Aptitude Topic",
    difficulty: "Medium",
    question: "Sample quantitative aptitude question description?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correctAnswer: "Option A",
    explanation: "Sample explanation for the aptitude calculation."
  }
];

const logicalSample = [
  {
    category: "Logical",
    topic: "Sample Logical Topic",
    difficulty: "Medium",
    question: "Sample logical reasoning question description?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correctAnswer: "Option A",
    explanation: "Sample explanation of the logical deduction."
  }
];

const verbalSample = [
  {
    category: "Verbal",
    topic: "Sample Verbal Topic",
    difficulty: "Medium",
    question: "Sample verbal ability question description?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correctAnswer: "Option A",
    explanation: "Sample explanation for the verbal answer."
  }
];

export const SAMPLE_QUESTIONS_BY_CATEGORY = {
  "Technical": technicalSample,
  "Aptitude": aptitudeSample,
  "Logical": logicalSample,
  "Verbal": verbalSample,
  "All Categories": [
    ...technicalSample,
    ...aptitudeSample,
    ...logicalSample,
    ...verbalSample
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
