import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import { error, success } from "./responseWrapper";
import store from "../redux/store";
import { setMyProfile } from "../redux/slices/appConfigSlice";
import {
  addAPost,
  setAllPosts,
  setCurrentComments,
  setLikeForPost,
} from "../redux/slices/postsSlice";
import {
  setAllUserPosts,
  setUserProfile,
} from "../redux/slices/userProfileSlice";
import {
  setAllMessages,
  setAllUsers,
  setChatId,
} from "../redux/slices/chatSlice";
import { setAllNotifications } from "../redux/slices/notificationSlice";

export const signupWithEmailAndPassword = async (info) => {
  try {
    const { name, email, phone, password } = info;

    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res.user);
    const docRef = doc(db, "users", res.user.uid);
    const data = {
      name,
      email,
      phone,
      photoUrl: null,
      followers: [],
      followings: [],
      notificationIndexCount: 0,
      createdAt: Date.now().toString(),
    };

    const result = await setDoc(docRef, data);

    return success(result);
  } catch (e) {
    return error(e.message);
  }
};

export const getMyDoc = async (id) => {
  const mydoc = doc(db, "users", id);
  const docSnap = await getDoc(mydoc);
  const user = { ...docSnap.data(), id: docSnap.id };
  console.log(user);
  store.dispatch(setMyProfile(user));
  // return success(user);
};

export const createPost = async (title, file, user) => {
  if (!title) {
    alert("plz write a title for post");
    return;
  }

  if (!file) {
    alert("plz choose a post");
    return;
  }

  let fileType;
  if (file.type.includes("image")) {
    fileType = "image";
  } else if (file.type.includes("video")) {
    fileType = "video";
  } else {
    alert("You can only choose img or video files for posts");
    return;
  }

  const postName = `${user.id}-${Date.now()}`;

  const postRef = ref(storage, `images/${postName}`);

  const res = await uploadBytes(postRef, file);

  const url = await getDownloadURL(postRef);

  console.log(url);

  const postCollectionRef = collection(db, "posts");

  const result = await addDoc(postCollectionRef, {
    title,
    ownerId: user.id,
    createdAt: Date.now().toString(),
    likes: [],
    postType: fileType,
    postImgName: postName,
    postUrl: url,
    commentCount: 0,
  });

  // console.log(result.id);

  // const userDoc = doc(db, 'users', user.id);
  // const newFields = { posts: [...user.posts, result.id] };
  // await updateDoc(userDoc, newFields);

  // getMyDoc(user.id);

  const postDoc = doc(db, "posts", result.id);
  const docSnap = await getDoc(postDoc);
  const post = { ...docSnap.data(), id: docSnap.id };

  store.dispatch(addAPost(post));

  alert("post created");
};

export const getAllPosts = async () => {
  const postCollectionRef = collection(db, "posts");
  const data = await getDocs(postCollectionRef);
  store.dispatch(
    setAllPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  );
};

export const getAParticularUser = async (id, setUser) => {
  const userDoc = doc(db, "users", id);
  const docSnap = await getDoc(userDoc);
  const user = { ...docSnap.data(), id: docSnap.id };
  setUser(user);
};

export const postLikeUnlike = async (postId, currUserId, currUser) => {
  try {
    const postDoc = doc(db, "posts", postId);
    const docSnap = await getDoc(postDoc);
    const post = { ...docSnap.data(), id: docSnap.id };

    if (post.likes.includes(currUserId)) {
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currUserId);
      const res = await addNotification(
        currUserId,
        post.ownerId,
        "Liked your post",
        post.title,
        post.postUrl,
        currUser?.photoUrl,
        currUser?.name
      );
      if (res.status == "error") {
        alert(res.message);
      } else {
        alert(res.result);
      }
    }

    const newFields = { likes: [...post.likes] };

    await updateDoc(postDoc, newFields);
  } catch (e) {
    console.log(e);
    alert("Post not found");
  }
};

