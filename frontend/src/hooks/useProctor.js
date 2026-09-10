import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useProctor = ({ active, onViolation, onAutoSubmit }) => {
  const [violationsCount, setViolationsCount] = useState(0);
  const violationsRef = useRef(0);

  // Helper to log violation to backend
  const logViolationToDB = async (type, details) => {
    try {
      await axios.post('/proctor/log', { type, details });
      console.log(`Violation logged: ${type} - ${details}`);
    } catch (err) {
      console.error('Failed to log violation:', err);
    }
  };

  // Helper to handle and record violation
  const triggerViolation = (type, details) => {
    if (!active) return;

    const newCount = violationsRef.current + 1;
    violationsRef.current = newCount;
    setViolationsCount(newCount);

    // Call user callback
    if (onViolation) {
      onViolation(type, details, newCount);
    }

    // Log to DB
    logViolationToDB(type, details);

    // Check auto-submit threshold
    if (newCount >= 3) {
      if (onAutoSubmit) {
        onAutoSubmit();
      }
    }
  };

  useEffect(() => {
    if (!active) {
      setViolationsCount(0);
      violationsRef.current = 0;
      return;
    }

    // 1. Right Click Disable
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerViolation('Right Click / Copy / Paste Attempt', 'Attempted to right-click');
    };

    // 2. Disable Copy, Paste, Cut
    const handleCopy = (e) => {
      e.preventDefault();
      triggerViolation('Right Click / Copy / Paste Attempt', 'Attempted to copy text');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      triggerViolation('Right Click / Copy / Paste Attempt', 'Attempted to paste text');
    };

    const handleCut = (e) => {
      e.preventDefault();
      triggerViolation('Right Click / Copy / Paste Attempt', 'Attempted to cut text');
    };

    // 3. Disable Keyboard Shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, F12, Ctrl+U, Ctrl+Shift+I)
    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        triggerViolation('DevTools Detected', 'F12 pressed');
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        triggerViolation('Right Click / Copy / Paste Attempt', 'Ctrl+U pressed (View Source)');
      }

      // Ctrl+Shift+I or Ctrl+Shift+J or Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        triggerViolation('DevTools Detected', 'DevTools shortcut pressed (Ctrl+Shift+I/J/C)');
      }

      // Ctrl+C
      if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
        triggerViolation('Right Click / Copy / Paste Attempt', 'Ctrl+C pressed (Copy)');
      }

      // Ctrl+V
      if (e.ctrlKey && e.keyCode === 86) {
        e.preventDefault();
        triggerViolation('Right Click / Copy / Paste Attempt', 'Ctrl+V pressed (Paste)');
      }

      // Ctrl+A
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        triggerViolation('Right Click / Copy / Paste Attempt', 'Ctrl+A pressed (Select All)');
      }
    };

    // 4. Tab Switching & Window Blur Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab Switch', 'Switched away from the exam tab (tab hidden)');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Tab Switch', 'Focus lost from the exam window (clicked outside)');
    };

    // 5. Fullscreen Exit Detection
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement ||
                           document.webkitFullscreenElement ||
                           document.mozFullScreenElement ||
                           document.msFullscreenElement;
      
      if (!isFullscreen && active) {
        triggerViolation('Fullscreen Exit', 'Exited the mandatory fullscreen mode');
      }
    };

    // 6. DevTools Detection using Window Resize Difference
    const devToolsThreshold = 160;
    const checkDevToolsResize = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > devToolsThreshold || heightDiff > devToolsThreshold) {
        // Only trigger if window is active, since some browsers have other panel offsets
        if (document.hasFocus()) {
          triggerViolation('DevTools Detected', `DevTools panel width/height offset detected (w:${widthDiff}, h:${heightDiff})`);
        }
      }
    };

    // Attach listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    const devtoolsTimer = setInterval(checkDevToolsResize, 2000);

    // Cleanup listeners
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);

      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

      clearInterval(devtoolsTimer);
    };
  }, [active]);

  // Request Fullscreen helper
  const enterFullscreen = () => {
    const docEl = document.documentElement;
    const requestFs = docEl.requestFullscreen ||
                      docEl.mozRequestFullScreen ||
                      docEl.webkitRequestFullscreen ||
                      docEl.msRequestFullscreen;
    
    if (requestFs) {
      requestFs.call(docEl).catch((err) => {
        console.error('Error enabling fullscreen mode:', err);
      });
    }
  };

  return {
    violationsCount,
    enterFullscreen,
  };
};
