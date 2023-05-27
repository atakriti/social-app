import React, { useContext } from "react";
import "./people.scss";
import { context } from "../ContextFun";
import avatar from "../images/avatar.png";
import { RiUserAddFill } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
function People() {
  let { users, findUser } = useContext(context);
  const handleAddFriend = async (item) => {
    let loggedInUser = doc(db, "users", findUser?.id);
    let selectedUser = doc(db, "users", item?.id);
    try {
      let getMyDocument = await getDoc(loggedInUser);
      let getHisDocument = await getDoc(selectedUser);
      // To get the full document say .data()
      // getHisDocument.data()
      let hisFriendsRequests =(await getHisDocument.get("friendsRequests")) || [];
      if (hisFriendsRequests.some((it) => it === findUser?.id)) {
        return;
      } else {
        // pushed my id to him
        hisFriendsRequests.push(findUser?.id);
        updateDoc(selectedUser, { friendsRequests: hisFriendsRequests });
      }
     
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="people">
      <div className="people-container">
        {users?.filter(item => item.id !== findUser?.id).map((item, i) => (
          <div key={i} className="singlePeople">
            <a>
              <img
                src={item?.photoURL === null ? avatar : item?.photoURL}
                alt=""
              />
            </a>
            <h4>{item.displayName}</h4>
            {item.friendsRequests.some((it) => it === findUser?.id) ? (
              <button style={{backgroundColor:"gray"}}>Pending</button>
            ) : (
              <button onClick={() => handleAddFriend(item)}>
                <RiUserAddFill />
                Add friend
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
