import firebase from "firebase/app";
import "firebase/firebase-firestore";
import "firebase/auth";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCQjYP1xBWOfi0KfZDRI4zi-p3yzwNRDZk",
  authDomain: "instagram-clone-c998f.firebaseapp.com",
  databaseURL: "https://instagram-clone-c998f.firebaseio.com",
  projectId: "instagram-clone-c998f",
  storageBucket: "instagram-clone-c998f.appspot.com",
  messagingSenderId: "186338993776",
  appId: "1:186338993776:web:dc663606aea07d1a4a36b5",
  measurementId: "G-6BEDNJV5QP",
};

class Firebase {
  constructor(props) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    this.auth = firebase.auth();
    this.storage = firebase.storage();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }

  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name,
    });
  }

  onAuth() {
    return new Promise((res) => {
      this.auth.onAuthStateChanged((user) => {
        res(user);
      });
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }
}

export default new Firebase();
