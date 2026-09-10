import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      topics: 'JavaScript, AngularJS, Node.js, Express.js, MongoDB, HTML & CSS, Computer Networks, OS, DBMS...',
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

  const handleStartTestClick = (category) => {
    setSelectedCategory(category);
    setTermsAccepted(false);
  };

  const handleProceedToTest = () => {
    if (termsAccepted && selectedCategory) {
      // Close modal using bootstrap programmatic trigger or standard location transition
      const modalElement = document.getElementById('rulesModal');
      const modal = window.bootstrap?.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      navigate(`/test/${selectedCategory.id}`);
    }
  };

  return (
    <div className="container py-5">
      {/* Welcome Banner */}
      <div className="card glass-card p-4 p-md-5 border mb-5 shadow-sm text-center text-md-start" style={{ borderColor: 'var(--border-color)' }}>
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <h1 className="fw-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Student'}</span>!
            </h1>
            <p className="text-muted fs-5 mb-0">
              Student Practice & Assessment Hub — Select a category below to write proctored practice tests, analyze topic-wise results, and continuously practice to master your skills.
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

      <h3 className="fw-bold mb-4">Available Test Categories</h3>

      {/* Grid of Categories */}
      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-12 col-md-6" key={cat.id}>
            <div className="card glass-card h-100 border p-4 d-flex flex-column" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-start mb-4">
                {/* Image Placeholder - Styled SVG Icon */}
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

      {/* Rules & Regulations Modal */}
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
