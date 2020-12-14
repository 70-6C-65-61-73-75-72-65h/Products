import * as firebase from "firebase";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB232ly-YH5BqFVivK6cZwpFCem-6F0Csk",
  authDomain: "testproj-30b12.firebaseapp.com",
  databaseURL: "https://testproj-30b12-default-rtdb.firebaseio.com",
  projectId: "testproj-30b12",
  storageBucket: "testproj-30b12.appspot.com",
  messagingSenderId: "288859036226",
  appId: "1:288859036226:web:2256619dd7e9892dac2bdb",
  measurementId: "G-6BVLDP7VT0",
};
// firebase.initializeApp(firebaseConfig);
// export default firebase;
const persistance = firebase.auth.Auth.Persistence.LOCAL;
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
app.auth().setPersistence(persistance);
export default app;
