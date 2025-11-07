// Firebase config & Authentication + Firestore (Nama user) // Pastikan script ini dipanggil di semua halaman

// === Firebase Setup === import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"; import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"; import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyAsJBhCe7yyOwKK8kW2-HJ-Ll0UVVKfEPQ", authDomain: "investfy-65a29.firebaseapp.com", projectId: "investfy-65a29", storageBucket: "investfy-65a29.firebasestorage.app", messagingSenderId: "668769646313", appId: "1:668769646313:web:47874af71d86a014ed6278" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

// === REGISTER USER === const registerForm = document.getElementById("registerForm"); if (registerForm) { registerForm.addEventListener("submit", async (e) => { e.preventDefault();

const nama = document.getElementById("nama").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Simpan nama ke Firestore
  await setDoc(doc(db, "users", user.uid), {
    nama: nama,
    email: email,
  });

  alert("Akun berhasil dibuat! Silakan login.");
  window.location.href = "login.html";
} catch (error) {
  alert(error.message);
}

}); }

// === LOGIN USER === const loginForm = document.getElementById("loginForm"); if (loginForm) { loginForm.addEventListener("submit", async (e) => { e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "index.html";
} catch (error) {
  alert("Login gagal!" + error.message);
}

}); }

// === PROTEKSI HALAMAN SETELAH LOGIN === const protectedPages = ["index.html", "produk.html", "aset.html", "profil.html"]; // selain login & register

onAuthStateChanged(auth, async (user) => { const currentPage = window.location.pathname.split("/").pop();

if (!user && protectedPages.includes(currentPage)) { window.location.href = "login.html"; }

if (user && currentPage === "profil.html") { const docSnap = await getDoc(doc(db, "users", user.uid));

if (docSnap.exists()) {
  document.getElementById("userNama").innerText = docSnap.data().nama;
  document.getElementById("userEmail").innerText = docSnap.data().email;
}

} });

// === LOGOUT === const logoutBtn = document.getElementById("logoutBtn"); if (logoutBtn) { logoutBtn.addEventListener("click", async () => { await signOut(auth); window.location.href = "login.html"; }); }