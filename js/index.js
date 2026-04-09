// =================================================
// 1. NAVIGASI, LOADER & AUDIO
// =================================================
function muncul(idTujuan) {
    const sections = ['home', 'foto', 'vidio', 'about'];
    sections.forEach(id => {
        const elemen = document.getElementById(id);
        if (elemen) elemen.style.display = "none";
    });
    const target = document.getElementById(idTujuan);
    if (target) target.style.display = "block";
}

window.onload = function() {
    muncul('home');
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
};

window.addEventListener('click', () => {
    const audio = document.getElementById("myAudio");
    if (audio && audio.paused) audio.play();
}, { once: true });

// =================================================
// 2. MODAL & UI SCROLL
// =================================================
function openModal(src) {
    const modal = document.getElementById('fotoModal');
    const img = document.getElementById('imgZoom');
    if (modal && img) {
        modal.style.display = "block";
        img.src = src;
    }
}

function closeModal() {
    const modal = document.getElementById('fotoModal');
    if (modal) modal.style.display = "none";
}

window.onscroll = function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        btn.style.display = (window.scrollY > 300) ? "block" : "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =================================================
// 3. MENU MOBILE
// =================================================
function toggleMenu() {
    document.getElementById('navbar').classList.toggle('active');
    document.querySelector('.menu-toggle').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('navbar').classList.remove('active');
    document.querySelector('.menu-toggle').classList.remove('active');
}

// =================================================
// 4. COUNTDOWN GRADUASI
// =================================================
const graduationDate = new Date("July 1, 2026 08:00:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = graduationDate - now;
    
    if (distance < 0) return;

    // Tambahkan String() untuk membungkus angka agar menjadi teks
    document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24)));
    document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000));
}, 1000);


// =================================================
// 5. SISTEM ADMIN & EXPORT (Firebase Helper)
// =================================================
window.adminMode = localStorage.getItem('isAdmin') === 'true';

function toggleAdmin() {
    const PASS = "mprihcuy"; 
    if (!window.adminMode) {
        let input = prompt("Masukkan Password Admin:");
        if (input === PASS) {
            window.adminMode = true;
            localStorage.setItem('isAdmin', 'true');
            showNotif("Mode Admin Aktif", "#00ff00");
        } else {
            showNotif("Password Salah!", "#ff0000");
            return;
        }
    } else {
        window.adminMode = false;
        localStorage.setItem('isAdmin', 'false');
        showNotif("Mode Admin Off", "#ff0000");
    }
    setTimeout(() => location.reload(), 800);
}

function showNotif(text, color) {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.background = color;
    box.style.color = "white";
    box.style.padding = "10px 20px";
    box.style.borderRadius = "5px";
    box.style.zIndex = "9999";
    box.textContent = text;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2000);
}

// EXPORT: Mengambil teks dari tampilan guestbook
function exportJSON() {
    const entries = document.getElementById("guestbookEntries").innerText;
    if(!entries || entries.includes("Belum ada pesan")) return alert("Tidak ada data.");
    downloadFile("backup_komentar.txt", entries);
}

function exportTXT() { exportJSON(); }
function exportCSV() { alert("Gunakan export TXT untuk saat ini."); }

function downloadFile(filename, content) {
    const a = document.createElement("a");
    const blob = new Blob([content], { type: "text/plain" });
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

// SEARCH FUNCTION
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#guestbookEntries > div');
            cards.forEach(card => {
                card.style.display = card.innerText.toLowerCase().includes(val) ? "block" : "none";
            });
        });
    }
});
