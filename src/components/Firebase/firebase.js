import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDflmiKPEv1rDmF6xBwVXINbqxHphElC8M',
  authDomain: 'souperheroes-32ce8.firebaseapp.com',
  databaseURL: 'https://souperheroes-32ce8.firebaseio.com',
  projectId: 'souperheroes-32ce8',
  storageBucket: 'souperheroes-32ce8.appspot.com',
  messagingSenderId: '709415909284',
  appId: '1:709415909284:web:64ab5ba5a35bc2856bb331',
  measurementId: 'G-BEYMTB47WL'
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();

    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => {
    console.log('sign out');
    this.auth.signOut();
  };

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = uid => this.db.doc(`users/${uid}`).get();

  users = () => this.db.collection('users').get();

  generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = this.db.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const { email, uid } = user;
      try {
        await userRef.set({
          email,
          uid,
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document', error);
      }
    }
  };

  getUserDocument = async uid => {
    if (!uid) return null;
    try {
      const userDocument = await this.db.doc(`users/${uid}`).get();
      return {
        uid,
        ...userDocument.data()
      };
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };
}

export default Firebase;
