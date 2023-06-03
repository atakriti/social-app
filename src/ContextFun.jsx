import React,{createContext, useEffect, useState} from 'react'
import {auth,db} from "./firebase"
import {onSnapshot,collection} from "firebase/firestore"
import { onAuthStateChanged } from 'firebase/auth'
export const context = createContext()
function ContextFun({children}) {
  // Here user will get u the full object from the auth from firebase, no matter if google or normal auth
    const [user,setUser] = useState()
    let [users, setUsers] = useState()
    let findUser = users?.find(item => item?.email === user?.email)

    let userCollection = collection(db, "users")
    const fetchingUsers = async () => {
      await onSnapshot(userCollection,(snapshot) => {
        // Here iam getting the docs of the users 
        setUsers(snapshot.docs.map(doc => ({...doc.data(),id:doc.id})))
      })
    }
    let [isLoading,setIsLoading] = useState(false)
    useEffect(() => {
      onAuthStateChanged(auth,(current) => setUser(current))
      fetchingUsers()
    },[])
  // =================== Values ===============
  const values = {
    user,setUser,users, setUsers,findUser,isLoading,setIsLoading
  }
  return (
    <context.Provider value={values} >{children}</context.Provider>
  )
}

export default ContextFun