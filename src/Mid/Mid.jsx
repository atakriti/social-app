import React, { useContext, useState } from "react";
import { BsPlusCircle,BsPencilFill,BsFileEarmarkImageFill,BsFillCameraFill,BsFillPlayCircleFill,BsFillSendFill,BsCheckCircleFill, BsFillTrashFill, BsShareFill, BsSendFill } from "react-icons/bs";
import {BiAddToQueue} from "react-icons/bi"
import {AiFillLike} from "react-icons/ai"
import "./mid.scss";
import { useParams } from "react-router-dom";
import CameraComponent from "../Camera/Camera";
import { context } from "../ContextFun";
import FlipMove from 'react-flip-move';
// ============== firebase =========
import { updateDoc,doc,getDoc } from 'firebase/firestore'
import { db,storage } from '../firebase'
import {ref,uploadBytes,getDownloadURL,deleteObject} from "firebase/storage"

import { v4 } from 'uuid';
import avatar from "../images/avatar.png" 

function Mid() {
  const {findUser,user,users} = useContext(context)


  let [viewStory, setViewStory] = useState(false);
  let [selectedStory,setSelectedStory] = useState()
  const [isStory,setIsStory] = useState(false)
  const [isOpenStory,setIsOpenStory] = useState(false)
  const [uploadDeviceValue,setUploadDeviceValue] = useState(null)
  const [askUpload,setAskUpload] = useState(false)
  // ======== POST
  const [textPostValue,setTextPostValue] = useState("")
  const [filePostValue,setFilePostValue] = useState(null)
  const [commentText,setCommentText] = useState({
    text:"",
    idx:null,
    user:"",
    userId:""
  })

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
              updateDoc(loggedInUser,{posts:[...currentPosts,{text:textPostValue,file:url,likes:0,comments:[],likesBy:[]}]})
              setTextPostValue("")
              setFilePostValue(null)
            })
          })
        }else{
          updateDoc(loggedInUser,{posts:[...currentPosts,{text:textPostValue,file:null,likes:0,comments:[],likesBy:[]}]})
          setTextPostValue("")
        }
       
    } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
    }

  }
  // =========== Delete post ==============
  let handleDeletePost = async (index,file) => {
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getDocument = await getDoc(loggedInUser)
      let currentPosts = await getDocument.get("posts") || []
      let fileRef = ref(storage,file)
      let filterDelete = currentPosts.filter((item,i) => i !== index)
      if(file){
        await deleteObject(fileRef).then(() => {
          updateDoc(loggedInUser,{posts:filterDelete}) 
        })
      }else{
        updateDoc(loggedInUser,{posts:filterDelete}) 
      }
     
      
    } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
    }
  }
  // =================== Comment Post ===========
  let handleChangeComment = (e,index) => {
   setCommentText({...commentText,idx:index})
  setCommentText(prev => index === prev.idx ? {...prev,text:e.target.value} : prev)
  }


  let handleComment = async (e,index) => {
    e.preventDefault()
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getDocument = await getDoc(loggedInUser)
      let currentPosts = await getDocument.get("posts") || []
      let findCurrentPost = currentPosts?.find((item,i) => i === index)
      // let updatedPost = {...findCurrentPost,comments:[...findCurrentPost.comments,commentText]}
      findCurrentPost.comments.push({...commentText,user:findUser?.displayName,userId:findUser?.id}); // Update the comments array directly
        // console.log("🚀 ~ file: Mid.jsx:137 ~ handleComment ~ updatedPost:", updatedPost)
        await updateDoc(loggedInUser, { posts: currentPosts }); // Update the posts field      
      setCommentText({
        text:"",
        index:null,
        user:"",
        userId:""
      })
    } catch (error) {
   alert(error.message.split("/")[1].replace(")", ""))
    }

  }
  // ============= HandleDeleteComment ===========
  let handleDeleteComment = async (i,index) => {
    // index is the index of the post when mapping
    // i is the index of the comment when mapping the comments inside the post
    try {
      let loggedInUser = doc(db,"users",findUser?.id)
        let getDocument = await getDoc(loggedInUser)
        let currentPosts = await getDocument.get("posts") || []
        let findCurrentPost = currentPosts?.find((item,ind) => ind === index)
      
        
        let updated = findCurrentPost?.comments.filter((item,inde) => inde !== i)
          findCurrentPost.comments = updated
        // This ↓ can effect the original one
        await updateDoc(loggedInUser,{posts:currentPosts})
      
    } catch (error) {
   alert(error.message)
      
    }
  }
  // ===================== Like ==================
  let handleLike = async (index) => {
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
        let getDocument = await getDoc(loggedInUser)
        let currentPosts = await getDocument.get("posts") || []
        let findCurrentPost = currentPosts.find((item,i) => i === index)
        if(findCurrentPost.likesBy.some((item) => item === findUser?.id)){
          let newPosts = currentPosts.map((item,indx) => indx === index ? {...item,likes:item.likes - 1, likesBy:item.likesBy.filter((item) => item !== findUser?.id)} : item)
           updateDoc(loggedInUser,{posts:newPosts})
        }else{
          let newPosts = currentPosts.map((item,indx) => indx === index ? {...item,likes:item.likes + 1, likesBy:[...item.likesBy,findUser?.id]} : item)
           updateDoc(loggedInUser,{posts:newPosts})
        }

    } catch (error) {
        alert(error.message)
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
                <label onClick={handleUploadDevice}>
                  <BsFillSendFill className="publish-device-svg"/>
                  <h4>Upload</h4>
                </label>

              ) : (
                <label htmlFor="sto">
                 <BsFileEarmarkImageFill/>
                 <input type="file" name="sto" id="sto" accept=".mp4, .png, .jpg, .webm" onChange={handleChangeFileStory} />
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
    




        {findUser?.stories?.map((item, i) => (
          <div onClick={()=>handleClickStory(item)} key={i} className="singleStory">
            <a className="photoURL">
              <img  src={user?.photoURL === null ? avatar : user?.photoURL} alt="" />
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
        {/* ====================================== View Story ================ */}
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
          <a><img src={user?.photoURL === null ? avatar : user?.photoURL} alt="" /></a>
          <input required type="text" name="textPost" placeholder={`What's new, ${findUser?.displayName} ?`} onChange={(e) => setTextPostValue(e.target.value)} value={textPostValue}  /> 
          <div className="post-form-btns">
            <label htmlFor="filePost">
              {filePostValue !== null ? (
                <BsCheckCircleFill/>
              ) : (
                <BiAddToQueue/>
              )}
              <input type="file" name="filePost" id="filePost" accept=".mp4, .png, .jpg, .webm" onChange={(e) => setFilePostValue(e.target.files[0])} />
            </label>
            <button><h3>Post</h3> <BsPencilFill/></button>
          </div>

        </form>
      </div>
      {/* ================================================ POSTS ========================== */}
      <div className="posts">
        <FlipMove>
      {findUser?.posts?.map((item,index) => (
        <div key={index} className="singlePost">
          <h2><a><img src={user?.photoURL === null ? avatar : user?.photoURL} alt="" /></a>{item.text}</h2>
          {item?.file?.includes("image") &&  (
            <a onClick={()=>handleClickStory(item.file)} ><img src={item.file} alt="" /></a>
          )}
          {item?.file?.includes("video") && (
 <div onClick={()=>handleClickStory(item.file)} className="postVideo">
 <video  muted autoPlay src={item.file} />
 <div className="playVideoPostContainer">

 <BsFillPlayCircleFill className="playVideoPost"/>
 </div>
</div>
          )}
           
          
          <h3>Likes {item.likes}</h3>
          <div className="post-btns">
            <AiFillLike onClick={() => handleLike(index)} style={item.likesBy.some(ite => ite === findUser?.id) && {fill:"#1877F2"}} />
            <BsShareFill/>
            <BsFillTrashFill onClick={() => handleDeletePost(index,item.file)}/>
          </div>
          <form className="commentsForm" onSubmit={(e) => handleComment(e,index)} >
            <input required type="text" name="commentText" placeholder="Type your comment..." value={commentText.idx === index ? commentText.text : ""} onChange={(e) => handleChangeComment(e,index)}/>
            <button><BsSendFill/></button>
          </form>
          {item?.comments?.length > 0 && (
          <ul className="postComments">
              {item?.comments.map((it,i) => (
                <li key={i}>
                  <span><h6><a><img src={user?.photoURL === null ? avatar : user?.photoURL} alt="" /></a>{it.user}</h6>{it?.userId === findUser?.id &&  <BsFillTrashFill onClick={() => handleDeleteComment(i,index)}/>}</span>
                  <h4>{it.text}</h4>
                </li>
              ))}
          </ul>
          )}
         
        </div>
      ))}
      </FlipMove>
      </div>
     
    </div>
  );
}

export default Mid;
