// Konfigurasi Firebase Proyek TKR-A
const firebaseConfig = {
    apiKey: "AIzaSyBWH9-t8pHpJpGethE4VR40BPdadtxCBiQ",
    authDomain: "tkra-3be6f.firebaseapp.com",
    databaseURL: "https://tkra-3be6f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tkra-3be6f",
    storageBucket: "tkra-3be6f.firebasestorage.app",
    messagingSenderId: "578959003469",
    appId: "1:578959003469:web:48738ba29c6c31caf9f104"};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
