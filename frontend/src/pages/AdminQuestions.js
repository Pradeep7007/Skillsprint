import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';
import FormattedQuestion from '../components/FormattedQuestion';
import { SAMPLE_QUESTIONS_BY_CATEGORY, downloadSampleJSON } from '../utils/sampleQuestionsData';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [sampleCategory, setSampleCategory] = useState('Technical');

  // Filters state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [page, setPage] = useState(1);

  // JSON Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Add/Edit Question Form State
  const [editingQuestion, setEditingQuestion] = useState(null); // holds question object if editing, null if adding
  const [formData, setFormData] = useState({
    category: 'Aptitude',
    topic: '',
    difficulty: 'Medium',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
  });

  const [toastMessage, setToastMessage] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/questions?search=${search}&category=${categoryFilter}&topic=${topicFilter}&difficulty=${difficultyFilter}&page=${page}`
      );
      if (res.data.success) {
        setQuestions(res.data.questions);
        setPagination(res.data.pagination);
        setCategories(res.data.categories || []);
        setTopics(res.data.topics || []);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, categoryFilter, topicFilter, difficultyFilter, page]);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add modal
  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      category: 'Aptitude',
      topic: '',
      difficulty: 'Medium',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      explanation: '',
    });
  };

  // Open Edit modal
  const openEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    });
  };

  // Submit Question Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      category: formData.category,
      topic: formData.topic,
      difficulty: formData.difficulty,
      question: formData.question,
      options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
    };

    // Validations
    if (!payload.options.includes(payload.correctAnswer)) {
      return alert('Correct Answer must match one of the 4 options exactly.');
    }

    try {
      if (editingQuestion) {
        // Edit Question
        const res = await axios.put(`/questions/${editingQuestion._id}`, payload);
        if (res.data.success) {
          setToastMessage('Question updated successfully!');
          fetchQuestions();
        }
      } else {
        // Add Question
        const res = await axios.post('/questions', payload);
        if (res.data.success) {
          setToastMessage('Question added successfully!');
          fetchQuestions();
        }
      }
      
      // Close Modal Programmatically
      const closeBtn = document.getElementById('closeModalBtn');
      if (closeBtn) closeBtn.click();

      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to save question');
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const res = await axios.delete(`/questions/${id}`);
        if (res.data.success) {
          setToastMessage('Question deleted successfully!');
          fetchQuestions();
          setTimeout(() => setToastMessage(''), 3000);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete question');
      }
    }
  };

  // JSON File upload handler
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDownloadSampleJSON = (category = sampleCategory) => {
    downloadSampleJSON(category);
    const count = SAMPLE_QUESTIONS_BY_CATEGORY[category]?.length || 0;
    setToastMessage(`Downloaded ${category} sample JSON containing all ${count} topics!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleCopyJSONSample = () => {
    const sampleData = SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory] || SAMPLE_QUESTIONS_BY_CATEGORY['Technical'];
    navigator.clipboard.writeText(JSON.stringify(sampleData, null, 2));
    setToastMessage(`Copied ${sampleCategory} sample JSON (${sampleData.length} topics) to clipboard!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleJSONUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a JSON file first');

    const form = new FormData();
    form.append('file', selectedFile);

    try {
      setUploading(true);
      const res = await axios.post('/questions/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setToastMessage(res.data.message || 'JSON Questions uploaded successfully!');
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('jsonFileInput');
        if (fileInput) fileInput.value = '';

        fetchQuestions();
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to upload JSON file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2"></i>
                {toastMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="card glass-card p-4 p-md-5 border mb-5 shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-2">
              <i className="bi bi-journal-text text-primary me-2"></i>
              Manage Question Database
            </h2>
            <p className="text-muted mb-0">Create, review, update, or remove examination questions. Bulk import via JSON arrays.</p>
          </div>
          <button
            className="btn btn-primary-custom px-4 py-2.5"
            data-bs-toggle="modal"
            data-bs-target="#questionModal"
            onClick={openAddModal}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Question
          </button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Bulk Upload Widget */}
        <div className="col-12 col-lg-5">
          <div className="card glass-card border p-4 h-100 d-flex flex-column" style={{ borderColor: 'var(--border-color)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0">Bulk Import JSON</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                data-bs-toggle="modal"
                data-bs-target="#jsonGuideModal"
              >
                <i className="bi bi-file-earmark-code me-1"></i>
                JSON Format Guide
              </button>
            </div>
            <p className="text-muted small mb-3">Upload a <code>.json</code> file to import questions. Select a category below to download a reference sample containing <strong>all topics</strong>.</p>
            
            {/* Category selection for sample template download */}
            <div className="p-3 rounded-3 border mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <div className="d-flex justify-content-between align-items-center mb-1.5">
                <label className="form-label small fw-bold mb-0 text-muted">
                  <i className="bi bi-collection me-1 text-primary"></i> Sample JSON Category:
                </label>
                <span className="badge bg-primary-subtle text-primary border small">
                  {SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory]?.length} Topics Included
                </span>
              </div>
              <div className="input-group input-group-sm">
                <select
                  className="form-select form-select-sm fw-medium"
                  value={sampleCategory}
                  onChange={(e) => setSampleCategory(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  <option value="Technical">Technical (All 16 Topics)</option>
                  <option value="Aptitude">Aptitude (All 12 Topics)</option>
                  <option value="Logical">Logical (All 8 Topics)</option>
                  <option value="Verbal">Verbal (All 8 Topics)</option>
                  <option value="All Categories">All Categories (All 44 Topics)</option>
                </select>
                <button
                  type="button"
                  className="btn btn-primary-custom btn-sm px-3"
                  onClick={() => handleDownloadSampleJSON(sampleCategory)}
                  title={`Download sample_${sampleCategory.toLowerCase().replace(/\s+/g, '_')}.json with all topics`}
                >
                  <i className="bi bi-download me-1"></i>
                  Download
                </button>
              </div>
            </div>

            <form onSubmit={handleJSONUpload} className="mt-auto">
              <div className="mb-3">
                <input
                  id="jsonFileInput"
                  className="form-control form-control-sm"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary-custom btn-sm w-100 py-2 fw-semibold"
                disabled={uploading || !selectedFile}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Importing Questions...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-1"></i>
                    Upload Questions JSON
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Database Filters Widget */}
        <div className="col-12 col-lg-7">
          <div className="card glass-card border p-4 h-100" style={{ borderColor: 'var(--border-color)' }}>
            <h5 className="fw-bold mb-3">Search & Filter</h5>
            <div className="row g-3">
              {/* Search Bar */}
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-semibold text-muted">Search Text</label>
                <div className="input-group">
                  <span className="input-group-text py-1">
                    <i className="bi bi-search small"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control py-1"
                    placeholder="Search question text or topic..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-semibold text-muted">Category</label>
                <select
                  className="form-select py-1"
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setTopicFilter(''); // Reset topic filter when category changes
                    setPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Logical">Logical</option>
                  <option value="Verbal">Verbal</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label small fw-semibold text-muted">Difficulty</label>
                <select
                  className="form-select py-1"
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Topic Filter */}
              <div className="col-12 col-sm-6 col-md-4">
                <label className="form-label small fw-semibold text-muted">Topic</label>
                <select
                  className="form-select py-1"
                  value={topicFilter}
                  onChange={(e) => {
                    setTopicFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Topics</option>
                  {topics.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions list Table */}
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : questions.length === 0 ? (
        <div className="card glass-card text-center p-5 border" style={{ borderColor: 'var(--border-color)' }}>
          <i className="bi bi-journal-x text-muted fs-1 mb-2"></i>
          <h4>No questions found</h4>
          <p className="text-muted">Try clearing filters or adding questions manually.</p>
        </div>
      ) : (
        <div className="card glass-card border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead>
                <tr>
                  <th className="px-4 py-3">Question</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Topic</th>
                  <th className="py-3 text-center">Difficulty</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id} style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-4 py-3" style={{ maxWidth: '400px' }}>
                      <strong className="d-block text-truncate" title={q.question}>{q.question}</strong>
                      <span className="text-muted small text-success fw-bold">Ans: {q.correctAnswer}</span>
                    </td>
                    <td className="py-3 text-capitalize">{q.category}</td>
                    <td className="py-3">{q.topic}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`badge border ${
                          q.difficulty === 'Easy'
                            ? 'bg-success-subtle text-success'
                            : q.difficulty === 'Hard'
                            ? 'bg-danger-subtle text-danger'
                            : 'bg-warning-subtle text-warning'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle me-2 p-0"
                        style={{ width: '30px', height: '30px' }}
                        data-bs-toggle="modal"
                        data-bs-target="#questionModal"
                        onClick={() => openEditModal(q)}
                        title="Edit Question"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle p-0"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => handleDeleteQuestion(q._id)}
                        title="Delete Question"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center py-4 border-top gap-1" style={{ borderColor: 'var(--border-color)' }}>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm px-3 ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <div className="modal fade" id="questionModal" tabIndex="-1" aria-labelledby="questionModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content glass-card border-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h5 className="modal-title fw-bold" id="questionModalLabel">
                {editingQuestion ? 'Edit Question Details' : 'Add New Question'}
              </h5>
              <button
                id="closeModalBtn"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body p-4" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <div className="row g-3">
                  {/* Category */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Aptitude">Aptitude</option>
                      <option value="Logical">Logical</option>
                      <option value="Verbal">Verbal</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>

                  {/* Topic */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Topic</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Operating Systems"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Difficulty */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Difficulty</label>
                    <select
                      className="form-select"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Question */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold d-flex justify-content-between">
                      <span>Question Text (Supports Markdown Code Blocks & Indented Pseudocode)</span>
                      <span className="text-muted small">Use <code>```lang</code> or standard indents</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Type question content or paste code/pseudocode with indentation..."
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      style={{ fontFamily: "'Fira Code', Consolas, Monaco, monospace", fontSize: '0.88rem' }}
                      required
                    ></textarea>
                    {formData.question && (formData.question.includes('\n') || formData.question.includes('`')) && (
                      <div className="mt-2 p-2.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <span className="small text-muted fw-bold d-block mb-1">
                          <i className="bi bi-eye me-1"></i> Live Code & Indentation Preview:
                        </span>
                        <FormattedQuestion text={formData.question} />
                      </div>
                    )}
                  </div>

                  {/* Options (A to D) */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Option A</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value A"
                      name="optionA"
                      value={formData.optionA}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Option B</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value B"
                      name="optionB"
                      value={formData.optionB}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Option C</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value C"
                      name="optionC"
                      value={formData.optionC}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Option D</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value D"
                      name="optionD"
                      value={formData.optionD}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Correct Answer */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-success">Correct Answer (Match text exactly)</label>
                    <select
                      className="form-select border-success"
                      name="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select correct option</option>
                      {formData.optionA && <option value={formData.optionA}>A: {formData.optionA}</option>}
                      {formData.optionB && <option value={formData.optionB}>B: {formData.optionB}</option>}
                      {formData.optionC && <option value={formData.optionC}>C: {formData.optionC}</option>}
                      {formData.optionD && <option value={formData.optionD}>D: {formData.optionD}</option>}
                    </select>
                  </div>

                  {/* Explanation */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Explanation (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Why is this answer correct?"
                      name="explanation"
                      value={formData.explanation}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top" style={{ borderColor: 'var(--border-color)' }}>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-custom">
                  {editingQuestion ? 'Save Changes' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* JSON Format Guide Modal */}
      <div className="modal fade" id="jsonGuideModal" tabIndex="-1" aria-labelledby="jsonGuideModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content glass-card border-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h5 className="modal-title fw-bold" id="jsonGuideModalLabel">
                <i className="bi bi-file-earmark-code text-primary me-2"></i>
                How to Create JSON Format for Uploading Questions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>
            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="alert border-0 p-3 mb-4 d-flex align-items-start" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)' }}>
                <i className="bi bi-info-circle-fill me-2 fs-5 mt-1"></i>
                <div>
                  <strong>Overview:</strong> To bulk import questions into the database, format your file as a JSON array (<code>[...]</code>) containing question objects. Follow the exact schema below.
                </div>
              </div>

              <h6 className="fw-bold mb-3">1. JSON Field Schema Specification</h6>
              <div className="table-responsive mb-4">
                <table className="table table-sm border align-middle small text-muted">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Allowed Values & Rules</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>category</code></td>
                      <td>String</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td><code>"Aptitude"</code>, <code>"Logical"</code>, <code>"Verbal"</code>, or <code>"Technical"</code></td>
                    </tr>
                    <tr>
                      <td><code>topic</code></td>
                      <td>String</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td>Subject topic (e.g. <code>"Percentages"</code>, <code>"Data Structures"</code>)</td>
                    </tr>
                    <tr>
                      <td><code>difficulty</code></td>
                      <td>String</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td><code>"Easy"</code>, <code>"Medium"</code>, or <code>"Hard"</code></td>
                    </tr>
                    <tr>
                      <td><code>question</code></td>
                      <td>String</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td>The main question statement text</td>
                    </tr>
                    <tr>
                      <td><code>options</code></td>
                      <td>Array of Strings</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td>Array of <strong>exactly 4 options</strong> e.g. <code>["A", "B", "C", "D"]</code></td>
                    </tr>
                    <tr>
                      <td><code>correctAnswer</code></td>
                      <td>String</td>
                      <td><span className="badge bg-danger">Required</span></td>
                      <td>Must match one of the string items in <code>options</code> <strong>character-for-character</strong></td>
                    </tr>
                    <tr>
                      <td><code>explanation</code></td>
                      <td>String</td>
                      <td><span className="badge bg-secondary">Optional</span></td>
                      <td>Explanation rationale shown to students in result review</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Category Selector Tabs inside Modal */}
              <div className="mb-3 p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <span className="small fw-bold text-muted">
                    <i className="bi bi-funnel me-1 text-primary"></i>
                    Select Category to Preview & Download:
                  </span>
                  <span className="badge bg-primary-subtle text-primary border small">
                    {SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory]?.length} Topics Covered
                  </span>
                </div>
                <div className="btn-group btn-group-sm w-100 flex-wrap" role="group">
                  {['Technical', 'Aptitude', 'Logical', 'Verbal', 'All Categories'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn ${sampleCategory === cat ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                      onClick={() => setSampleCategory(cat)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {cat} ({SAMPLE_QUESTIONS_BY_CATEGORY[cat]?.length})
                    </button>
                  ))}
                </div>

                {/* Topics Badges */}
                <div className="mt-2.5 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="small text-muted fw-semibold d-block mb-1.5">
                    Topics included in this {sampleCategory} sample ({SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory]?.length}):
                  </span>
                  <div className="d-flex flex-wrap gap-1">
                    {SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory]?.map((q, idx) => (
                      <span key={idx} className="badge bg-secondary-subtle text-secondary border small">
                        {q.topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h6 className="fw-bold mb-0">2. Valid JSON Code Example ({sampleCategory})</h6>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={handleCopyJSONSample}>
                    <i className="bi bi-clipboard me-1"></i> Copy Sample JSON
                  </button>
                  <button className="btn btn-sm btn-primary-custom" onClick={() => handleDownloadSampleJSON(sampleCategory)}>
                    <i className="bi bi-download me-1"></i> Download sample_{sampleCategory.toLowerCase().replace(/\s+/g, '_')}.json
                  </button>
                </div>
              </div>

              <pre className="p-3 rounded-3 border text-start small mb-0" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', overflowX: 'auto', maxHeight: '280px' }}>
                {JSON.stringify(SAMPLE_QUESTIONS_BY_CATEGORY[sampleCategory] || [], null, 2)}
              </pre>
            </div>
            <div className="modal-footer border-top" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">
                Close Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestions;
