import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';
import FormattedQuestion from '../components/FormattedQuestion';
import {
  SAMPLE_TOPICS_CONFIG,
  getSubtopicsByCategory,
  getQuestionsBySubtopic,
  getQuestionsByCategory,
  downloadSubtopicJSON,
  downloadCategoryJSON
} from '../utils/sampleQuestionsData';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  // Sample JSON Category & Sub-Topic Drilldown State
  const [sampleCategory, setSampleCategory] = useState('Technical');
  const [sampleSubtopic, setSampleSubtopic] = useState('Computer Networks');
  const [subtopicSort, setSubtopicSort] = useState('default'); // 'default' | 'asc' | 'desc'
  const [subtopicSearch, setSubtopicSearch] = useState('');
  const [showJSONPreview, setShowJSONPreview] = useState(false);

  // Add Question Modal Mode: 'form' (manual) or 'json' (paste JSON text)
  const [modalMode, setModalMode] = useState('form');
  const [pastedJSONText, setPastedJSONText] = useState('');
  const [jsonPasteStatus, setJsonPasteStatus] = useState(null);
  const [submittingPastedJSON, setSubmittingPastedJSON] = useState(false);

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
    setModalMode('form');
    setPastedJSONText('');
    setJsonPasteStatus(null);
    setFormData({
      category: sampleCategory || 'Technical',
      topic: sampleSubtopic || '',
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
    setModalMode('form');
    setPastedJSONText('');
    setJsonPasteStatus(null);
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

  // Parse pasted JSON text and auto-fill manual form fields
  const handleApplyPastedJSONToForm = () => {
    if (!pastedJSONText.trim()) {
      setJsonPasteStatus({ type: 'error', message: 'Please paste JSON text into the box first.' });
      return;
    }

    try {
      let parsed = JSON.parse(pastedJSONText);
      let targetQ = null;

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setJsonPasteStatus({ type: 'error', message: 'The pasted JSON array contains 0 questions.' });
          return;
        }
        targetQ = parsed[0];
      } else if (typeof parsed === 'object' && parsed !== null) {
        targetQ = parsed;
      } else {
        setJsonPasteStatus({ type: 'error', message: 'Pasted text must be a valid JSON question object or array.' });
        return;
      }

      // Extract options either from options array or optionA-D keys
      let optionsList = [];
      if (Array.isArray(targetQ.options) && targetQ.options.length >= 2) {
        optionsList = targetQ.options;
      } else if (targetQ.optionA && targetQ.optionB) {
        optionsList = [targetQ.optionA, targetQ.optionB, targetQ.optionC || '', targetQ.optionD || ''];
      }

      if (!targetQ.question) {
        setJsonPasteStatus({ type: 'error', message: 'Pasted JSON is missing the required "question" field.' });
        return;
      }

      setFormData({
        category: targetQ.category || sampleCategory || 'Technical',
        topic: targetQ.topic || sampleSubtopic || '',
        difficulty: targetQ.difficulty || 'Medium',
        question: targetQ.question || '',
        optionA: optionsList[0] || '',
        optionB: optionsList[1] || '',
        optionC: optionsList[2] || '',
        optionD: optionsList[3] || '',
        correctAnswer: targetQ.correctAnswer || optionsList[0] || '',
        explanation: targetQ.explanation || '',
      });

      setModalMode('form');
      setToastMessage(
        Array.isArray(parsed) && parsed.length > 1
          ? `Filled form with question 1 of ${parsed.length} from pasted JSON!`
          : 'Pasted JSON auto-filled into form fields successfully!'
      );
      setTimeout(() => setToastMessage(''), 3500);
      setJsonPasteStatus({ type: 'success', message: 'Form populated! Switched to manual form view.' });
    } catch (err) {
      setJsonPasteStatus({ type: 'error', message: `Invalid JSON syntax: ${err.message}` });
    }
  };

  // Direct import and save of pasted JSON
  const handleDirectSavePastedJSON = async () => {
    if (!pastedJSONText.trim()) {
      setJsonPasteStatus({ type: 'error', message: 'Please paste JSON text into the box first.' });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(pastedJSONText);
    } catch (err) {
      setJsonPasteStatus({ type: 'error', message: `Invalid JSON syntax: ${err.message}` });
      return;
    }

    try {
      setSubmittingPastedJSON(true);

      if (Array.isArray(parsed)) {
        // Bulk import array
        const res = await axios.post('/questions/bulk', parsed);
        if (res.data.success) {
          setToastMessage(res.data.message || `${parsed.length} questions imported successfully!`);
          fetchQuestions();
          const closeBtn = document.getElementById('closeModalBtn');
          if (closeBtn) closeBtn.click();
          setTimeout(() => setToastMessage(''), 3500);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Single question
        const res = await axios.post('/questions', parsed);
        if (res.data.success) {
          setToastMessage('Question added successfully via JSON!');
          fetchQuestions();
          const closeBtn = document.getElementById('closeModalBtn');
          if (closeBtn) closeBtn.click();
          setTimeout(() => setToastMessage(''), 3500);
        }
      }
    } catch (err) {
      console.error(err);
      setJsonPasteStatus({
        type: 'error',
        message: err.response?.data?.message || err.response?.data?.error || 'Failed to save question(s) from JSON',
      });
    } finally {
      setSubmittingPastedJSON(false);
    }
  };

  // Helper to insert current topic sample JSON into paste box
  const handleInsertSamplePastedJSON = () => {
    const sample = getQuestionsBySubtopic(sampleCategory, sampleSubtopic);
    if (sample && sample.length > 0) {
      setPastedJSONText(JSON.stringify(sample[0], null, 2));
      setJsonPasteStatus({ type: 'success', message: `Inserted sample for ${sampleCategory} > ${sampleSubtopic}` });
    } else {
      const catSample = getQuestionsByCategory(sampleCategory);
      if (catSample && catSample.length > 0) {
        setPastedJSONText(JSON.stringify(catSample[0], null, 2));
        setJsonPasteStatus({ type: 'success', message: `Inserted sample for ${sampleCategory}` });
      }
    }
  };

  // Helper to format/prettify pasted JSON
  const handlePrettifyPastedJSON = () => {
    if (!pastedJSONText.trim()) return;
    try {
      const parsed = JSON.parse(pastedJSONText);
      setPastedJSONText(JSON.stringify(parsed, null, 2));
      setJsonPasteStatus({ type: 'success', message: 'JSON formatted cleanly.' });
    } catch (err) {
      setJsonPasteStatus({ type: 'error', message: `Cannot format JSON: ${err.message}` });
    }
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

  // Switch category and select first sub-topic
  const handleCategoryChange = (cat) => {
    setSampleCategory(cat);
    const subtopics = getSubtopicsByCategory(cat, 'default');
    if (subtopics && subtopics.length > 0) {
      setSampleSubtopic(subtopics[0]);
    } else {
      setSampleSubtopic('');
    }
    setSubtopicSearch('');
  };

  // Download JSON for selected sub-topic (e.g. Computer Networks, OS, etc.)
  const handleDownloadSubtopicJSON = (cat = sampleCategory, sub = sampleSubtopic) => {
    downloadSubtopicJSON(cat, sub);
    const qList = getQuestionsBySubtopic(cat, sub);
    setToastMessage(`Downloaded JSON for ${cat} > ${sub} (${qList.length} questions)!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Download all sub-topics in selected category
  const handleDownloadCategoryJSON = (cat = sampleCategory) => {
    downloadCategoryJSON(cat);
    const qList = getQuestionsByCategory(cat);
    setToastMessage(`Downloaded ${cat} bundle JSON with all topics (${qList.length} questions)!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Copy sub-topic JSON to clipboard
  const handleCopySubtopicJSON = () => {
    const data = getQuestionsBySubtopic(sampleCategory, sampleSubtopic);
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setToastMessage(`Copied ${sampleCategory} > ${sampleSubtopic} JSON (${data.length} questions) to clipboard!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Copy whole category JSON to clipboard
  const handleCopyCategoryJSON = () => {
    const data = getQuestionsByCategory(sampleCategory);
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setToastMessage(`Copied all ${sampleCategory} sample questions (${data.length} questions) to clipboard!`);
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

  const displayedSubtopics = getSubtopicsByCategory(sampleCategory, subtopicSort).filter((st) =>
    st.toLowerCase().includes(subtopicSearch.toLowerCase().trim())
  );
  const currentSubtopicQuestions = getQuestionsBySubtopic(sampleCategory, sampleSubtopic);
  const currentCategoryQuestions = getQuestionsByCategory(sampleCategory);

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
            
            {/* Step-by-Step Sample JSON Template Downloader */}
            <div className="p-3 rounded-3 border mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              
              {/* Step 1: Select Category */}
              <div className="mb-2.5">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold mb-0 text-muted">
                    <span className="badge bg-primary text-white rounded-circle me-1.5" style={{ width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>1</span>
                    Category:
                  </label>
                  <span className="badge bg-primary-subtle text-primary border" style={{ fontSize: '10.5px' }}>
                    {SAMPLE_TOPICS_CONFIG[sampleCategory]?.length || 0} Topics
                  </span>
                </div>
                <div className="btn-group btn-group-sm w-100" role="group">
                  {['Technical', 'Aptitude', 'Logical', 'Verbal'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn fw-semibold ${sampleCategory === cat ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                      style={{ fontSize: '11.5px', padding: '0.35rem 0.5rem' }}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Topic & Sorting */}
              <div className="mb-2.5">
                <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-1">
                  <label className="form-label small fw-bold mb-0 text-muted">
                    <span className="badge bg-primary text-white rounded-circle me-1.5" style={{ width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>2</span>
                    Topic / Sub-Topic:
                  </label>
                  
                  {/* Sorting dropdown */}
                  <div className="d-flex align-items-center gap-1">
                    <span className="text-muted" style={{ fontSize: '11px' }}>Sort:</span>
                    <select
                      className="form-select form-select-sm py-0 px-1.5"
                      style={{ fontSize: '11px', width: 'auto', height: '22px', borderColor: 'var(--border-color)' }}
                      value={subtopicSort}
                      onChange={(e) => setSubtopicSort(e.target.value)}
                      title="Sort topics list"
                    >
                      <option value="default">Default</option>
                      <option value="asc">A → Z</option>
                      <option value="desc">Z → A</option>
                    </select>
                  </div>
                </div>

                {/* Topic dropdown */}
                <select
                  className="form-select form-select-sm fw-medium mb-1.5"
                  value={sampleSubtopic}
                  onChange={(e) => setSampleSubtopic(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)', fontSize: '12.5px' }}
                >
                  <option value="__ALL__">★ All {sampleCategory} Topics ({currentCategoryQuestions.length} Questions Bundle)</option>
                  <optgroup label={`${sampleCategory} Sub-Topics (${subtopicSort === 'asc' ? 'A-Z' : subtopicSort === 'desc' ? 'Z-A' : 'Curriculum Order'})`}>
                    {displayedSubtopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Clickable Quick Topic Chips */}
                <div
                  className="d-flex flex-wrap gap-1 p-1.5 rounded-2 border"
                  style={{
                    maxHeight: '85px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  {displayedSubtopics.map((t) => {
                    const isSelected = sampleSubtopic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`btn btn-sm py-0 px-1.5 rounded-pill text-nowrap ${
                          isSelected ? 'btn-primary-custom' : 'btn-outline-secondary'
                        }`}
                        style={{ fontSize: '10.5px' }}
                        onClick={() => setSampleSubtopic(t)}
                      >
                        {isSelected && <i className="bi bi-check2 me-0.5"></i>}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Download Sample JSON */}
              <div className="p-2.5 rounded-2 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="text-truncate me-2" style={{ fontSize: '12px' }}>
                    <span className="text-muted fw-semibold">Target: </span>
                    <span className="badge bg-primary-subtle text-primary border me-1" style={{ fontSize: '10.5px' }}>{sampleCategory}</span>
                    <strong className="text-primary text-truncate">
                      {sampleSubtopic === '__ALL__' ? `All Topics` : sampleSubtopic}
                    </strong>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary small">
                    {sampleSubtopic === '__ALL__' ? currentCategoryQuestions.length : currentSubtopicQuestions.length} Qs
                  </span>
                </div>

                <div className="d-flex gap-1.5">
                  <button
                    type="button"
                    className="btn btn-primary-custom btn-sm flex-grow-1 fw-semibold py-1.5 d-flex align-items-center justify-content-center"
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                      if (sampleSubtopic === '__ALL__') {
                        handleDownloadCategoryJSON(sampleCategory);
                      } else {
                        handleDownloadSubtopicJSON(sampleCategory, sampleSubtopic);
                      }
                    }}
                    title={`Download sample JSON for ${sampleSubtopic === '__ALL__' ? `All ${sampleCategory} Topics` : `${sampleCategory} > ${sampleSubtopic}`}`}
                  >
                    <i className="bi bi-download me-1.5"></i>
                    Download Sample JSON
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm px-2 py-1.5"
                    onClick={() => {
                      if (sampleSubtopic === '__ALL__') {
                        handleCopyCategoryJSON();
                      } else {
                        handleCopySubtopicJSON();
                      }
                    }}
                    title="Copy JSON to clipboard"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm px-2 py-1.5 ${showJSONPreview ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setShowJSONPreview(!showJSONPreview)}
                    title="Toggle JSON Preview"
                  >
                    <i className="bi bi-code-slash"></i>
                  </button>
                </div>

                {showJSONPreview && (
                  <div className="mt-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <pre
                      className="p-2 rounded-2 border text-start mb-0"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '10.5px',
                        maxHeight: '130px',
                        overflowX: 'auto',
                        overflowY: 'auto'
                      }}
                    >
                      {JSON.stringify(sampleSubtopic === '__ALL__' ? currentCategoryQuestions : currentSubtopicQuestions, null, 2)}
                    </pre>
                  </div>
                )}
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
            
            {/* Modal Header */}
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle p-1.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)', width: '36px', height: '36px' }}>
                  <i className={`bi ${editingQuestion ? 'bi-pencil-square' : modalMode === 'json' ? 'bi-code-square' : 'bi-plus-circle-fill'} fs-5`}></i>
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0" id="questionModalLabel">
                    {editingQuestion ? 'Edit Question Details' : 'Add New Question'}
                  </h5>
                  <small className="text-muted" style={{ fontSize: '11.5px' }}>
                    {modalMode === 'json' ? 'Paste raw JSON text to auto-fill form or directly import' : 'Fill in the fields manually or paste JSON to auto-populate'}
                  </small>
                </div>
              </div>
              <button
                id="closeModalBtn"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>

            {/* Mode Selector Tabs (Manual Form vs Paste JSON) */}
            <div className="px-4 pt-3 pb-0">
              <div className="btn-group btn-group-sm w-100 p-1 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  className={`btn rounded-2 fw-semibold py-1.5 ${modalMode === 'form' ? 'btn-primary-custom shadow-sm' : 'btn-outline-secondary border-0 text-muted'}`}
                  style={{ fontSize: '12.5px' }}
                  onClick={() => setModalMode('form')}
                >
                  <i className="bi bi-pencil-square me-1.5"></i>
                  Manual Form Entry
                </button>
                <button
                  type="button"
                  className={`btn rounded-2 fw-semibold py-1.5 ${modalMode === 'json' ? 'btn-primary-custom shadow-sm' : 'btn-outline-secondary border-0 text-muted'}`}
                  style={{ fontSize: '12.5px' }}
                  onClick={() => setModalMode('json')}
                >
                  <i className="bi bi-code-square me-1.5"></i>
                  Paste JSON as Text
                  <span className="badge bg-success-subtle text-success ms-1.5 border" style={{ fontSize: '10px' }}>⚡ Auto-Fill</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Manual Form */}
            {modalMode === 'form' ? (
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body px-4 py-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  
                  {/* Quick helper banner to switch to JSON paste */}
                  <div className="d-flex justify-content-between align-items-center p-2 px-3 rounded-2 border mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                    <span className="small text-muted" style={{ fontSize: '12px' }}>
                      <i className="bi bi-info-circle text-primary me-1"></i>
                      Have a JSON snippet? Paste it to auto-populate all fields instantly:
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary py-0 px-2 fw-semibold"
                      style={{ fontSize: '11.5px' }}
                      onClick={() => setModalMode('json')}
                    >
                      <i className="bi bi-clipboard-plus me-1"></i>
                      Paste JSON
                    </button>
                  </div>

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
                      <label className="form-label small fw-semibold">
                        Correct Answer <span className="text-danger">*</span> (Must match one of the 4 options)
                      </label>
                      <select
                        className="form-select"
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Correct Answer --</option>
                        {formData.optionA && <option value={formData.optionA}>Option A: {formData.optionA}</option>}
                        {formData.optionB && <option value={formData.optionB}>Option B: {formData.optionB}</option>}
                        {formData.optionC && <option value={formData.optionC}>Option C: {formData.optionC}</option>}
                        {formData.optionD && <option value={formData.optionD}>Option D: {formData.optionD}</option>}
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
            ) : (
              /* Mode 2: Paste JSON as Text */
              <div>
                <div className="modal-body px-4 py-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                  
                  {/* Toolbar with sample helpers */}
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div>
                      <span className="small fw-bold text-muted">
                        <i className="bi bi-file-earmark-code me-1 text-primary"></i>
                        JSON Payload (Single Question or Array)
                      </span>
                    </div>
                    <div className="d-flex gap-1.5">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary py-0.5 px-2"
                        style={{ fontSize: '11.5px' }}
                        onClick={handleInsertSamplePastedJSON}
                        title="Insert ready sample JSON for current category & topic"
                      >
                        <i className="bi bi-magic me-1"></i>
                        Insert {sampleSubtopic ? `"${sampleSubtopic}"` : sampleCategory} Sample
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0.5 px-2"
                        style={{ fontSize: '11.5px' }}
                        onClick={handlePrettifyPastedJSON}
                        disabled={!pastedJSONText.trim()}
                        title="Format JSON with indentation"
                      >
                        <i className="bi bi-text-indent-left me-1"></i>
                        Format JSON
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0.5 px-2"
                        style={{ fontSize: '11.5px' }}
                        onClick={() => {
                          setPastedJSONText('');
                          setJsonPasteStatus(null);
                        }}
                        disabled={!pastedJSONText}
                        title="Clear editor"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Textarea for JSON */}
                  <textarea
                    className="form-control mb-2"
                    rows="10"
                    placeholder={`Paste question JSON text here...\nExample:\n{\n  "category": "${sampleCategory}",\n  "topic": "${sampleSubtopic || 'General'}",\n  "difficulty": "Medium",\n  "question": "Sample question statement?",\n  "options": ["Option A", "Option B", "Option C", "Option D"],\n  "correctAnswer": "Option A",\n  "explanation": "Why Option A is correct"\n}`}
                    value={pastedJSONText}
                    onChange={(e) => {
                      setPastedJSONText(e.target.value);
                      setJsonPasteStatus(null);
                    }}
                    style={{
                      fontFamily: "'Fira Code', Consolas, Monaco, monospace",
                      fontSize: '0.84rem',
                      lineHeight: '1.5',
                      tabSize: 2,
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderColor: jsonPasteStatus?.type === 'error' ? 'var(--color-danger)' : 'var(--border-color)'
                    }}
                  ></textarea>

                  {/* Status & Validation Message */}
                  {jsonPasteStatus && (
                    <div
                      className={`alert py-2 px-3 small d-flex align-items-center mb-0 ${
                        jsonPasteStatus.type === 'error' ? 'alert-danger' : 'alert-success'
                      }`}
                      style={{ fontSize: '12px' }}
                    >
                      <i className={`bi ${jsonPasteStatus.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i>
                      <span>{jsonPasteStatus.message}</span>
                    </div>
                  )}

                  {!jsonPasteStatus && (
                    <div className="d-flex justify-content-between align-items-center text-muted small" style={{ fontSize: '11.5px' }}>
                      <span>
                        <i className="bi bi-lightbulb me-1 text-warning"></i>
                        Supports single question object <code>&#123;...&#125;</code> or array of questions <code>[...]</code>.
                      </span>
                      <span>{pastedJSONText.length} characters</span>
                    </div>
                  )}
                </div>

                {/* Footer for Paste JSON mode */}
                <div className="modal-footer border-top d-flex justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary-custom fw-semibold"
                      onClick={handleApplyPastedJSONToForm}
                      disabled={!pastedJSONText.trim()}
                      title="Parse JSON and populate form fields for review"
                    >
                      <i className="bi bi-pencil-square me-1.5"></i>
                      Auto-Fill into Form
                    </button>
                    <button
                      type="button"
                      className="btn btn-success fw-semibold"
                      onClick={handleDirectSavePastedJSON}
                      disabled={!pastedJSONText.trim() || submittingPastedJSON}
                      title="Directly save without manual review"
                    >
                      {submittingPastedJSON ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1.5" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-arrow-up-fill me-1.5"></i>
                          Direct Import &amp; Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

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

              {/* Step 1 & 2: Category and Topic Selection inside Modal */}
              <div className="mb-3 p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <span className="small fw-bold text-muted">
                    <span className="badge bg-primary text-white rounded-circle me-1" style={{ width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>1</span>
                    Select Category:
                  </span>
                  <span className="badge bg-primary-subtle text-primary border small">
                    {SAMPLE_TOPICS_CONFIG[sampleCategory]?.length || 0} Topics Available
                  </span>
                </div>
                <div className="btn-group btn-group-sm w-100 flex-wrap mb-3" role="group">
                  {['Technical', 'Aptitude', 'Logical', 'Verbal'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn fw-semibold ${sampleCategory === cat ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                      onClick={() => handleCategoryChange(cat)}
                      style={{ fontSize: '0.82rem' }}
                    >
                      {cat} ({SAMPLE_TOPICS_CONFIG[cat]?.length})
                    </button>
                  ))}
                </div>

                {/* Topics Selection with Sorting */}
                <div className="pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span className="small text-muted fw-bold">
                      <span className="badge bg-primary text-white rounded-circle me-1" style={{ width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>2</span>
                      Select Topic in {sampleCategory}:
                    </span>
                    <div className="d-flex align-items-center gap-1.5">
                      <span className="text-muted small" style={{ fontSize: '11.5px' }}>Sort:</span>
                      <select
                        className="form-select form-select-sm py-0 px-2"
                        style={{ fontSize: '11.5px', width: 'auto', height: '24px' }}
                        value={subtopicSort}
                        onChange={(e) => setSubtopicSort(e.target.value)}
                      >
                        <option value="default">Default</option>
                        <option value="asc">A → Z</option>
                        <option value="desc">Z → A</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      className={`btn btn-sm py-1 px-2.5 rounded-pill ${
                        sampleSubtopic === '__ALL__' ? 'btn-primary-custom' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => setSampleSubtopic('__ALL__')}
                    >
                      ★ All {sampleCategory} Topics ({currentCategoryQuestions.length} Qs)
                    </button>
                    {displayedSubtopics.map((t) => {
                      const isSelected = sampleSubtopic === t;
                      const qCount = getQuestionsBySubtopic(sampleCategory, t).length;
                      return (
                        <button
                          key={t}
                          type="button"
                          className={`btn btn-sm py-1 px-2.5 rounded-pill ${
                            isSelected ? 'btn-primary-custom' : 'btn-outline-secondary'
                          }`}
                          style={{ fontSize: '11.5px' }}
                          onClick={() => setSampleSubtopic(t)}
                        >
                          {isSelected && <i className="bi bi-check2 me-1"></i>}
                          {t} ({qCount})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Code Example and Actions */}
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <div>
                  <h6 className="fw-bold mb-0">
                    3. JSON Code Example:
                    <span className="text-primary ms-1.5">
                      {sampleCategory} &gt; {sampleSubtopic === '__ALL__' ? `All Topics` : sampleSubtopic}
                    </span>
                  </h6>
                  <small className="text-muted">
                    {sampleSubtopic === '__ALL__' ? currentCategoryQuestions.length : currentSubtopicQuestions.length} Questions in this JSON
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      if (sampleSubtopic === '__ALL__') {
                        handleCopyCategoryJSON();
                      } else {
                        handleCopySubtopicJSON();
                      }
                    }}
                  >
                    <i className="bi bi-clipboard me-1"></i> Copy JSON
                  </button>
                  <button
                    className="btn btn-sm btn-primary-custom"
                    onClick={() => {
                      if (sampleSubtopic === '__ALL__') {
                        handleDownloadCategoryJSON(sampleCategory);
                      } else {
                        handleDownloadSubtopicJSON(sampleCategory, sampleSubtopic);
                      }
                    }}
                  >
                    <i className="bi bi-download me-1"></i>
                    Download {sampleSubtopic === '__ALL__' ? `All ${sampleCategory} Topics` : sampleSubtopic} JSON
                  </button>
                </div>
              </div>

              <pre className="p-3 rounded-3 border text-start small mb-0" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', overflowX: 'auto', maxHeight: '280px' }}>
                {JSON.stringify(sampleSubtopic === '__ALL__' ? currentCategoryQuestions : currentSubtopicQuestions, null, 2)}
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
