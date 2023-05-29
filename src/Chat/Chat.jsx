import React, { useContext, useState } from "react";
import "./chat.scss";
import avatar from "../images/avatar.png";
import { AiOutlineSend } from "react-icons/ai";
import { context } from "../ContextFun";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
function Chat() {
  const { findUser, users } = useContext(context);
  let friends = users?.filter((user) =>
    findUser?.friends?.some((item) => item === user?.id)
  );
  let [inputValue, setInputValue] = useState("");
  let [chatUserId, setChatUserId] = useState(null);
  let findChatWith = users?.find((user) => user?.id === chatUserId);
  
  /* 
     if(ahmad.chat.some(it => it.senderId === findUser.id)){
            let foundUser = ahmad.chat.find(item => item.senderId === findUser.id)
            {...foundUser,messages:[...foundUser.messages,{from:findUser.id,to:chatUserId,text:inputValue}]}
        }else{
            hisChat = "chat"
            [...hisChat,{senderId:findUser.id,messages:[...hisChat.messages,{from:findUser.id,to:chatUserId,text:inputValue}]}]
        }
    let ahmad.chat = {
       anwar:{
            messages:[
                {
                    from:ahmad,
                    to:anwar,
                    text:hello
                },
                {
                    from:anwar,
                    to:ahmad,
                    text:hello back
                }
            ]
        }
    }
    */

  const handleSwitchFriend = (friend) => {
    setChatUserId(friend?.id);
    setInputValue("");
  };
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
        const newObject = { senderId: findUser.id, messages: [{from:findUser.id,to:chatUserId,text:inputValue}] };
        hisChat.push(newObject);
      } else {
        // Push the new message to the existing messages array
        found.messages.push({from:findUser.id,to:chatUserId,text:inputValue});
      }
      updateDoc(selectedUser, { chat: hisChat });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="chat">
      {/* Left  */}
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
      {/* Messaging */}
      <div className="messages">
        {chatUserId === null ? (
          <h1>Select a user to chat with</h1>
        ) : (
          <div className="messages_container">
            <div className="messages_texts">
              <h5>hello</h5>
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
    </div>
  );
}

export default Chat;
