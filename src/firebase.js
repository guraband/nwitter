import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgCbVpN8OeagvBDZb483ZonLLlLOkG6oY",
    authDomain: "nwitter-6b063.firebaseapp.com",
    projectId: "nwitter-6b063",
    storageBucket: "nwitter-6b063.appspot.com",
    messagingSenderId: "901308695945",
    appId: "1:901308695945:web:a2ac7e2a0700d78d380d58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app