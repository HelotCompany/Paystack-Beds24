import firebase from 'firebase'
import 'firebase/auth';
import 'firebase/firestore';

let config = {
  apiKey: "AIzaSyCLe8Ar-KVfYVOGqCM3HkAUHAqAAiuj270",
  authDomain: "paystack-for-beds24.firebaseapp.com",
  projectId: "paystack-for-beds24",
  storageBucket: "paystack-for-beds24.appspot.com",
  messagingSenderId: "822736429558",
  appId: "1:822736429558:web:b982ef19eee6e76cd6e7d7",
  measurementId: "G-55R3TVPRKL"
};

firebase.initializeApp(config)

export const db = firebase.firestore();
export const auth = firebase.auth();