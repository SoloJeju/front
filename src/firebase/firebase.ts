// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCcIy1ms2kOBtquJRCCq2PSxXRi4AJ9ewE',
  authDomain: 'soloj-58a0b.firebaseapp.com',
  projectId: 'soloj-58a0b',
  storageBucket: 'soloj-58a0b.firebasestorage.app',
  messagingSenderId: '308173231910',
  appId: '1:308173231910:web:c70c3539cf8d10afa853e7',
  measurementId: 'G-N3C84CM81C',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
