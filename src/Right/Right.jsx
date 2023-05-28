import React, { useContext, useEffect, useState } from 'react'
import "./right.scss"
import { context } from '../ContextFun'
import avatar from "../images/avatar.png";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Right() {
  let {findUser,users} = useContext(context)
  console.log("🚀 ~ file: Right.jsx:10 ~ Right ~ findUser:", findUser)
  let filterd = []
 
  for(let i = 0; i < users?.length; i++){
    let user = users[i]
    for(let j = 0; j < findUser?.friendsRequests?.length; j++){
      let id = findUser?.friendsRequests[j]
      if(id === user?.id){
        filterd.push(user)
       break;
      }
    }
  }


  const handleAccept = async (item) => {
    // He Sent me request if accept !
    // move him to my friends array , and move my self to his friends array
    let loggedInUser = doc(db,"users",findUser?.id)
    let selectedUser = doc(db,"users",item?.id)
    try {
      let getMyDocument = await getDoc(loggedInUser)
      let getHisDocument = await getDoc(selectedUser)
      let myFriendsReqArray = await getMyDocument.get("friendsRequests") || []
      let myFriendsArray = await getMyDocument.get("friends") || []
      let hisFriendsArray = await getHisDocument.get("friends") || []

      let filterd = myFriendsReqArray.filter(it => it !== item?.id)
      if(myFriendsArray.some(ite => ite?.id === item?.id)){
        return;
      }else{
        myFriendsArray.push({...getHisDocument.data(),id:item?.id})
        updateDoc(loggedInUser,{friendsRequests:filterd,friends:myFriendsArray})
      }
      if(hisFriendsArray.some(ite => ite?.id === findUser?.id)){
        return;
      }else{
        hisFriendsArray.push({...getMyDocument.data(),id:findUser?.id})
        updateDoc(selectedUser,{friends:hisFriendsArray})
      }
    } catch (error) {
      alert(error.message)
    }
  }
  
  const handleReject = async (item) => {
    let loggedInUser = doc(db,"users",findUser?.id)
    try {
      let getMyDocument = await getDoc(loggedInUser)
      let myFriendsArray = await getMyDocument.get("friendsRequests") || []
      let filterMine = myFriendsArray.filter(ite => ite !== item?.id)
      updateDoc(loggedInUser,{friendsRequests:filterMine})
     
    } catch (error) {
      alert(error.message)
    }
  }




 

  return (
    <div className='right'>
      {filterd.length === 0 && (
      <h2>No Friends requests</h2>
      )}
      {filterd?.map(item => (
        <div className="singleRequest">
          <a><img src={item?.photoURL === null ? avatar : item?.photoURL} alt="" /></a>
          <h3>{item.displayName}</h3>
          <button onClick={() => handleAccept(item)}>Accept</button>
          <button onClick={() => handleReject(item)} className='rej-btn'>Reject</button>
        </div>
      ))}
      

    </div>
  )
}

export default Right