export const userFollowUnFollow = async (id, currUserId) => {
  const userToFollowDoc = doc(db, "users", id);
  const userdocSnap = await getDoc(userToFollowDoc);
  const userToFollow = { ...userdocSnap.data(), id: userdocSnap.id };

  const currUserDoc = doc(db, "users", currUserId);
  const docSnap = await getDoc(currUserDoc);
  const currUser = { ...docSnap.data(), id: docSnap.id };

  // console.log('userToFollow', userToFollow);
  // console.log('currUser', currUser);

  if (currUser.followings.includes(id)) {
    const followingIndex = currUser.followings.indexOf(id);
    currUser.followings.splice(followingIndex, 1);

    const followerIndex = userToFollow.followers.indexOf(currUserId);
    userToFollow.followers.splice(followerIndex, 1);

    const res = await addNotification(
      currUserId,
      id,
      "Unfollowed You",
      "",
      "",
      currUser.photoUrl,
      currUser.name
    );

    if (res.status == "error") {
      alert(res.message);
    } else {
      alert(res.result);
    }
  } else {
    userToFollow.followers?.push(currUserId);
    currUser.followings?.push(id);
    const res = await addNotification(
      currUserId,
      id,
      "Followed You",
      "",
      "",
      currUser.photoUrl,
      currUser.name
    );

    if (res.status == "error") {
      alert(res.message);
    } else {
      alert(res.result);
    }
  }

  const newFollwerField = { followers: [...userToFollow.followers] };
  const newFollwingField = { followings: [...currUser.followings] };

  await updateDoc(userToFollowDoc, newFollwerField);
  await updateDoc(currUserDoc, newFollwingField);

  getMyDoc(currUserId);
};

export const getCommnets = async (postId) => {
  const commentCollectionRef = collection(db, `posts/${postId}/comments`);
  const data = await getDocs(commentCollectionRef);
  const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const postDoc = doc(db, "posts", postId);
  const newFields = { commentCount: result.length };

  await updateDoc(postDoc, newFields);

  store.dispatch(setCurrentComments({ result, postId }));
};

export const addComment = async (
  post,
  currUserId,
  msg,
  createdAt,
  currUser
) => {
  try {
    const commentCollectionRef = collection(db, `posts/${post?.id}/comments`);
    const result = await addDoc(commentCollectionRef, {
      message: msg,
      createdAt,
      ownerId: currUserId,
    });

    getCommnets(post.id);

    const res = await addNotification(
      currUserId,
      post.ownerId,
      "Commented on your post",
      post.title,
      post.postUrl,
      currUser.photoUrl,
      currUser.name
    );

    if (res.status == "error") {
      alert(res.message);
    } else {
      alert(res.result);
    }

    // console.log(result.id);

    // alert('comment added');
  } catch (e) {
    console.log(e);
    alert("Something went wrong");
  }
};

export const getAllPostsOfAUser = async (userId) => {
  try {
    if (!userId) return error("Something went wrong");

    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);
    const user = { ...docSnap.data(), id: docSnap.id };
    store.dispatch(setUserProfile(user));

    const q = query(collection(db, "posts"), where("ownerId", "==", userId));

    const querySnapshot = await getDocs(q);
    store.dispatch(
      setAllUserPosts(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      )
    );
    return success("ok");
  } catch (e) {
    console.log(e.message);
    alert("Something went wrong");
    return error("Something went wrong");
  }
};

export const updateUserProfile = async (file, userId, info) => {
  try {
    const userDoc = doc(db, "users", userId);
    let newFields = { name: info.newName, phone: info.newPhone };

    if (file) {
      if (!file.type.includes("image")) {
        alert("You can only choose img files for profile photo");
        return;
      }

      const avatarRef = ref(storage, `avatar/${userId}`);

      const res = await uploadBytes(avatarRef, file);

      const url = await getDownloadURL(avatarRef);

      newFields = { photoUrl: url, name: info.newName, phone: info.newPhone };
    }

    await updateDoc(userDoc, newFields);

    const mydoc = doc(db, "users", userId);
    const docSnap = await getDoc(mydoc);
    const user = { ...docSnap.data(), id: docSnap.id };

    store.dispatch(setMyProfile(user));
    store.dispatch(setUserProfile(user));

    return success("Profile Updated");
  } catch (e) {
    console.log(e);
    return error(e.message);
  }
};

export const getAllUsers = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "!=", email));

    const querySnapshot = await getDocs(q);
    store.dispatch(
      setAllUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      )
    );
  } catch (e) {
    console.log(e);
  }
};

