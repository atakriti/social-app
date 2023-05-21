import React, { useContext, useState } from "react";
import { BsPlusCircle,BsPencilFill,BsFileEarmarkImageFill,BsFillCameraFill,BsFillPlayCircleFill,BsFillSendFill } from "react-icons/bs";
import {BiAddToQueue} from "react-icons/bi"
import videoLion from "../images/video-lion.mp4";
import woman from "../images/woman.mp4";
import logo from "../images/anwar-logo.jpg";
import "./mid.scss";
import CameraComponent from "../Camera/Camera";
import { context } from "../ContextFun";
// ============== firebase =========
import { updateDoc,doc,getDoc } from 'firebase/firestore'
import { db,storage } from '../firebase'
import {ref,uploadBytes,listAll, getDownloadURL,deleteObject} from "firebase/storage"

import { v4 } from 'uuid';

function Mid() {
  const {findUser,user} = useContext(context)
  let [viewStory, setViewStory] = useState(false);
  let [selectedStory,setSelectedStory] = useState()
  const [isStory,setIsStory] = useState(false)
  const [isOpenStory,setIsOpenStory] = useState(false)
  const [uploadDeviceValue,setUploadDeviceValue] = useState(null)
  const [askUpload,setAskUpload] = useState(false)
  // ======== POST
  const [textPostValue,setTextPostValue] = useState("")
  const [filePostValue,setFilePostValue] = useState(null)

  let handleClickStory = (story) => {
    setSelectedStory(story)
    setViewStory(true)
  } 

  let handleUploadDevice = async (e) => {
    e.preventDefault()
    let loggedInUser = doc(db,"users",findUser?.id)
    try { 
      let getDocument = await getDoc(loggedInUser)
      let currentStories = await getDocument.get("stories") || []
      let uploadFile = ref(storage,`files/${uploadDeviceValue?.type?.split("/")[0]+ v4()}`)
      uploadBytes(uploadFile,uploadDeviceValue).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateDoc(loggedInUser,{stories:[...currentStories,url]})
          setIsOpenStory(false)
    setAskUpload(false)
    setUploadDeviceValue(null)

        })
      })
      
    } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
      
    }

  }

  let handleChangeFileStory = (e) => {
    setUploadDeviceValue(e.target.files[0])
    setAskUpload(true)
  }
  let handleCloseOpenedStory = () => {
    setIsOpenStory(false)
    setIsOpenStory(false)
    setAskUpload(false)
    setUploadDeviceValue(null)
  }

  // =================== post
  let handleSubmitPost = async (e) => {
    e.preventDefault()
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
        let getDocument = await getDoc(loggedInUser)
        let currentPosts = await getDocument.get("posts") || []
        let uploadFile = ref(storage,`files/${filePostValue?.type?.split("/")[0] + v4()}`)
        // Here in this condition iam asking if i want to post only text, in order to not post undefined file, set it to null
        if(filePostValue !== null ){
          uploadBytes(uploadFile,filePostValue).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(url => {
              updateDoc(loggedInUser,{posts:[...currentPosts,{text:textPostValue,file:url}]})
              setTextPostValue("")
              setFilePostValue(null)
            })
          })
        }else{
          updateDoc(loggedInUser,{posts:[...currentPosts,{text:textPostValue,file:null}]})
          setTextPostValue("")
        }
       
    } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
    }

  }


  return (
    <div className="mid">
      {isOpenStory && (
        <div className="openStory">
         <div className="openStoryBigContainer">
           <div className="openStoryContainer">
             <div onClick={() => setIsStory(true)} className="camera-svg">
               <BsFillCameraFill/>
               <h4>Camera</h4>
             </div>
             {/* ============= Upload file ========== */} 
             <form className="upload-device" action="" onSubmit={handleUploadDevice}>
              {askUpload ? (
                <label>
                  <BsFillSendFill className="publish-device-svg"/>
                  <h4>Upload</h4>
                </label>

              ) : (
                <label htmlFor="sto">
                 <BsFileEarmarkImageFill/>
                 <input type="file" name="sto" id="sto" onChange={handleChangeFileStory} />
                 <h4>Device</h4>
               </label>
              )}
               
             </form>
           </div>
           <h6 onClick={handleCloseOpenedStory} className="closeOpenStory">X</h6>
         </div>
        </div>
      )}



       {isStory && <div className="camera-component">
          <CameraComponent setIsStory={setIsStory} isStory={isStory}/>
        </div>}
      <div className="mid-stories">
        <span onClick={() => setIsOpenStory(true)}>
          <BsPlusCircle />
          <h4>Add Story</h4>
        </span>
       
        {/* Here must be replaced with the friends stories */}
        {findUser?.stories.map((item, i) => (
          <div onClick={()=>handleClickStory(item)} key={i} className="singleStory">
            <a className="photoURL">
              <img  src={user?.photoURL} alt="" />
            </a>
            {item.includes("video") && (
            <BsFillPlayCircleFill className="play-btn"/>
            )}
            <h3>{findUser.displayName}</h3>
            <video muted autoPlay loop >
              <source src={item} />
            </video>
            {item.includes("image") && (

            <img className="image-story" src={item} alt="" />
            )}
          </div>
        ))}
        
        {viewStory && <div className="viewStory">
            <h6 onClick={() =>setViewStory(false)}>X</h6>
            {selectedStory.includes("image") ? (
              <img src={selectedStory} alt="" />
            ):(
              <video muted autoPlay controls>
              <source src={selectedStory} />
            </video>
            )}
      
          </div>}
      </div>
      {/* ====================================== Form ====================== */}
      <div className="post-form">
        <form onSubmit={handleSubmitPost}>
          {/* The name, image here must be replaced */}
          <a><img src={user?.photoURL} alt="" /></a>
          <input required type="text" name="textPost" placeholder={`What's new, ${findUser?.displayName} ?`} onChange={(e) => setTextPostValue(e.target.value)} value={textPostValue}  /> 
          <div className="post-form-btns">
            <label htmlFor="filePost">
              <BiAddToQueue/>
              <input type="file" name="filePost" id="filePost" onChange={(e) => setFilePostValue(e.target.files[0])} />
            </label>
            <button><h3>Post</h3> <BsPencilFill/></button>
          </div>

        </form>
      </div>
      {/* ================================================ POSTS ========================== */}
    </div>
  );
}

export default Mid;
