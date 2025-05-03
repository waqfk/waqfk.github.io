// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration object (from your Firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyDuwhlhsovFnMnPSVP1AJ1t9wMm2vKDYhM",
  authDomain: "chat1241.firebaseapp.com",
  projectId: "chat1241",
  storageBucket: "chat1241.firebasestorage.app",
  messagingSenderId: "464533441905",
  appId: "1:464533441905:web:6fb75988fcc305f8bcbad0",
  measurementId: "G-1E2L911ZF7"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// DOM elements
const usernameMenu = document.getElementById('usernameMenu');
const setUsernameBtn = document.getElementById('setUsernameBtn');
const chatInterface = document.getElementById('chatInterface');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// Global variables
let username = "";

// Event listener to handle username input
setUsernameBtn.addEventListener('click', async () => {
    username = document.getElementById('usernameInput').value;
    if (username.trim() === "") {
        alert("Please enter a valid username.");
        return;
    }
    // Hide username menu and show chat interface
    usernameMenu.classList.add('hidden');
    chatInterface.classList.remove('hidden');
    loadMessages();
});

// Event listener for sending messages
sendMessageBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (message) {
        // Add message to Firestore
        await addDoc(collection(db, 'global_chat'), {
            username: username,
            message: message,
            timestamp: new Date()
        });
        messageInput.value = ""; // Clear input
    }
});

// Function to load messages from Firestore in real-time
function loadMessages() {
    const messagesRef = collection(db, 'global_chat');
    const q = query(messagesRef, orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
        messagesContainer.innerHTML = "";  // Clear previous messages
        snapshot.forEach(doc => {
            const messageData = doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = `${messageData.username}: ${messageData.message}`;
            messagesContainer.appendChild(messageElement);
        });
    });
}
