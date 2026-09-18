import React from 'react';

/**
 * FormattedQuestion Component
 * Properly renders question text, pseudocode, and code snippets with exact indentation,
 * line numbers, monospace font, and syntax highlighting style.
 */
const FormattedQuestion = ({ text, className = '', isOption = false }) => {
  if (!text) return null;

  // Helper to render inline code with backticks `code`
  const renderInlineText = (str) => {
    if (!str.includes('`')) {
      return str;
    }
    const parts = str.split(/(`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const codeContent = part.slice(1, -1);
        return (
          <code key={idx} className="inline-code">
            {codeContent}
          </code>
        );
      }
      return part;
    });
  };

  // If used for options, keep compact and preserve whitespace/inline code
  if (isOption) {
    return (
      <span className={`formatted-option-text ${className}`} style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
        {renderInlineText(text)}
      </span>
    );
  }

  // Check for Markdown fenced code blocks: ```lang ... ```
  if (text.includes('```')) {
    const segments = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className={`formatted-question-content ${className}`}>
        {segments.map((segment, sIdx) => {
          if (segment.startsWith('```') && segment.endsWith('```')) {
            const inner = segment.slice(3, -3);
            const firstNewline = inner.indexOf('\n');
            let lang = 'code';
            let codeBody = inner;

            if (firstNewline !== -1) {
              const possibleLang = inner.slice(0, firstNewline).trim();
              if (possibleLang && !possibleLang.includes(' ') && possibleLang.length < 20) {
                lang = possibleLang;
                codeBody = inner.slice(firstNewline + 1);
              }
            }

            return <CodeBlockCard key={sIdx} code={codeBody} lang={lang} />;
          }

          // Regular text segment
          return (
            <div
              key={sIdx}
              className="question-text-segment"
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
            >
              {renderInlineText(segment)}
            </div>
          );
        })}
      </div>
    );
  }

  // If text contains newlines and looks like code/pseudocode, detect code sections
  const lines = text.split('\n');
  if (lines.length > 1) {
    // Check if any lines have indentation or code syntax
    const hasIndentOrCode = lines.some((l) => {
      const trimmed = l.trim();
      return (
        l.startsWith('    ') ||
        l.startsWith('\t') ||
        l.startsWith('  ') ||
        /^(function|def|class|public|private|int|for|while|if|else|return|set|print|cout|cin|import|package)\b/i.test(trimmed) ||
        /[;{}]$/.test(trimmed)
      );
    });

    if (hasIndentOrCode) {
      // Find intro lines before code (if any) and code lines
      const isCodeLine = (l) => {
        const trimmed = l.trim();
        if (!trimmed) return true; // empty lines within code
        return (
          l.startsWith('    ') ||
          l.startsWith('\t') ||
          l.startsWith('  ') ||
          /^(function|def|class|public|private|int|float|double|char|boolean|string|void|for|while|if|else|return|set|print|cout|cin|select|from|where)\b/i.test(trimmed) ||
          /[;{}]$/.test(trimmed) ||
          /^[A-Za-z0-9_]+\s*\(.*\)/.test(trimmed)
        );
      };

      // Check if there is an introductory line like "Consider the following pseudocode:"
      let firstCodeIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (isCodeLine(lines[i]) && lines[i].trim().length > 0) {
          firstCodeIdx = i;
          break;
        }
      }

      if (firstCodeIdx !== -1) {
        const intro = lines.slice(0, firstCodeIdx).join('\n').trim();
        const remaining = lines.slice(firstCodeIdx);

        // Find if there is an ending question prompt after the code
        let lastCodeIdx = remaining.length - 1;
        while (lastCodeIdx >= 0 && !remaining[lastCodeIdx].trim()) {
          lastCodeIdx--;
        }

        // If the last line is a question prompt like "What will be printed?" or ends with "?"
        let outro = '';
        if (lastCodeIdx > 0 && remaining[lastCodeIdx].trim().endsWith('?') && !isCodeLine(remaining[lastCodeIdx])) {
          outro = remaining[lastCodeIdx].trim();
          lastCodeIdx--;
        }

        const codeBlock = remaining.slice(0, lastCodeIdx + 1).join('\n');

        return (
          <div className={`formatted-question-content ${className}`}>
            {intro && (
              <div className="question-intro mb-2" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {renderInlineText(intro)}
              </div>
            )}
            <CodeBlockCard code={codeBlock} lang="Pseudocode / Code" />
            {outro && (
              <div className="question-outro mt-2 fw-semibold" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {renderInlineText(outro)}
              </div>
            )}
          </div>
        );
      }
    }

    // Default multi-line text: preserve every single newline and indentation space
    return (
      <div
        className={`formatted-question-content ${className}`}
        style={{ whiteSpace: 'pre-wrap', tabSize: 4, lineHeight: '1.6' }}
      >
        {renderInlineText(text)}
      </div>
    );
  }

  // Single line text: preserve inline code and exact spacing
  return (
    <div
      className={`formatted-question-content ${className}`}
      style={{ whiteSpace: 'pre-wrap', tabSize: 4, lineHeight: '1.6' }}
    >
      {renderInlineText(text)}
    </div>
  );
};

/**
 * CodeBlockCard Component
 * Renders a syntax-styled code box with terminal window dots, language badge,
 * copy button, and line numbers with strict indentation.
 */
const CodeBlockCard = ({ code, lang = 'CODE' }) => {
  const [copied, setCopied] = React.useState(false);

  const cleanCode = code.replace(/^\n+|\n+$/g, '');
  const lines = cleanCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-snippet-box my-2.5 rounded-3 border overflow-hidden shadow-sm">
      <div className="code-snippet-header d-flex justify-content-between align-items-center px-3 py-1.5 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <span className="code-dot red"></span>
          <span className="code-dot yellow"></span>
          <span className="code-dot green"></span>
          <span className="code-lang-label ms-1.5 fw-bold text-uppercase">
            {lang || 'CODE'}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none py-0 px-2 d-flex align-items-center"
          onClick={handleCopy}
          style={{ color: '#94a3b8', fontSize: '0.75rem' }}
          title="Copy Code"
        >
          {copied ? (
            <>
              <i className="bi bi-check2 text-success me-1"></i>
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <i className="bi bi-clipboard me-1"></i>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="code-snippet-body p-2.5 overflow-x-auto">
        <pre className="code-snippet-pre m-0">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="code-line d-flex">
                <span className="code-line-number text-end pe-3">{idx + 1}</span>
                <span className="code-line-text flex-grow-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default FormattedQuestion;
