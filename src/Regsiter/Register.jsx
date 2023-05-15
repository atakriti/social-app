import React, { useEffect, useState } from "react";
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
function Register() {
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
  const handleSubmitSignin = (e) => {
    e.preventDefault();
    navigate("/home");
  };
  const handleSubmitSignup = (e) => {
    e.preventDefault();
  };
  // ======================
  const handleGoogle = async () => {
      await signInWithPopup(auth,googleProvider)
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
              placeholder="Enter your Password..."
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
