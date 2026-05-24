import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBWH9-t8pHpJpGethE4VR40BPdadtxCBiQ",
    authDomain: "tkra-3be6f.firebaseapp.com",
    databaseURL: "https://tkra-3be6f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tkra-3be6f",
    storageBucket: "tkra-3be6f.firebasestorage.app",
    messagingSenderId: "578959003469",
    appId: "1:578959003469:web:48738ba29c6c31caf9f104"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("guestbookForm");
const displayArea = document.getElementById("guestbookEntries");

// --- 1. Fungsi Simpan Komentar ---
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("guestName").value;
        const message = document.getElementById("guestMessage").value;

        const postRef = ref(db, "komentar");
        const newPostRef = push(postRef);

        set(newPostRef, {
            nama: name,
            pesan: message,
            waktu: new Date().toLocaleString("id-ID")
        }).then(() => {
            form.reset();
            Swal.fire({
                title: "Berhasil!",
                text: "Komentar kamu telah terkirim!",
                icon: "success",
                confirmButtonColor: "#ff0000"
            });
        }).catch((err) => {
            console.error("Gagal mengirim:", err);
        });
    });
}

// --- 2. Fungsi Tampil Komentar & Tombol Hapus ---
onValue(ref(db, "komentar"), (snapshot) => {
    if (!displayArea) return;
    displayArea.innerHTML = "";
    const data = snapshot.val();

    const isAdmin = window.adminMode;

    if (data) {
        Object.keys(data)
            .reverse()
            .forEach((key) => {
                const item = data[key];
                const card = `
                    <div style="background:#151515; border:1px solid rgba(255,255,255,0.05); border-left:4px solid #ff0000; padding:15px; border-radius:8px; margin-top:15px; position:relative; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="color:#ff0000; font-size:16px;">@${item.nama.toLowerCase().replace(/\s/g, "_")}</strong>
                            <small style="color:#555;">${item.waktu}</small>
                        </div>
                        <p style="margin-top:8px; color:#ddd; line-height:1.4; font-size:14px; text-align:left;">${item.pesan}</p>
                        ${
                            isAdmin
                                ? `
                          <button onclick="hapusPesan('${key}')" style="background:#ff0000; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; margin-top:12px; font-weight:bold; font-size:12px; display:inline-flex; align-items:center; gap:5px; transition:0.2s;">
                            <i class="fas fa-trash"></i> Hapus
                          </button>
                        `
                                : ""
                        }
                    </div>
                `;
                displayArea.innerHTML += card;
            });
    }
});

// --- 3. Fungsi Hapus Data (Nama diselaraskan dengan HTML agar tidak error) ---
window.hapusPesan = (key) => {
    Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Pesan ini akan dihapus permanen dari database!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0000",
        cancelButtonColor: "#333",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result.isConfirmed) {
            remove(ref(db, "komentar/" + key))
                .then(() => {
                    Swal.fire({
                        title: "Terhapus!",
                        text: "Pesan berhasil dihapus.",
                        icon: "success",
                        confirmButtonColor: "#ff0000"
                    });
                })
                .catch((err) => {
                    Swal.fire("Gagal!", "Gagal menghapus: " + err, "error");
                });
        }
    });
};
