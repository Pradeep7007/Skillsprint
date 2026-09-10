import React, { useState } from 'react';
import Webcam from 'react-webcam';

const CameraPreview = ({ onCameraError }) => {
  const [hasError, setHasError] = useState(false);

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: 'user',
  };

  const handleUserMediaError = (error) => {
    console.error('Camera permission denied or not found:', error);
    setHasError(true);
    if (onCameraError) {
      onCameraError('Camera Disabled', 'Webcam permission denied or device unplugged');
    }
  };

  // The webcam is rendered invisibly (0x0 size and opacity 0) in the DOM.
  // This ensures proctoring permissions are validated, and block triggers are captured,
  // but NO live camera video feed is shown on the UI to the user.
  return (
    <div style={{ width: 0, height: 0, opacity: 0, overflow: 'hidden', position: 'absolute', pointerEvents: 'none' }}>
      {!hasError && (
        <Webcam
          audio={false}
          height={1}
          width={1}
          screenshotFormat="image/webp"
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
        />
      )}
    </div>
  );
};

export default CameraPreview;
