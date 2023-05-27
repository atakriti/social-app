import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";
import { FcGoogle } from "react-icons/fc";
import image from "../images/register.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
// ======================== firebase
import { auth, googleProvider,db } from "../firebase"
import {addDoc,collection} from "firebase/firestore"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,signInWithPopup,updateProfile,onAuthStateChanged} from "firebase/auth"
import { context } from "../ContextFun";
function Register() {
  const {users} = useContext(context)
  let userCollection = collection(db,"users")
  const navigate = useNavigate();
  const [switchForms, setSwitchForms] = useState(1);
  const [siValue, setSiValue] = useState({
    siEmail: "",
    siPassword: "",
  });
  const [suValue, setSuValue] = useState({
    displayName: "",
    suEmail: "",
    suPassword: "",
  });
  const handleSubmitSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth,siValue.siEmail,siValue.siPassword).then(() => navigate("/home"))
      setSiValue({
        siEmail: "",
        siPassword: "",
      })
      
    } catch (error) {
      alert(error.message.split("/")[1].replace(")", ""))
    }
  };
  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    try {
      const {user} = await createUserWithEmailAndPassword(auth,suValue.suEmail,suValue.suPassword)
      await updateProfile(user,{displayName:suValue.displayName})
      await addDoc(userCollection,{
        email:suValue.suEmail,
        displayName:suValue.displayName,
        friends:[],
        chat:[],
        posts:[],
        stories:[],
        friendsRequests:[],
        photoURL:user.photoURL
      }).then(() => navigate("/home") )
      setSuValue({
        displayName: "",
        suEmail: "",
        suPassword: "",
      })
        
    } catch (error) {
      alert(error.message.split("/")[1].replace(")", ""))
    }
  };
  // ======================
  const handleGoogle = async () => {
    try {
      const {user} = await signInWithPopup(auth,googleProvider)
      if(users?.some(item => item?.email === user?.email)){
        navigate("/home")
      }else{
        await addDoc(userCollection,{
          email:user.email,
          displayName:user.displayName,
          friends:[],
          chat:[],
          posts:[],
          stories:[],
          friendsRequests:[],
          photoURL:user.photoURL
        }).then(() => navigate("/home") )
        
        
      }
    } catch (error) {
      alert(error.message.split("/")[1].replace(")", ""))
    }
  }
  // ========================= UserEffect ===============
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);
  return (
    <div className="register">
      <div className="register-container">
        {switchForms === 1 && (
          <form
            data-aos="flip-left"
            className="re-left"
            onChange={(e) =>
              setSiValue({ ...siValue, [e.target.name]: e.target.value })
            }
            onSubmit={handleSubmitSignin}
          >
            <h1>Sign in</h1>
            <input
              type="email"
              name="siEmail"
              placeholder="Enter your E-Mail..."
              value={siValue.siEmail}
            />
            <input
              type="password"
              name="siPassword"
              placeholder="Enter your Password..."
              value={siValue.siPassword}
            />
            <button>Sign in</button>
            <h2>OR</h2>
            <span onClick={handleGoogle} className="google-btn">
              <FcGoogle />
              <h4>With Google</h4>
            </span>
            <h5 onClick={() => setSwitchForms(2)}>Don't have an account?</h5>
          </form>
        )}
        {switchForms === 2 && (
          <form
            data-aos="flip-right"
            className="re-left"
            onChange={(e) =>
              setSuValue({ ...suValue, [e.target.name]: e.target.value })
            }
            onSubmit={handleSubmitSignup}
          >
            <h1>Sign up</h1>
            <input
              type="text"
              name="displayName"
              placeholder="Enter you Name..."
              value={suValue.displayName}
            />
            <input
              type="email"
              name="suEmail"
              placeholder="Enter your E-Mail..."
              value={suValue.suEmail}
            />
            <input
              type="password"
              name="suPassword"
              placeholder="Enter your Password...(Min-8 characters)"
              value={suValue.suPassword}
            />
            <button>Sign up</button>
            <h2>OR</h2>

            <span onClick={handleGoogle} className="google-btn">
              <FcGoogle />
              <h4>With Google</h4>
            </span>
            <h5 onClick={() => setSwitchForms(1)}>Have already an account?</h5>
          </form>
        )}

        <div className="re-right">
          <a>
            <img src={image} alt="" />
          </a>
        </div>
      </div>
      <a
        target="_blank"
        href="https://anwar-dev.com"
        title="visit my website"
        className="madeBy"
      >
        Made by Anwar Takriti
      </a>
    </div>
  );
}

export default Register;
