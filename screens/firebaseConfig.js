// Import the functions you need from the SDKs you need
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore, getFirestore, query, getDocs, collection, where, addDoc, updateDoc, doc, setDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const firebaseConfig = {
  apiKey: "AIzaSyA8ZJm14M-fkWqBV0Mfvm3PunLBut3s2Dg",
  authDomain: "forepay-v1-f51b9.firebaseapp.com",
  projectId: "forepay-v1-f51b9",
  storageBucket: "forepay-v1-f51b9.appspot.com",
  messagingSenderId: "875596397590",
  appId: "1:875596397590:web:e50ee04cd7837c68458937",
  measurementId: "G-6D8YHYNRB2"
};

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }
export const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.languageCode = 'it';
export const db = getFirestore(app);
const analytics = getAnalytics();

// const [phoneNumber, setPhoneNumber] = useState("");

export const checkIfPhoneExists = async (phone) => {
  try {
    const uid = auth.currentUser.uid
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = await getDocs(q)
    return (docs.docs.length == 1);
  } catch (error) {
    console.log('cannot check if user exists');
  }
};

export const fetchUsername = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    return data.username;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const fetchRealName = async () => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    console.log(data.realName, "real");
    return data.realName;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const fetchIDByUsername = async (uname) => {
  try {
    const q = query(collection(db, "usernames"), where("username", "==", uname));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    return data.uid;
  } catch (err) {
    console.error(err);
    alert(err.message, "fetchIDByUsername");
  }
};

export const fetchUsersInChat = async (threadID) => {
  try {
    const q = query(collection(db, "threads"), where("tid", "==", threadID));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    return data.usernames;
  } catch (err) {
    console.error(err);
    alert(err.message, "fetchIDByUsername");
  }
};

export const fetchPayment = async (pid) => {
  try {
    const q = query(collection(db, "payments"), where("pid", "==", pid));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    return data;
  } catch (err) {
    console.error(err, "fetchpayment");
    alert(err.message, "fetchPayment");
  }
};

export const fetchPaymentsInChat = async (threadID) => {
  try {
    const q = query(collection(db, "threads"), where("tid", "==", threadID));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    return data.payments;
  } catch (err) {
    console.error(err);
    alert(err.message, "fetchPaymentsInChat");
  }
};

export const fetchThreadName = async (tid) => {
  try {
    const q = firebase.firestore().collection("threads").where("tid", '==', tid);
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    return data.threadName; 
  } catch (err) {
    console.error(err, "whats going on?");
    //alert(err.message);
  }
};

