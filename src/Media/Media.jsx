import React, { useContext, useState } from "react";
import "./media.scss";
import { context } from "../ContextFun";
import { BsFillPlayCircleFill, BsFillTrashFill } from "react-icons/bs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";
function Media() {
  const [switchMedia, setSwitchMedia] = useState(1);
  const { findUser } = useContext(context);
  let [viewStory, setViewStory] = useState(false);
  let [selectedStory, setSelectedStory] = useState();
  let handleClickStory = (story) => {
    setSelectedStory(story);
    setViewStory(true);
  };

  const handleDeletePost = async (file,index) => {
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
      }
     
      
    } catch (error) {
   alert(error.message)
    }
  }

  const handleDeleteStory = async (file,index) => {
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getDocument = await getDoc(loggedInUser)
      let currentPosts = await getDocument.get("stories") || []
      let fileRef = ref(storage,file)
      let filterDelete = currentPosts.filter((item,i) => i !== index)
      if(file){
        await deleteObject(fileRef).then(() => {
          updateDoc(loggedInUser,{stories:filterDelete}) 
        })
      }
     
      
    } catch (error) {
   alert(error.message)
    }
  }

  return (
    <div className="media">
      {viewStory && (
        <div className="viewStory">
          <h6 onClick={() => setViewStory(false)}>X</h6>
          {selectedStory.includes("image") ? (
            <img src={selectedStory} alt="" />
          ) : (
            <video muted autoPlay controls>
              <source src={selectedStory} />
            </video>
          )}
        </div>
      )}
      <div className="media-headers">
        <button onClick={() => setSwitchMedia(1)}>Posts</button>
        <button onClick={() => setSwitchMedia(2)}>Stories</button>
      </div>
      <div className="mediaContainer">
        {switchMedia === 1 &&
          findUser?.posts?.map(
            (item, index) =>
              item.file !== null && (
                <div key={index} className="singleMedia">
                    <h6 onClick={() => handleDeletePost(item.file,index)} className="deleteSingleMedia"><BsFillTrashFill/></h6>

                  {item?.file?.includes("image") && (
                    <a onClick={() => handleClickStory(item.file)}>
                      <img src={item.file} alt="" />
                    </a>
                  )}
                  {item?.file?.includes("video") && (
                    <div
                      onClick={() => handleClickStory(item.file)}
                      className="postVideo"
                    >
                      <video muted autoPlay src={item.file} />
                      <div className="playVideoPostContainer">
                        <BsFillPlayCircleFill className="playVideoPost" />
                      </div>
                    </div>
                  )}
                </div>
              )
          )}
          {/* =================== 2 =============== */}
          {switchMedia === 2 &&
          findUser?.stories?.map(
            (item, index) =>
              
                <div key={index} className="singleMedia">
                    <h6 onClick={() => handleDeleteStory(item,index)} className="deleteSingleMedia"><BsFillTrashFill/></h6>
                  {item?.includes("image") && (
                    <a onClick={() => handleClickStory(item)}>
                      <img src={item} alt="" />
                    </a>
                  )}
                  {item?.includes("video") && (
                    <div
                      onClick={() => handleClickStory(item)}
                      className="postVideo"
                    >
                      <video muted autoPlay src={item} />
                      <div className="playVideoPostContainer">
                        <BsFillPlayCircleFill className="playVideoPost" />
                      </div>
                    </div>
                  )}
                </div>
              
          )}
      </div>
    </div>
  );
}

export default Media;
