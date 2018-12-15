import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyCf4Yhd4VfUhNHomrLRd4Kt6kzglV6LBk4",
    authDomain: "chat-app-12cc8.firebaseapp.com",
    databaseURL: "https://chat-app-12cc8.firebaseio.com",
    projectId: "chat-app-12cc8",
    storageBucket: "chat-app-12cc8.appspot.com",
    messagingSenderId: "721953328943"
  };
  firebase.initializeApp(config);

export default firebase;