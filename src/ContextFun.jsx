import React,{createContext, useEffect, useState} from 'react'
import {auth,db} from "./firebase"
import {onSnapshot,collection} from "firebase/firestore"
import { onAuthStateChanged } from 'firebase/auth'
export const context = createContext()
function ContextFun({children}) {
    const [user,setUser] = useState()
    let [users, setUsers] = useState()

    let userCollection = collection(db, "users")
    //! This must be done
    // const fetchingUsers = async () => {
    //   await onSnapshot(userCollection,(snapshot) => {
    //     setUsers(snapshot.docs.map(doc => doc.data()))
    //   })
    // }

    useEffect(() => {
      onAuthStateChanged(auth,(current) => setUser(current))
    },[])
  // =================== Values ===============
  const values = {
    user,setUser,users, setUsers
  }
  return (
    <context.Provider value={values} >{children}</context.Provider>
  )
}

export default ContextFun