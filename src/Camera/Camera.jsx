import React, { useContext, useEffect, useRef, useState } from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "./camera.scss"
import {MdOutlineCameraswitch,MdPublish} from "react-icons/md"
import {BsCameraVideoFill,BsCameraVideoOffFill} from "react-icons/bs"
import {IoMdCloseCircle} from "react-icons/io"
import {RiVideoUploadFill,RiUploadCloudFill} from "react-icons/ri"
import { v4 } from 'uuid';
import { context } from '../ContextFun';
// ========================== Firebase ==========================
import { updateDoc,doc,getDoc } from 'firebase/firestore'
import { db,storage } from '../firebase'
import {ref,uploadBytes,listAll, getDownloadURL,deleteObject} from "firebase/storage"

// ======================= Firebase ends =======================
const CameraComponent = ({setIsStory,isStory}) => {
  let {findUser,user,setLoading} = useContext(context)

  const [photoDataUri, setPhotoDataUri] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isStartRec,setIsStartRec] = useState(true)
  const [isStopRec,setIsStopRec] = useState(false)
  const [isPicTaken,setIsPicTaken] = useState(false)
  // ======================================================= Take pictures ==============
  // ================================== Convert base64 ===================
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  // ================================== End Convert base64 ===================

  const handleTakePhoto = (dataUri) => {
    setPhotoDataUri(dataUri);
    
    setIsPicTaken(true)
  };
  // ================================================
  const handlePublishPhoto = async () => {
 // == Firebase ====
 let loggedInUser = doc(db,"users",findUser?.id)
 try {
   let getDocument = await getDoc(loggedInUser)
   let currentStories = await getDocument.get("stories") || []
   
   const uploadimage = ref(storage,`files/${"image" + v4()}`)
  
   // Then upload file to firebase
   const imageBlob = dataURItoBlob(photoDataUri);
   uploadBytes(uploadimage,imageBlob).then((snapshot) => {
     getDownloadURL(snapshot.ref).then((ur) => {
        updateDoc(loggedInUser,{stories:[...currentStories,ur]})
        setIsPicTaken(false)
     })
   })
 } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
 }
 // ================ Firebase Ends ===============
  }


  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setRecordedChunks([])
      setIsStartRec(false)
      setIsStopRec(true)
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
      setIsStartRec(true)
      setIsStopRec(false)
      mediaRecorder.stop();
    }
  };

  const handleDataAvailable = (event) => {
    
    if (event.data.size > 0) {
      setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
    }
  };
  const handleDownload = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'recorded-video.webm';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // ================ Firebase ===============
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getDocument = await getDoc(loggedInUser)
      let currentStories = await getDocument.get("stories") || []
      
      const uploadVideo = ref(storage,`files/${"video" + v4()}`)
      // Then upload file to firebase
      uploadBytes(uploadVideo,blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((ur) => {
           updateDoc(loggedInUser,{stories:[...currentStories,ur]})
           setRecordedChunks([])
        })
      })
    } catch (error) {
      alert(error.message.split("/")[1].replace(")", ""))
    }
    // ================ Firebase Ends ===============


  };
  const [facingMode, setFacingMode] = useState(FACING_MODES.ENVIRONMENT);
  const toggleFacingMode = () => {
    setFacingMode(prevFacingMode => {
      return prevFacingMode === FACING_MODES.USER ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER;
    });
  };
  

  const handleClose = () => {
    setIsStory(false)
    mediaStream?.getTracks().forEach(track => track.stop());
    setPhotoDataUri(null);
  }

 //! This another way to close the camera with stopping the camera functionality 
  useEffect(() => {
    if (!isStory && mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setPhotoDataUri(null);
    }
  }, [isStory, mediaStream]);
  return (
    <div className='camera'>
      <Camera
        onTakePhoto={handleTakePhoto}
        idealFacingMode={facingMode}
      />
      <div className="camera-btns">
        {isStartRec &&  (
      <button title='Switch Camera' onClick={toggleFacingMode}><MdOutlineCameraswitch/></button>
        )}
      {isStartRec && (
      <button title='Start recording' onClick={startRecording} ><BsCameraVideoFill/></button>
      )}
      {isStopRec && (
      <button className='stop-rec' title='Stop recording' onClick={stopRecording}><BsCameraVideoOffFill/></button>
      )}
      {recordedChunks.length > 0 && (
        <button className='publish-rec' title='Add to story' onClick={handleDownload}><RiVideoUploadFill/></button>
      )}
      {isPicTaken && (
        <button onClick={handlePublishPhoto} className='pic-taken'><RiUploadCloudFill/></button>

      )}
      {!isStopRec && (
      <button onClick={handleClose}><IoMdCloseCircle/></button>
      )}
      </div>
     
    
    </div>
  );
};

export default CameraComponent;