export const fetchLastMessage = async (id) => {
  try {
    const q = query(collection(db, "threads"), where("tid", "==", id));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    if (data.messages.length == 0) {
      return "No Messages";
    } else {
      return data.messages[data.messages.length - 1].text;
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const fetchLastMessageTime = async (id) => {
  try {
    const q = query(collection(db, "threads"), where("tid", "==", id));
    const docs = await getDocs(q);
    const data = docs.docs[0].data();
    if (data.messages.length == 0) {
      return "";
    } else {
      return data.messages[data.messages.length - 1].createdAt;
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const updateRealName = async (realName) => {
  try {
    await updateDoc(doc(db, "users", auth.currentUser.uid),
    {
      realName: realName
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const setUsernameInfo = async (username) => {
  try {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      "username": username
    }, {merge: true}
    );
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
  try {
    await setDoc(doc(db, "usernames", username),
    {
      uid: auth.currentUser.uid,
      username: username
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const usernameIsTaken = async (username) => {
  try {
    const q = query(collection(db, "usernames"), where("username", "==", username));
    const docs = await getDocs(q)
    return (docs.docs.length == 1);
  } catch (error) {
    console.log('cannot check if user exists');
    alert(error.message, "usernameIsTaken");
  }
};

export const createAccountIfNotUser = async (phone) => {
  try {
    const uid = auth.currentUser.uid
    const q = query(collection(db, "users"), where("uid", "==", uid));
    // setPhoneNumber(phone);
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users", uid),
      {
        uid: uid,
        phoneNumber: phone,
        username: 'John',
        realName: 'John Doe',
        friends: [],
        threads: [],
        payments: [],
        usersOwed: {}
      });
    }

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const createNewThread = async (threadName) => {
  try {
    fetchUsername().then((uname) => {
      addDoc(collection(db, "threads"), {
        threadName: threadName,
        usernames: [uname],
        payments: [],
        messages: []
      }).then((res) => {
        updateDoc(doc(db, "users", auth.currentUser.uid), { //what is the result of addDoc? and how to convert it to string
          "threads": arrayUnion(res.id)
        });
        updateDoc(doc(db, "threads", res.id), {
          "tid": res.id
        });
      });
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const deleteThread = async (threadID) => {
  try {
    fetchPaymentsInChat(threadID).then((payments) => {
      if (payments.length != 0) {
        alert("there are this payments in this chat!");
      } else {
        updateDoc(doc(db, "users", auth.currentUser.uid), { 
          "threads": arrayRemove(threadID)
        });
      }
    })
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const orderThreadsByTime = async (threads) => {
  try {
    console.log('orderThreadsByTime started');
    const fetchedThreads = await Promise.all(
      threads.map(async (thread) => {
        try {
          console.log('Before query:', thread);
          const messagesSnapshot = await getDocs(
            query(
              collection(db, `threads/${thread}/messages`),
              orderBy('createdAt', 'desc'),
              limit(1)
            )
          ).catch((error) => {
              console.error('Error fetching messages for thread:', thread, error);
            }).finally(() => {
              console.log('Finally block executed for thread:', thread);
            });

          console.log('Fetched thread after query:', thread);
          console.log("messagesSnapshot for thread:", thread, messagesSnapshot);
          console.log('messagesSnapshot size for thread:', thread, messagesSnapshot.size);
          console.log('messagesSnapshot docs for thread:', thread, messagesSnapshot.docs);
          
          if (!messagesSnapshot) {
            return null;
          }

          const latestMessage =
            messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data() : null;

          console.log('Latest message for thread:', thread, latestMessage);

          return {
            threadID: thread,
            latestMessageCreatedAt: latestMessage ? new Date(latestMessage.createdAt) : new Date(0),
          };
        } catch (error) {
          console.error('Error in threads.map for thread:', thread, error);
          return null;
        }
      }),
    );

    const sortedThreads = fetchedThreads
      .filter((threadData) => threadData !== null)
      .sort((a, b) => b.latestMessageCreatedAt - a.latestMessageCreatedAt);

    console.log('Sorted threads:', sortedThreads);
    return sortedThreads;
  } catch (error) {
    console.error('Error in orderThreadsByTime:', error);
    return [];
  }
};


export const listenToThreads = async () => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid));
    const userDoc = await getDocs(q);
    const userData = userDoc.docs[0].data();
    const threads = userData.threads;

    const sortedThreadsData = await orderThreadsByTime(threads);

    const sortedThreads = sortedThreadsData.map((threadData) => threadData.threadID);

    return sortedThreads;
  } catch (error) {
    console.error('Error in listenToThreads:', error);
    return [];
  }
};

export const listenToMessages = (threadID) => {
  return doc(db, "threads", threadID);
};


export const createMessage = async (thread, message, u, isPayment = false, listUsers = [], countUsers = 0, selectedPayer = "") => {
  try {
    if (isPayment) {
      updateDoc(doc(db, "threads", thread), {
        "messages": arrayUnion({
          _id: u.name,
          text: "!<>?" + message,
          createdAt: new Date().getTime(),
          user: {
            _id: u.name,
            name: u.name
          },
          isPayment: isPayment
        })
      });
    } else {
      updateDoc(doc(db, "threads", thread), {
        "messages": arrayUnion({
          _id: u.name,
          text: message,
          createdAt: new Date().getTime(),
          user: {
            _id: u.name,
            name: u.name
          },
          isPayment: isPayment
        })
      });
    }
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const createPayment = async (thread, description, value, users, countUsers, payerUsername) => {
  try {
    console.log('what');
    fetchIDByUsername(payerUsername).then((id) => {
      console.log('what2');
      const index = users.indexOf(payerUsername);
      if (index > -1) { // only splice array when item is found
        value *= ((countUsers - 1) / countUsers);
        users.splice(index, 1); // 2nd parameter means remove one item only
        countUsers = countUsers - 1;
      }
      console.log('what3');
      if (users.length > 1) {
        value /= countUsers;
      }

      addDoc(collection(db, "payments"), {
        threadID: thread,
        description: description,
        value: value,
        users: users,
        sender: payerUsername,
        countUsers: countUsers
      }).then((res) => 
        {
        updateDoc(doc(db, "threads", thread), { //what is the result of addDoc? and how to convert it to string
          "payments": arrayUnion(res.id)
        });
        updateDoc(doc(db, "payments", res.id), {
          "pid": res.id
        });
      });
    })
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const settlePayment = async (pidsAndTheirUsers, threadID) => {
  try {
    console.log(pidsAndTheirUsers, threadID, "pids");
    pidsAndTheirUsers.forEach((tup) => {
      console.log("test tup", tup[0], tup[1]); //tup[0] is the pid, tup[1] is the user that is being affected
      fetchPayment(tup[0]).then((payment) => {
        console.log(payment);
        if (payment.users.length == 1) {
          deleteDoc(doc(db, "payments", tup[0]));
          updateDoc(doc(db, "threads", threadID), { 
            "payments": arrayRemove(tup[0])
          });
        } else {
          fetchUsername().then((u) => {
            if (payment.users.includes(u)) {
              updateDoc(doc(db, "payments", tup[0]), { 
                "users": arrayRemove(u)
              });
            } else {
              updateDoc(doc(db, "payments", tup[0]), { 
                "users": arrayRemove(tup[1])
              });
            }
          });
        }
      });
    });
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const addUserToThread = async (uname, threadID) => {
  try {
    
    fetchIDByUsername(uname).then((uid) => {
      updateDoc(doc(db, "users", uid), {
        threads: arrayUnion(threadID)
      });
      updateDoc(doc(db, "threads", threadID), {
        usernames: arrayUnion(uname),
        user: arrayUnion(uid)      
      });
    })
  } catch (err) {
    console.error(err);
    alert(err.message, "addUserToThread");
  }
};

export const markThreadLastRead = threadId => {
  const user = currentUser();

  return firestore()
    .collection('USER_THREAD_TRACK')
    .doc(user.uid)
    .set(
      {
        [threadId]: new Date().getTime(),
      },
      {merge: true},
    );
};

export const listenToThreadTracking = () => {
  const user = currentUser();
  return firestore().collection('USER_THREAD_TRACK').doc(user.uid);
};