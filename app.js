// ===============================
// FIREBASE CONFIG
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 Firebase Config (punyamu)
const firebaseConfig = {
  apiKey: "AIzaSyAsJBhCe7yyOwKK8kW2-HJ-Ll0UVVKfEPQ",
  authDomain: "investfy-65a29.firebaseapp.com",
  projectId: "investfy-65a29",
  storageBucket: "investfy-65a29.firebasestorage.app",
  messagingSenderId: "668769646313",
  appId: "1:668769646313:web:47874af71d86a014ed6278"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// AUTH GUARD (blokir sebelum login)
// ===============================
onAuthStateChanged(auth, async (user) => {
  const halamanDilindungi = ["index.html", "produk.html", "aset.html", "profil.html"];
  const halamanSekarang = location.pathname.split("/").pop() || "index.html";

  if (!user && halamanDilindungi.includes(halamanSekarang)) {
    window.location.href = "login.html"; // paksa login
  }

  // ✅ ambil data profil jika di profil.html
  if (user && halamanSekarang === "profil.html") {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      document.getElementById("userName").innerText = docSnap.data().name;
      document.getElementById("userEmail").innerText = user.email;
    }
  }
});


// ===============================
// REGISTER (DAFTAR AKUN)
// ===============================
if (document.getElementById("btnDaftar")) {
  document.getElementById("btnDaftar").addEventListener("click", async () => {
    const name = document.getElementById("nama").value;
    const email = document.getElementById("emailDaftar").value;
    const password = document.getElementById("passwordDaftar").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ simpan nama ke database firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email
      });

      alert("Registrasi berhasil!");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }
  });
}


// ===============================
// LOGIN (MASUK AKUN)
// ===============================
if (document.getElementById("btnLogin")) {
  document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html"; // ✅ arahkan ke halaman utama

    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  });
}


// ===============================
// LOGOUT (KELUAR AKUN)
// ===============================
if (document.getElementById("btnLogout")) {
  document.getElementById("btnLogout").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
      }
