import React, { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import avatar from "../images/avatar.png";
import { AiOutlineSend } from "react-icons/ai";
import {BsTrashFill} from "react-icons/bs"
import {RiArrowGoBackLine} from "react-icons/ri"
import { context } from "../ContextFun";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
function Chat() {
  // =================================
  let dateObj = new Date();
   let month = dateObj.getUTCMonth() + 1; //months from 1-12
   let day = dateObj.getUTCDate();
   let year = dateObj.getUTCFullYear();
   let FullDate = year + "/" + month + "/" + day
   let FullTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds()
 let timeResult = FullDate + "–" + FullTime
  // ============================
  let scrollRef = useRef()
  const { findUser, users } = useContext(context);
  let friends = users?.filter((user) =>
    findUser?.friends?.some((item) => item === user?.id)
  );
  let [inputValue, setInputValue] = useState("");
  let [chatUserId, setChatUserId] = useState(null);
  const [switchUsers,setSwitchUsers] = useState(1)
  let findChatWith = users?.find((user) => user?.id === chatUserId);
  let displayChat = findChatWith?.chat?.filter(item => item?.senderId === findUser?.id)
  let myChat = findUser?.chat?.filter(item => item.senderId === chatUserId)
  let combinedMessages = []
  console.log("🚀 ~ file: Chat.jsx:30 ~ Chat ~ combinedMessages:", combinedMessages)
  if (displayChat && displayChat.length > 0) {
    combinedMessages.push(...displayChat[0].messages);
  }
  if (myChat && myChat.length > 0) {
    combinedMessages.push(...myChat[0].messages);
  }


  const handleSwitchFriend = (friend) => {
    setChatUserId(friend?.id);
    setInputValue("");
    setSwitchUsers(2)
  };
  const handleBack = () => {
    setSwitchUsers(1)
    setInputValue("");
    setChatUserId(null);
  }
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedUser = doc(db, "users", chatUserId);
    try {
      let getDocument = await getDoc(selectedUser);
      let hisChat = (await getDocument.get("chat")) || [];
      let found = hisChat.find(item => item.senderId === findUser.id)
     
      if (!found) {
        // If senderId doesn't exist, create a new object
        const newObject = { senderId: findUser.id, messages: [{from:findUser.id,to:chatUserId,text:inputValue,time:timeResult,id:combinedMessages.length + 1}] };
        hisChat.push(newObject);
    setInputValue("");

      } else {
        // Push the new message to the existing messages array
        found.messages.push({from:findUser.id,to:chatUserId,text:inputValue,time:timeResult,id:combinedMessages.length + 1});
    setInputValue("");

      }
      updateDoc(selectedUser, { chat: hisChat });
    } catch (error) {
      alert(error.message);
    }
  };


  const handleDelete = async () => {
    let selectedUser = doc(db,"users",chatUserId)
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getDocument = await getDoc(selectedUser)
      let getMyDocument = await getDoc(loggedInUser)
      let hisChat = await getDocument.get("chat") || []
      let myChat = await getMyDocument.get("chat") || []
      // get [my] chats in his chat senderId is the findUser.id
      let filterHisChat = hisChat.filter(item => item.senderId !== findUser.id)
      // get [his] chats in my chat senderId is the chatUserId
      let filterMyChat = myChat.filter(item => item.senderId !== chatUserId)


      updateDoc(selectedUser,{chat:filterHisChat})
      updateDoc(loggedInUser,{chat:filterMyChat})
    } catch (error) {
      alert(error.message)
    }
  }


  useEffect(() => {
    // Scroll to the last message when component mounts or combinedMessages changes
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [combinedMessages]);

  return (
    <div className="chat">
      {/* Left  */}
      {switchUsers === 1 && (
 <div className="chat-left">
 {friends?.map((friend, i) => (
   <div
     className="friend_chat"
     key={i}
     onClick={() => handleSwitchFriend(friend)}
   >
     <a>
       <img
         src={friend?.photoURL === null ? avatar : friend?.photoURL}
         alt=""
       />
     </a>
     <h3>{friend?.displayName}</h3>
   </div>
 ))}
</div>
      )}
     
      {/* Messaging */}
      {switchUsers === 2 && (
 <div className="messages">
  <div className="back_btn_container">
  <h5>{users.find(user => user.id === chatUserId).displayName}</h5> 
   <BsTrashFill className="back_btn" style={{backgroundColor:"red"}} onClick={handleDelete} title="Delete all messages" />
   <RiArrowGoBackLine className="back_btn" onClick={handleBack} title="back" />
  </div>
 {chatUserId === null ? (
   <h1>Select a user to chat with</h1>
   ) : (
     <div className="messages_container">
     <div className="messages_texts">
       {combinedMessages?.sort((a, b) => a.id - b.id).map((message,i) => (
        <div className={message.from === findUser.id ? "message" : "message messageOther"}>
          <h4>{message.text}</h4>
          <h6>{message.time}</h6>
        </div>
       ))}
       <div ref={scrollRef}></div>
     </div>
     <form onChange={handleChange} onSubmit={handleSubmit}>
       <input
         type="text"
         name="text"
         value={inputValue}
         placeholder="Write your message..."
       />
       <button>
         <AiOutlineSend />
       </button>
     </form>
   </div>
 )}
</div>
      )}
     
    </div>
  );
}

export default Chat;
