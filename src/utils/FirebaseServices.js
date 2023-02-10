import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import { error, success } from "./responseWrapper";
import store from '../redux/store'
import { setMyProfile } from "../redux/slices/appConfigSlice";
import { addAPost, setAllPosts, setCurrentComments, setLikeForPost } from "../redux/slices/postsSlice";
import { setAllUserPosts, setUserProfile } from "../redux/slices/userProfileSlice";


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
            createdAt: Date.now().toString(),
        }

        const result = await setDoc(docRef, data);

        return success(result);

    } catch (e) {
        return error(e.message);
    }
}

export const getMyDoc = async (id) => {

    const mydoc = doc(db, 'users', id);
    const docSnap = await getDoc(mydoc);
    const user = { ...docSnap.data(), id: docSnap.id };
    console.log(user);
    store.dispatch(setMyProfile(user));
    // return success(user);
}

export const createPost = async (title, file, user) => {
    if (!title) {
        alert('plz write a title for post');
        return;
    }

    if (!file) {
        alert('plz choose a post');
        return;
    }

    let fileType;
    if (file.type.includes('image')) {
        fileType = 'img';
    }
    else if (file.type.includes('video')) {
        fileType = 'video';
    }
    else {
        alert('You can only choose img or video files for posts');
        return;
    }

    const postName = `${user.id}-${Date.now()}`;

    const postRef = ref(storage, `images/${postName}`);

    const res = await uploadBytes(postRef, file);

    const url = await getDownloadURL(postRef);

    console.log(url);

    const postCollectionRef = collection(db, 'posts');

    const result = await addDoc(postCollectionRef, {
        title,
        ownerId: user.id,
        createdAt: Date.now().toString(),
        likes: [],
        postType: fileType,
        postImgName: postName,
        postUrl: url,
        commentCount: 0
    });

    // console.log(result.id);

    // const userDoc = doc(db, 'users', user.id);
    // const newFields = { posts: [...user.posts, result.id] };
    // await updateDoc(userDoc, newFields);

    // getMyDoc(user.id);

    const postDoc = doc(db, 'posts', result.id);
    const docSnap = await getDoc(postDoc);
    const post = { ...docSnap.data(), id: docSnap.id };

    store.dispatch(addAPost(post));

    alert('post created');
}

export const getAllPosts = async () => {
    const postCollectionRef = collection(db, 'posts');
    const data = await getDocs(postCollectionRef);
    store.dispatch(setAllPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))));
}

export const getAParticularUser = async (id, setUser) => {
    const userDoc = doc(db, 'users', id);
    const docSnap = await getDoc(userDoc);
    const user = { ...docSnap.data(), id: docSnap.id };
    setUser(user);
}

export const postLikeUnlike = async (postId, currUserId) => {
    try {

        const postDoc = doc(db, 'posts', postId);
        const docSnap = await getDoc(postDoc);
        const post = { ...docSnap.data(), id: docSnap.id };

        if (post.likes.includes(currUserId)) {
            const index = post.likes.indexOf(currUserId);
            post.likes.splice(index, 1);
        }
        else {
            post.likes.push(currUserId);
        }

        const newFields = { likes: [...post.likes] };

        await updateDoc(postDoc, newFields);

    } catch (e) {
        console.log(e);
        alert('Post not found')
    }
}

export const userFollowUnFollow = async (id, currUserId) => {
    const userToFollowDoc = doc(db, 'users', id);
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
    }
    else {
        userToFollow.followers?.push(currUserId);
        currUser.followings?.push(id);
    }

    const newFollwerField = { followers: [...userToFollow.followers] };
    const newFollwingField = { followings: [...currUser.followings] };

    await updateDoc(userToFollowDoc, newFollwerField);
    await updateDoc(currUserDoc, newFollwingField);

    getMyDoc(currUserId);
}

export const getCommnets = async (postId) => {
    const commentCollectionRef = collection(db, `posts/${postId}/comments`);
    const data = await getDocs(commentCollectionRef);
    const result = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const postDoc = doc(db, 'posts', postId);
    const newFields = { commentCount: result.length };

    await updateDoc(postDoc, newFields);

    store.dispatch(setCurrentComments({ result, postId }));
}

export const addComment = async (postId, currUserId, msg, createdAt) => {
    try {

        const commentCollectionRef = collection(db, `posts/${postId}/comments`);
        const result = await addDoc(commentCollectionRef, {
            message: msg,
            createdAt,
            ownerId: currUserId,
        })

        getCommnets(postId);
        // console.log(result.id);

        // alert('comment added');

    } catch (e) {
        console.log(e);
        alert('Something went wrong');
    }

}

export const getAllPostsOfAUser = async (userId) => {
    try {

        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        const user = { ...docSnap.data(), id: docSnap.id };
        store.dispatch(setUserProfile(user));

        const q = query(collection(db, "posts"), where("ownerId", "==", userId));

        const querySnapshot = await getDocs(q);
        store.dispatch(setAllUserPosts(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))));
        return success('ok');

    } catch (e) {
        console.log(e.message);
        alert('Something went wrong');
        return error('Something went wrong');
    }
}

export const updateUserProfile = async (file, userId, info) => {
    try {

        const userDoc = doc(db, 'users', userId);
        let newFields = { name: info.newName, phone: info.newPhone };

        if (file) {

            if (!file.type.includes('image')) {
                alert('You can only choose img files for profile photo');
                return;
            }

            const avatarRef = ref(storage, `avatar/${userId}`);

            const res = await uploadBytes(avatarRef, file);

            const url = await getDownloadURL(avatarRef);

            newFields = { photoUrl: url, name: info.newName, phone: info.newPhone };
        }

        await updateDoc(userDoc, newFields);

        const mydoc = doc(db, 'users', userId);
        const docSnap = await getDoc(mydoc);
        const user = { ...docSnap.data(), id: docSnap.id };

        store.dispatch(setMyProfile(user));
        store.dispatch(setUserProfile(user));

        return success('Profile Updated');

    } catch (e) {
        console.log(e);
        return error(e.message);
    }


}