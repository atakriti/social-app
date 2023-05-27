import React, { useContext, useState } from "react";
import "./people.scss";
import { context } from "../ContextFun";
import avatar from "../images/avatar.png";
import { RiUserAddFill } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
function People() {
  let { users, findUser } = useContext(context);
  const [switchMedia, setSwitchMedia] = useState(1);

  const handleAddFriend = async (item) => {
    let loggedInUser = doc(db, "users", findUser?.id);
    let selectedUser = doc(db, "users", item?.id);
    try {
      let getMyDocument = await getDoc(loggedInUser);
      let getHisDocument = await getDoc(selectedUser);
      // To get the full document say .data()
      // getHisDocument.data()
      let hisFriendsRequests =
        (await getHisDocument.get("friendsRequests")) || [];
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
      <div className="people-headers">
        <button
          style={switchMedia === 1 ? { backgroundColor: "gray" } : {}}
          onClick={() => setSwitchMedia(1)}
        >
          People
        </button>
        <button
          style={switchMedia === 2 ? { backgroundColor: "gray" } : {}}
          onClick={() => setSwitchMedia(2)}
        >
          Friends
        </button>
      </div>
      <div className="people-container">
        {switchMedia === 2 && findUser.friends.length === 0 && (
          <h1>There are no friends yet</h1>
        )}

        {switchMedia === 1 &&
          users?.filter((item) => item.id !== findUser?.id).map((item, i) => (
              <div key={i} className="singlePeople">
                <a>
                  <img
                    src={item?.photoURL === null ? avatar : item?.photoURL}
                    alt=""
                  />
                </a>
                <h4>{item.displayName}</h4>
                {item.friendsRequests.some((it) => it === findUser?.id) ? (
                  <button style={{ backgroundColor: "gray" }}>Pending</button>
                ) : (
                    findUser.friendsRequests.some(it => it === item.id) ? (
                        <div className="btns_">
                            <button className="acc_">Accept</button>
                            <button className="rej-btn_">Reject</button>

                        </div>
                    ) : (
                        <button onClick={() => handleAddFriend(item)}>
                        <RiUserAddFill />
                        Add friend
                      </button>
                    )
                 
                )}
              </div>
            ))}
      </div>
    </div>
  );
}

export default People;
