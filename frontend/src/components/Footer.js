import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 border-top mt-auto" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-md-6 text-center text-md-start">
            <span className="text-muted">
              © {new Date().getFullYear()} SecureTest Portal. All rights reserved.
            </span>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span className="text-muted small">
              Built with AI Security & MERN Stack proctoring system.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
