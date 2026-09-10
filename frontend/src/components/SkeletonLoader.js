import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'list') {
    return (
      <div className="w-100">
        {items.map((_, idx) => (
          <div key={idx} className="d-flex align-items-center mb-3 p-3 border rounded" style={{ borderColor: 'var(--border-color)' }}>
            <div className="skeleton-bg rounded-circle me-3" style={{ width: '48px', height: '48px' }}></div>
            <div className="flex-grow-1">
              <div className="skeleton-bg skeleton-text w-50"></div>
              <div className="skeleton-bg skeleton-text w-25"></div>
            </div>
            <div className="skeleton-bg skeleton-text w-10"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default is card type
  return (
    <div className="row g-4">
      {items.map((_, idx) => (
        <div key={idx} className="col-12 col-md-6 col-lg-4">
          <div className="card glass-card p-4 border" style={{ borderColor: 'var(--border-color)', height: '220px' }}>
            <div className="skeleton-bg skeleton-title w-75"></div>
            <div className="skeleton-bg skeleton-text w-100"></div>
            <div className="skeleton-bg skeleton-text w-100"></div>
            <div className="skeleton-bg skeleton-text w-50 mb-4"></div>
            <div className="skeleton-bg rounded w-25 mt-auto" style={{ height: '36px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
