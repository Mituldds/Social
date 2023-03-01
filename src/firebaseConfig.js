import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { error, success } from "./utils/responseWrapper";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async () => {
    try {

        const res = await signInWithPopup(auth, googleProvider);
        const docRef = doc(db, "users", res.user.uid);
        const data = {
            name: res.user.displayName,
            email: res.user.email,
            phone: res.user.phoneNumber,
            photoUrl: res.user.photoURL,
            followers: [],
            followings: [],
            notificationIndexCount: 0,
            createdAt: Date.now().toString(),
        }

        const result = await setDoc(docRef, data);
        return success('user registered');

    } catch (e) {
        console.log(e);
        return error(e.message);
    }

}

export const signInWithFacebook = async () => {
    try {

        const res = await signInWithPopup(auth, facebookProvider);
        const docRef = doc(db, "users", res.user.uid);
        const data = {
            name: res.user.displayName,
            email: res.user.email,
            phone: res.user.phoneNumber,
            photoUrl: res.user.photoURL,
            followers: [],
            followings: [],
            notificationIndexCount: 0,
            createdAt: Date.now().toString(),
        }

        const result = await setDoc(docRef, data);
        return success('user registered');

    } catch (e) {
        console.log(e);
        return error(e.message);
    }
}

export const resetPassword = async (email) => {
    try {

        const result = await sendPasswordResetEmail(auth, email);
        alert('Password reset email has been sent to your registered email Id');

    } catch (error) {
        console.log(error);
        alert('User with this email Id is not registerd');
    }
}