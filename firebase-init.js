// Konfigurasi Firebase Proyek TKR-A
const firebaseConfig = {
  apiKey: "AIzaSyBWH9-t8pHpJpGethE4VR40BPdadtxCBiQ",
  authDomain: "tkr-a.firebaseapp.com",
  databaseURL: "https://tkr-a-default-rtdb.firebaseio.com",
  projectId: "tkr-a",
  storageBucket: "tkr-a.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
