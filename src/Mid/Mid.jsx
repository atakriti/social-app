import React, { useContext, useState } from "react";
import { BsPlusCircle,BsPencilFill } from "react-icons/bs";
import {BiAddToQueue} from "react-icons/bi"
import videoLion from "../images/video-lion.mp4";
import woman from "../images/woman.mp4";
import logo from "../images/anwar-logo.jpg";
import "./mid.scss";
import CameraComponent from "../Camera/Camera";
import { context } from "../ContextFun";
function Mid() {
  const {findUser,user} = useContext(context)
  console.log("🚀 ~ file: Mid.jsx:12 ~ Mid ~ findUser:", findUser)
  //! Must display video or image
  let [viewStory, setViewStory] = useState(false);
  let [selectedStory,setSelectedStory] = useState()
  const [isStory,setIsStory] = useState(false)
  let handleClickStory = (story) => {
    setSelectedStory(story)
    setViewStory(true)
  } 



  return (
    <div className="mid">
       {isStory && <div className="camera-component">
          <CameraComponent setIsStory={setIsStory} isStory={isStory}/>
        </div>}
      <div className="mid-stories">
        <span onClick={() => setIsStory(true)}>
          <BsPlusCircle />
          <h4>Add Story</h4>
        </span>
       
        {/* Here must be replaced with the friends stories */}
        {findUser?.stories.map((item, i) => (
          <div onClick={()=>handleClickStory(item)} key={i} className="singleStory">
            <a className="photoURL">
              <img  src={user?.photoURL} alt="" />
            </a>
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
        <form action="">
          {/* The name, image here must be replaced */}
          <a><img src={logo} alt="" /></a>
          <input type="text" name="" placeholder="What's new, Anwar?" /> 
          <div className="post-form-btns">
            <label htmlFor="">
              <BiAddToQueue/>
            </label>
            <button><h3>Post</h3> <BsPencilFill/></button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Mid;
