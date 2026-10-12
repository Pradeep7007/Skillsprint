import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CATEGORY_TOPICS_MAP = {
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
  ],
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
  ]
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Selection & Modal States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Custom Multi-Select Preferences State
  const [selectedCategories, setSelectedCategories] = useState(['Aptitude', 'Logical', 'Verbal', 'Technical']);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [questionCount, setQuestionCount] = useState(30);

  const categories = [
    {
      id: 'Aptitude',
      title: 'Quantitative Aptitude',
      desc: 'Test your mathematical abilities, calculations, numerical series, percentages, and word problems.',
      topics: 'Number System, Percentages, Ratio, SI & CI, Time & Work, Speed & Distance...',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-100 h-100 p-2" style={{ color: 'var(--accent-primary)' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
        </svg>
      ),
      bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05))'
    },
    {
      id: 'Logical',
      title: 'Logical Reasoning',
      desc: 'Evaluate analytical reasoning, coding patterns, spatial relationships, blood relations, and logical series.',
      topics: 'Blood Relation, Coding-Decoding, Arrangements, Puzzles, Direction, Syllogisms...',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-100 h-100 p-2" style={{ color: 'var(--accent-secondary)' }}>
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
          <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
          <path d="M12 9v6"/>
          <path d="M9 12h6"/>
        </svg>
      ),
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
    },
    {
      id: 'Verbal',
      title: 'Verbal Ability',
      desc: 'Assess English vocabulary, sentence structures, grammar corrections, comprehension, and synonyms.',
      topics: 'Synonyms, Grammar, Spotting Errors, Sentence Completion, Para Jumbles...',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-100 h-100 p-2" style={{ color: 'var(--color-warning)' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))'
    },
    {
      id: 'Technical',
      title: 'Technical MCQs',
      desc: 'Evaluate knowledge in core computer science subjects, full-stack web development, output predictions, and algorithms.',
      topics: 'JavaScript, Computer Networks, OS, DBMS, Data Structures, Algorithms, Java, OOPS...',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-100 h-100 p-2" style={{ color: 'var(--accent-primary)' }}>
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
          <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
      ),
      bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1))'
    }
  ];

  // Category Multi-Select Handlers
  const toggleCategorySelection = (catId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((c) => c !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories(Object.keys(CATEGORY_TOPICS_MAP));
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
    setSelectedTopics([]);
  };

  // Topic Multi-Select Handlers
  const toggleTopicSelection = (topicName) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicName)) {
        return prev.filter((t) => t !== topicName);
      } else {
        return [...prev, topicName];
      }
    });
  };

  const selectAllTopicsForCategory = (catId) => {
    const catTopics = CATEGORY_TOPICS_MAP[catId] || [];
    setSelectedTopics((prev) => {
      const merged = new Set([...prev, ...catTopics]);
      return Array.from(merged);
    });
  };

  const clearTopicsForCategory = (catId) => {
    const catTopics = CATEGORY_TOPICS_MAP[catId] || [];
    setSelectedTopics((prev) => prev.filter((t) => !catTopics.includes(t)));
  };

  const selectAllFilteredTopics = () => {
    const all = [];
    selectedCategories.forEach((cat) => {
      const topicsList = CATEGORY_TOPICS_MAP[cat] || [];
      topicsList.forEach((t) => {
        if (!topicSearch || t.toLowerCase().includes(topicSearch.toLowerCase())) {
          all.push(t);
        }
      });
    });
    setSelectedTopics(Array.from(new Set([...selectedTopics, ...all])));
  };

  const clearAllSelectedTopics = () => {
    setSelectedTopics([]);
  };

  // Start Standard Test Handler
  const handleStartTestClick = (cat) => {
    setSelectedCategory(cat);
    setTermsAccepted(false);
  };

  // Confirm Custom Studio Preferences and Open Rules Modal
  const handleConfirmCustomStudio = (e) => {
    if (selectedCategories.length === 0 && selectedTopics.length === 0) {
      if (e) e.stopPropagation();
      alert('Please select at least one Category or Topic for your custom test.');
      return;
    }

    const catTitle = selectedCategories.length === 4 && selectedTopics.length === 0
      ? 'Full Multi-Category Test'
      : selectedTopics.length > 0
      ? `Custom Test (${selectedTopics.length} Topics)`
      : `Custom Test (${selectedCategories.join(', ')})`;

    setSelectedCategory({
      id: 'custom',
      title: catTitle,
      isCustom: true,
    });
    setTermsAccepted(false);
  };

  // Final Action to Launch Test
  const handleProceedToTest = () => {
    if (termsAccepted && selectedCategory) {
      if (selectedCategory.isCustom) {
        navigate('/test/custom', {
          state: {
            categories: selectedCategories,
            topics: selectedTopics,
            questionCount,
            isCustom: true,
          },
        });
      } else {
        navigate(`/test/${selectedCategory.id}`);
      }
    }
  };

  return (
    <div className="container py-4 py-md-5">
      {/* Welcome Banner */}
      <div className="card glass-card p-4 p-md-5 border mb-4 mb-md-5 shadow-sm text-center text-md-start" style={{ borderColor: 'var(--border-color)' }}>
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <h1 className="fw-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Student'}</span>!
            </h1>
            <p className="text-muted fs-5 mb-0">
              Student Practice & Assessment Hub — Select a category to write a proctored exam, or build a custom test selecting multiple topics of your choice.
            </p>
          </div>
          <div className="col-12 col-md-4 text-center text-md-end mt-4 mt-md-0">
            <div className="p-3 bg-opacity-10 bg-primary rounded-4 d-inline-block" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <i className="bi bi-shield-check fs-2 text-primary"></i>
              <div className="fw-bold mt-1 small text-uppercase">Proctored System</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Standard Test Categories Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0">Standard Test Categories</h3>
        <span className="badge bg-secondary-subtle text-secondary border d-none d-sm-inline-block">Standard Proctored Mode</span>
      </div>

      <div className="row g-4 mb-5">
        {categories.map((cat) => (
          <div className="col-12 col-md-6" key={cat.id}>
            <div className="card glass-card h-100 border p-4 d-flex flex-column" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-start mb-4">
                <div
                  className="rounded-4 me-3 flex-shrink-0"
                  style={{
                    width: '72px',
                    height: '72px',
                    background: cat.bgGradient,
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h4 className="fw-bold mb-1">{cat.title}</h4>
                  <span className="badge bg-secondary-subtle text-secondary border small">30 Questions</span>
                  <span className="badge bg-primary-subtle text-primary border small ms-2">30 Minutes</span>
                </div>
              </div>

              <p className="text-muted flex-grow-1 mb-4">{cat.desc}</p>

              <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                <strong className="d-block small mb-1 text-uppercase text-muted">Topics Covered:</strong>
                <span className="small text-secondary">{cat.topics}</span>
              </div>

              <button
                className="btn btn-primary-custom w-100 py-2.5 mt-auto d-flex align-items-center justify-content-center"
                data-bs-toggle="modal"
                data-bs-target="#rulesModal"
                onClick={() => handleStartTestClick(cat)}
              >
                <i className="bi bi-play-fill me-1"></i>
                Start Practice Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Custom Multi-Select Practice Studio (Placed under Standard Categories) */}
      <div className="card glass-card border p-4 p-md-5 shadow-sm text-center text-md-start" style={{ borderColor: 'var(--accent-primary)', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(16, 185, 129, 0.06))' }}>
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <span className="badge bg-primary text-white fw-bold px-2.5 py-1">New Feature</span>
              <span className="badge bg-success-subtle text-success border">Multi-Select Enabled</span>
            </div>
            <h2 className="fw-extrabold mb-2">Custom Multi-Select Practice Studio</h2>
            <p className="text-muted mb-0 fs-6">
              Create a targeted examination environment by selecting multiple categories, topics, and sub-topics of your choice before starting the test.
            </p>
          </div>
          <div className="col-12 col-md-4 text-center text-md-end mt-4 mt-md-0">
            <button
              className="btn btn-primary-custom px-4 py-3 fw-bold fs-6 d-inline-flex align-items-center justify-content-center gap-2 w-100 w-md-auto"
              data-bs-toggle="modal"
              data-bs-target="#customStudioModal"
            >
              <i className="bi bi-sliders fs-5"></i>
              Open Custom Studio Modal
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODAL 1: Custom Multi-Select Practice Studio Modal
         ========================================================= */}
      <div className="modal fade" id="customStudioModal" tabIndex="-1" aria-labelledby="customStudioModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content glass-card border-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-sliders text-primary fs-4"></i>
                <div>
                  <h5 className="modal-title fw-bold mb-0" id="customStudioModalLabel">
                    Custom Multi-Select Practice Studio
                  </h5>
                  <span className="small text-muted">Select multiple categories, topics, and sub-topics for your test</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>

            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Step 1: Multi-Select Categories */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="fw-bold text-uppercase small text-muted mb-0">
                    1. Select Categories (Multiple Choice):
                  </label>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary py-0.5 px-2 small" onClick={selectAllCategories}>
                      Select All
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary py-0.5 px-2 small" onClick={clearAllCategories}>
                      Reset
                    </button>
                  </div>
                </div>
                <div className="row g-3">
                  {Object.keys(CATEGORY_TOPICS_MAP).map((catName) => {
                    const isChecked = selectedCategories.includes(catName);
                    return (
                      <div key={catName} className="col-6 col-md-3">
                        <div
                          className={`p-3 rounded-3 border d-flex align-items-center justify-content-between ${isChecked ? 'border-primary' : ''}`}
                          onClick={() => toggleCategorySelection(catName)}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: isChecked ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-tertiary)',
                          }}
                        >
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input me-2"
                              type="checkbox"
                              id={`modal-cat-check-${catName}`}
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label fw-bold mb-0" htmlFor={`modal-cat-check-${catName}`} style={{ cursor: 'pointer' }}>
                              {catName}
                            </label>
                          </div>
                          <span className="badge bg-secondary-subtle text-secondary small border d-none d-sm-inline-block">
                            {CATEGORY_TOPICS_MAP[catName].length} Topics
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Multi-Select Topics & Sub-Topics */}
              <div className="mb-4">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-2 gap-2">
                  <label className="fw-bold text-uppercase small text-muted mb-0">
                    2. Choose Specific Topics & Sub-Topics (Optional Drill-down):
                  </label>
                  <div className="d-flex gap-2 w-100 w-md-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-transparent border text-primary rounded-2"
                      style={{ minWidth: '200px' }}
                      placeholder="🔍 Search topics..."
                      value={topicSearch}
                      onChange={(e) => setTopicSearch(e.target.value)}
                    />
                    <button type="button" className="btn btn-sm btn-outline-secondary text-nowrap" onClick={selectAllFilteredTopics}>
                      Select Filtered
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger text-nowrap" onClick={clearAllSelectedTopics}>
                      Clear Topics
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedCategories.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-info-circle me-1"></i> Please select at least one category above to view topics.
                    </div>
                  ) : (
                    selectedCategories.map((catName) => {
                      const topicsList = CATEGORY_TOPICS_MAP[catName] || [];
                      const filteredTopics = topicsList.filter((t) =>
                        !topicSearch ? true : t.toLowerCase().includes(topicSearch.toLowerCase())
                      );

                      if (filteredTopics.length === 0) return null;

                      return (
                        <div key={catName} className="mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fw-bold text-primary small text-uppercase">{catName} Topics</span>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none small"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => selectAllTopicsForCategory(catName)}
                              >
                                Select All {catName}
                              </button>
                              <span className="text-muted small">•</span>
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none small text-danger"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => clearTopicsForCategory(catName)}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          <div className="row g-2">
                            {filteredTopics.map((tName) => {
                              const isTopicChecked = selectedTopics.includes(tName);
                              return (
                                <div key={tName} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                  <div
                                    className={`p-2 rounded-2 border d-flex align-items-center ${isTopicChecked ? 'border-primary' : ''}`}
                                    onClick={() => toggleTopicSelection(tName)}
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '0.85rem',
                                      backgroundColor: isTopicChecked ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-tertiary)',
                                    }}
                                  >
                                    <input
                                      className="form-check-input me-2 flex-shrink-0"
                                      type="checkbox"
                                      id={`modal-topic-${tName}`}
                                      checked={isTopicChecked}
                                      onChange={() => {}}
                                      style={{ cursor: 'pointer' }}
                                    />
                                    <label className="form-check-label text-truncate mb-0" htmlFor={`modal-topic-${tName}`} style={{ cursor: 'pointer' }} title={tName}>
                                      {tName}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Step 3: Question Count */}
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <div>
                  <span className="fw-bold small d-block">Test Length:</span>
                  <span className="text-muted small">Select total questions for your custom test pool</span>
                </div>
                <div className="mt-2 mt-sm-0">
                  <select
                    className="form-select form-select-sm bg-transparent border text-primary fw-bold"
                    style={{ width: '140px' }}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                  >
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                    <option value={60}>60 Questions</option>
                    <option value={80}>80 Questions</option>
                    <option value={100}>100 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
              <div className="small text-muted text-truncate me-2" style={{ maxWidth: '300px' }}>
                <strong>Summary:</strong> {selectedCategories.length} Categories, {selectedTopics.length > 0 ? `${selectedTopics.length} Topics` : 'All Topics'}
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary px-3" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom px-4 fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#rulesModal"
                  onClick={handleConfirmCustomStudio}
                >
                  Proceed to Guidelines <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="rulesModal" tabIndex="-1" aria-labelledby="rulesModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content glass-card border-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h5 className="modal-title fw-bold" id="rulesModalLabel">
                <i className="bi bi-shield-exclamation text-warning me-2"></i>
                Proctored Examination Guidelines - {selectedCategory?.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>
            <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="alert alert-warning border-0 p-3 mb-4 d-flex align-items-start" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' }}>
                <i className="bi bi-info-circle-fill me-2 fs-5 mt-1"></i>
                <div>
                  <strong>Attention:</strong> This is a secure examination environment. Attempting to violate the rules will log warnings in the database for proctor evaluation.
                </div>
              </div>

              {selectedCategory?.isCustom && (
                <div className="alert alert-info border-0 p-3 mb-4" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)' }}>
                  <div className="fw-bold mb-1">Custom Test Configuration:</div>
                  <ul className="mb-0 small ps-3">
                    <li>• <strong>Categories Selected:</strong> {selectedCategories.join(', ') || 'None'}</li>
                    <li>• <strong>Topics Selected:</strong> {selectedTopics.length > 0 ? selectedTopics.join(', ') : 'All topics in selected categories'}</li>
                    <li>• <strong>Question Limit:</strong> {questionCount} Questions</li>
                  </ul>
                </div>
              )}

              <h6 className="fw-bold mb-3">System & Behavioral Rules:</h6>
              <ul className="list-group list-group-flush mb-4 bg-transparent border-0">
                <li className="list-group-item bg-transparent text-secondary border-0 px-0 py-2 d-flex align-items-start">
                  <i className="bi bi-fullscreen text-primary me-2"></i>
                  <div>
                    <strong>Fullscreen Enforcement:</strong> The test runs in mandatory Fullscreen Mode. Exiting fullscreen mode will result in an immediate warning.
                  </div>
                </li>
                <li className="list-group-item bg-transparent text-secondary border-0 px-0 py-2 d-flex align-items-start">
                  <i className="bi bi-layers-fill text-primary me-2"></i>
                  <div>
                    <strong>Tab & Window Tracking:</strong> Do NOT switch tabs, open new windows, or click outside the test screen. Blur events are strictly monitored.
                  </div>
                </li>
                <li className="list-group-item bg-transparent text-secondary border-0 px-0 py-2 d-flex align-items-start">
                  <i className="bi bi-mouse-fill text-primary me-2"></i>
                  <div>
                    <strong>Disabled Actions:</strong> Right-clicks, Copy-Paste, Text Selection, and developer keybinds (F12, Ctrl+Shift+I, Ctrl+U) are locked.
                  </div>
                </li>
              </ul>

              <div className="form-check p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  id="acceptTerms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold text-secondary" htmlFor="acceptTerms" style={{ cursor: 'pointer' }}>
                  I agree to the test integrity guidelines, academic honesty rules, and fullscreen assessment policy.
                </label>
              </div>
            </div>
            <div className="modal-footer border-top" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary-custom"
                disabled={!termsAccepted}
                onClick={handleProceedToTest}
                data-bs-dismiss="modal"
              >
                Proceed to Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
