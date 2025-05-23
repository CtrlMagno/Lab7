
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyDkD67hOcuNVecjnyi3PMM2gp9zmKx6c2I",
  authDomain: "lab-7-78387.firebaseapp.com",
  projectId: "lab-7-78387",
  storageBucket: "lab-7-78387.firebasestorage.app",
  messagingSenderId: "528066358958",
  appId: "1:528066358958:web:bab2d22dd9d2caa93ac73f",
  measurementId: "G-5VDLJXMXT3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);