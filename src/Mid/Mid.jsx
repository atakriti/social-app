import React, { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import videoLion from "../images/video-lion.mp4";
import woman from "../images/woman.mp4";
import logo from "../images/anwar-logo.jpg";
import "./mid.scss";
function Mid() {
  //! Must display video or image
  let [viewStory, setViewStory] = useState(false);
  let [selectedStory,setSelectedStory] = useState()
  let stories = [
    {
      displayName: "anwar",
      photoURL: logo,
      video: videoLion,
    },
    {
      displayName: "maha",
      photoURL: logo,
      video: woman,
    },
    {
      displayName: "anwar",
      photoURL: logo,
      video: videoLion,
    },
    {
      displayName: "maha",
      photoURL: logo,
      video: woman,
    },
    {
      displayName: "anwar",
      photoURL: logo,
      video: videoLion,
    },
    {
      displayName: "maha",
      photoURL: logo,
      video: woman,
    },
    {
      displayName: "anwar",
      photoURL: logo,
      video: videoLion,
    },
  ];
  let handleClickStory = (story) => {
    setSelectedStory(story)
    setViewStory(true)
  } 

  return (
    <div className="mid">
      <div className="mid-stories">
        <span>
          <BsPlusCircle />
          <h4>Add Story</h4>
        </span>
        {stories.map((item, i) => (
          <div onClick={()=>handleClickStory(item)} key={i} className="singleStory">
            <a className="photoURL">
              <img src={item.photoURL} alt="" />
            </a>
            <h3>{item.displayName}</h3>
            <video muted autoPlay>
              <source src={item.video} />
            </video>
          </div>
        ))}
        {viewStory && <div className="viewStory">
            <h6 onClick={() =>setViewStory(false)}>X</h6>
        <video muted autoPlay controls>
              <source src={selectedStory.video} />
            </video>
          </div>}
      </div>
      {/* ====================================== */}
    </div>
  );
}

export default Mid;
