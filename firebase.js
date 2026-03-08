import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVmm79Wqy7q5AwPZW16sKgTLFTKXLijd0",
    authDomain: "anay-market-place.firebaseapp.com",
    databaseURL: "https://anay-market-place-default-rtdb.firebaseio.com",
    projectId: "anay-market-place",
    storageBucket: "anay-market-place.firebasestorage.app",
    messagingSenderId: "100819511802",
    appId: "1:100819511802:web:c6dcbc12875196c1c45c43",
    measurementId: "G-46095DE1D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