export const getChatId = async (chatUserId, currUserId) => {
  try {
    if (!chatUserId || !currUserId) return;
    let chatId = `${chatUserId}-${currUserId}`;
    let conversationCollectionRef = collection(
      db,
      `chats/${chatId}/conversations`
    );
    let docSnap = await getDocs(conversationCollectionRef);
    if (!docSnap.empty) {
      console.log("1");
      store.dispatch(setChatId(chatId));
      store.dispatch(
        setAllMessages(
          docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
      return;
    } else {
      chatId = `${currUserId}-${chatUserId}`;
      conversationCollectionRef = collection(
        db,
        `chats/${chatId}/conversations`
      );
      docSnap = await getDocs(conversationCollectionRef);
      if (!docSnap.empty) {
        console.log("2");
        store.dispatch(setChatId(chatId));
        store.dispatch(
          setAllMessages(
            docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
        return;
      } else {
        console.log("fghjkj");
        store.dispatch(setChatId(""));
        store.dispatch(setAllMessages([]));
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const addMessage = async (
  chatId,
  chatUserId,
  currUserId,
  text,
  file
) => {
  try {
    let conversationCollectionRef;
    if (chatId) {
      conversationCollectionRef = collection(
        db,
        `chats/${chatId}/conversations`
      );
    } else {
      const newChatId = `${currUserId}-${chatUserId}`;
      store.dispatch(setChatId(newChatId));
      conversationCollectionRef = collection(
        db,
        `chats/${newChatId}/conversations`
      );
    }

    let fileType = "";
    let chatName = "";
    let url = "";

    if (file) {
      // Check file type
      // if(!fileType.includes('image') ){
      //     return 'no'
      // }

      // if(!fileType.includes('video') ){
      //     return 'no'
      // }

      // if(fileType.includes('image')){
      //     if(file.size/1024 > 500) {
      //         return ''
      //     }
      // }

      if (file.type.includes("image")) {
        fileType = "image";
      } else if (file.type.includes("video")) {
        fileType = "video";
      } else {
        return error("You can only choose img or video files");
      }

      chatName = `${currUserId}-${Date.now()}`;

      const chatRef = ref(storage, `chats/${chatName}`);

      const res = await uploadBytes(chatRef, file);

      url = await getDownloadURL(chatRef);
    }

    const data = {
      text,
      createdAt: Date.now(),
      senderId: currUserId,
      recieverId: chatUserId,
      fileName: chatName,
      fileUrl: url,
      fileType,
    };

    const result = await addDoc(conversationCollectionRef, data);

    // const lastMessageCollectionRef = doc(db, `users/${currUserId}/lastMessage`, chatUserId);
    // await setDoc(lastMessageCollectionRef, data)

    // alert('message sent');
    return success("message sent");
  } catch (e) {
    console.log(e);
    return error("something went wrong");
  }
};

export const deleteMessage = async (msg, chatId) => {
  try {
    if (!msg.fileType) {
      const msgDoc = doc(db, `chats/${chatId}/conversations/`, msg.id);
      await deleteDoc(msgDoc);
      return success("message deleted");
    } else {
      const msgFileRef = ref(storage, `chats/${msg.fileName}`);
      deleteObject(msgFileRef)
        .then(async () => {
          const msgDoc = doc(db, `chats/${chatId}/conversations/`, msg.id);
          await deleteDoc(msgDoc);
          return success("message deleted");
        })
        .catch((e) => {
          console.log(e);
          return error(
            "This is a premium feature, to use this plz pay 1cr to developer"
          );
        });
    }
  } catch (e) {
    console.log(e);
    return error("Unable to delete message");
  }
};

export const addNotification = async (
  senderId,
  recieverId,
  message,
  postTitle,
  postUrl,
  senderPhotoUrl,
  senderName
) => {
  try {
    const allNotifications =
      store.getState().notificationReducer.allNotifications;

    const newNotification = {
      senderId,
      recieverId,
      message,
      postTitle,
      postUrl,
      senderPhotoUrl,
      senderName,
      createdAt: Date.now(),
    };

    if (allNotifications.length >= 10) {
      const lastNotificationDoc = doc(
        db,
        `users/${recieverId}/Notifications`,
        allNotifications[allNotifications.length - 1].id
      );
      await deleteDoc(lastNotificationDoc);
    }

    const notificationCollectionRef = collection(
      db,
      `users/${recieverId}/Notifications`
    );
    await addDoc(notificationCollectionRef, newNotification);

    return success("Notification pushed");
  } catch (e) {
    console.log(e);
    return error("Unable to push notification");
  }
};

export const getNotifications = (userId) => {
  try {
    if (!userId) {
      return () => {};
    }
    const q = query(
      collection(db, `users/${userId}/Notifications`),
      orderBy("createdAt")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach(async (docSnap) => {
        const newNotification = { ...docSnap.data(), id: docSnap.id };

        if (Date.now() - newNotification.createdAt >= 86400000) {
          // remove if time >= 1 day
          // console.log('new-notification --->', newNotification);
          const notificationDoc = doc(
            db,
            `users/${userId}/Notifications`,
            newNotification.id
          );
          await deleteDoc(notificationDoc);
        } else {
          notifications.push(newNotification);
        }
      });

      store.dispatch(setAllNotifications(notifications));
    });

    return unsub;
  } catch (e) {
    console.log(e);
    return () => {};
  }
};

export const updateAllNotificationsCountIndex = async (userId, value) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { notificationIndexCount: value });
  } catch (e) {
    console.log(e);
  }
};
