// firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBX9zIA75-OY3lbCRtLpJ7O6KEkxtE-Phc",
    authDomain: "mobile-d8c05.firebaseapp.com",
    projectId: "mobile-d8c05",
    storageBucket: "mobile-d8c05.firebasestorage.app",
    messagingSenderId: "653057250479",
    appId: "1:653057250479:web:1510986127ec7438e5f05a"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
