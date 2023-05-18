import React, { useRef, useState } from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


const App = () => {
  const [photoDataUri, setPhotoDataUri] = useState(null);
  const handleTakePhoto = (dataUri) => {
    setPhotoDataUri(dataUri);
  };
// =========================


  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState(null);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const videoConstraints = {
        video: {
          facingMode: facingMode,
        },
        audio: true,
      };

      navigator.mediaDevices
        .getUserMedia(videoConstraints)
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          recorder.ondataavailable = handleDataAvailable;
          recorder.start();
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    } else {
      console.error('getUserMedia is not supported');
    }
  };


  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const handleDataAvailable = (event) => {
    
    if (event.data.size > 0) {
      setRecordedChunks(event.data);
    }
  };

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded-video.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const [facingMode, setFacingMode] = useState(FACING_MODES.ENVIRONMENT);
  const toggleFacingMode = () => {
    setFacingMode(prevFacingMode => {
      return prevFacingMode === FACING_MODES.USER ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER;
    });
  };
  


  return (
    <div>
      <Camera
        onTakePhoto={handleTakePhoto}
        idealFacingMode={facingMode}
      />
      <button onClick={toggleFacingMode}>Switch Camera</button>

      {photoDataUri && <img src={photoDataUri} alt="Captured Photo" />}
      <button onClick={startRecording} >Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {recordedChunks !== null && (
        <button onClick={handleDownload}>Download</button>
      )}
    </div>
  );
};

export default App;


