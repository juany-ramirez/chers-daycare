import firebase from 'firebase/app'
import 'firebase/storage';
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBlLOUYmrr7HLKBp5YvG5OIc_ckPUSPMaw",
    authDomain: "chersdaycare-26bb6.firebaseapp.com",
    databaseURL: "https://chersdaycare-26bb6.firebaseio.com",
    projectId: "chersdaycare-26bb6",
    storageBucket: "chersdaycare-26bb6.appspot.com",
    messagingSenderId: "1091534490030",
    appId: "1:1091534490030:web:c676fd689d77af32ac603f",
    measurementId: "G-HX3K93Q4WC"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const storage = firebase.storage();

  export {
      storage, firebase as default
  }