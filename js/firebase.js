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

// --- Tambahan Variabel Global untuk Fitur Balas ---
let replyToId = null; 

// --- 1. Fungsi Kirim Komentar / Balasan ---
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("guestName").value;
        const message = document.getElementById("guestMessage").value;

        const postRef = ref(db, "komentar");
        const newPostRef = push(postRef);

        // Di sini kita tambahkan properti parentId
        set(newPostRef, {
            nama: name,
            pesan: message,
            waktu: new Date().toLocaleString("id-ID"),
            parentId: replyToId 
        }).then(() => {
            form.reset();
            
            // Reset status balasan setelah berhasil kirim
            replyToId = null; 
            const replyIndicator = document.getElementById("replyIndicator");
            if (replyIndicator) replyIndicator.remove();

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

// Fungsi trigger saat tombol "Balas" diklik
window.setReply = (key, username) => {
    replyToId = key;
    
    let indicator = document.getElementById("replyIndicator");
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "replyIndicator";
        indicator.style = "color: #ff0000; margin-bottom: 10px; font-size: 13px; text-align: left;";
        form.insertBefore(indicator, form.firstChild);
    }
    indicator.innerHTML = `Membalas <b>@${username}</b> <span onclick="cancelReply()" style="cursor:pointer; color:#fff; margin-left:10px; background:#333; padding:2px 6px; border-radius:4px; font-size:11px;">Batal</span>`;
    
    document.getElementById("guestName").focus();
};

window.cancelReply = () => {
    replyToId = null;
    const replyIndicator = document.getElementById("replyIndicator");
    if (replyIndicator) replyIndicator.remove();
};


// --- 2. Fungsi Tampil Komentar & Balasan (Sistem Threading) ---
onValue(ref(db, "komentar"), (snapshot) => {
    if (!displayArea) return;
    displayArea.innerHTML = "";
    const data = snapshot.val();
    const isAdmin = window.adminMode;

    if (data) {
        const keys = Object.keys(data);
        const mainComments = [];
        const replies = {};

        // Pisahkan data berdasarkan ada/tidaknya parentId
        keys.forEach(key => {
            const item = data[key];
            item.id = key; 
            
            if (!item.parentId) {
                mainComments.push(item);
            } else {
                if (!replies[item.parentId]) {
                    replies[item.parentId] = [];
                }
                replies[item.parentId].push(item);
            }
        });

        // Tampilkan Komentar Utama
        mainComments.reverse().forEach((main) => {
            const usernameClean = main.nama.toLowerCase().replace(/\s/g, "_");
            
            let commentHTML = `
                <div style="background:#151515; border:1px solid rgba(255,255,255,0.05); border-left:4px solid #ff0000; padding:15px; border-radius:8px; margin-top:15px; position:relative; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:#ff0000; font-size:16px;">@${usernameClean}</strong>
                        <small style="color:#555;">${main.waktu}</small>
                    </div>
                    <p style="margin-top:8px; color:#ddd; line-height:1.4; font-size:14px; text-align:left;">${main.pesan}</p>
                    
                    <div style="margin-top:12px; display:flex; gap:10px;">
                        <button onclick="setReply('${main.id}', '${usernameClean}')" style="background:transparent; color:#aaa; border:1px solid #333; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">
                            <i class="fas fa-reply"></i> Balas
                        </button>
                        
                        ${isAdmin ? `
                          <button onclick="hapusPesan('${main.id}')" style="background:#ff0000; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px;">
                            <i class="fas fa-trash"></i> Hapus
                          </button>
                        ` : ""}
                    </div>

                    <div id="replies-${main.id}" style="margin-left: 25px; margin-top: 10px; border-left: 2px dashed #222; padding-left: 15px;">
            `;

            // Masukkan list balasan jika ada
            if (replies[main.id]) {
                replies[main.id].forEach(reply => {
                    const replyUsername = reply.nama.toLowerCase().replace(/\s/g, "_");
                    commentHTML += `
                        <div style="background:#1a1a1a; padding:10px; border-radius:6px; margin-top:8px; position:relative;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:#ff6666; font-size:13px;">@${replyUsername}</strong>
                                <small style="color:#444; font-size:11px;">${reply.waktu}</small>
                            </div>
                            <p style="margin-top:5px; color:#bbb; line-height:1.3; font-size:13px; text-align:left;">${reply.pesan}</p>
                            
                            ${isAdmin ? `
                              <button onclick="hapusPesan('${reply.id}')" style="background:transparent; color:#ff0000; border:none; cursor:pointer; font-size:11px; margin-top:5px; padding:0;">
                                <i class="fas fa-trash"></i> Hapus Balasan
                              </button>
                            ` : ""}
                        </div>
                    `;
                });
            }

            commentHTML += `</div></div>`;
            displayArea.innerHTML += commentHTML;
        });
    }
});


// --- 3. Fungsi Hapus Data ---
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
