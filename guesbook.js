import { db } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const form = document.getElementById("guestbookForm");

form.addEventListener("submit", e => {
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
        form["reset"]();
        alert("Komentar terkirim!");
    });
});
