import * as firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyCOV-sUNRHE9jvxRweQMSPo8jwLn7hv6bQ',
  authDomain: 'is-now-illegal.firebaseapp.com',
  databaseURL: 'https://is-now-illegal.firebaseio.com',
  storageBucket: 'is-now-illegal.appspot.com'
  // messagingSenderId: '325170618285',
})

// start offline, only go online when necessary to prevent too many simultaneous connections
firebase.database().goOffline()

export default firebase
