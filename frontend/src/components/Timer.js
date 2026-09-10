import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ initialSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timeUpTriggered = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!timeUpTriggered.current) {
        timeUpTriggered.current = true;
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 300; // Less than 5 minutes

  return (
    <div
      className={`d-flex align-items-center justify-content-center px-3 py-2 rounded-3 fs-5 fw-bold border ${
        isLowTime
          ? 'text-danger border-danger bg-danger-subtle bg-opacity-25'
          : 'border-secondary'
      }`}
      style={{
        transition: 'var(--transition-smooth)',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)',
        minWidth: '110px'
      }}
    >
      <i className={`bi bi-clock-history me-2 ${isLowTime ? 'text-danger animate-pulse' : 'text-primary'}`}></i>
      <span style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
