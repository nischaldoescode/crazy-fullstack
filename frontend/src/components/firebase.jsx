import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential // ✅ Add this
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChgSKJpQctOCkmw0tdPnJTF6zULK961Hk",
  authDomain: "craazydukaan.firebaseapp.com",
  projectId: "craazydukaan",
  storageBucket: "craazydukaan.firebasestorage.app",
  messagingSenderId: "264207203272",
  appId: "1:264207203272:web:ae57ee8dc67ffdb5a05efd"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential // ✅ Export it
};



// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCQHYxJi0BVpzDgXjXt84cCE6NgpME-pTo",
//   authDomain: "crazydukaan-72972.firebaseapp.com",
//   projectId: "crazydukaan-72972",
//   storageBucket: "crazydukaan-72972.firebasestorage.app",
//   messagingSenderId: "183482251393",
//   appId: "1:183482251393:web:7685881c2cdfa6c8c1b580"
// };