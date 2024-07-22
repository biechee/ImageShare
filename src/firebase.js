// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBitNzLZORh0D4kd--BNV3BWwBAHRbgzt4",
  authDomain: "imageshare-4b3ba.firebaseapp.com",
  projectId: "imageshare-4b3ba",
  storageBucket: "imageshare-4b3ba.appspot.com",
  messagingSenderId: "224172410641",
  appId: "1:224172410641:web:986d67a992656551b6aeb0",
  measurementId: "G-G68J44J761"
};

// Initialize Firebase
// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);

// 獲取存儲和 Firestore 服務
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };