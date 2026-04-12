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
    const menu = document.getElementById('daftar-menu');
    const tombol = document.querySelector('.menu-toggle');
    if (menu && tombol) {
        menu.classList.toggle('active');
        tombol.classList.toggle('active');
    }
}

function closeMenu() {
    const menu = document.getElementById('daftar-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (menu && tombol) {
        menu.classList.remove('active');
        tombol.classList.remove('active');
    }
}

// =================================================
// 4. COUNTDOWN GRADUASI
// =================================================
const graduationDate = new Date("July 1, 2026 08:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = graduationDate - now;
    if (distance < 0) return;

    document.getElementById("days").innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24)));
    document.getElementById("hours").innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    document.getElementById("minutes").innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    document.getElementById("seconds").innerText = String(Math.floor((distance % (1000 * 60)) / 1000));
}, 1000);

// =================================================
// 5. SISTEM ADMIN & EXPORT
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

function exportJSON() {
    const entries = document.getElementById("guestbookEntries").innerText;
    if(!entries || entries.includes("Belum ada pesan")) return alert("Tidak ada data.");
    downloadFile("backup_tkra.txt", entries);
}

function exportTXT() { exportJSON(); }
function exportCSV() { alert("Fitur CSV sedang dikembangkan."); }

function downloadFile(filename, content) {
    const a = document.createElement("a");
    const blob = new Blob([content], { type: "text/plain" });
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

// =================================================
// 6. SEARCH & FILTER
// =================================================
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

/**
 * FUNGSI HAPUS PESAN
 * Ini adalah jembatan untuk memanggil fungsi hapusData yang ada di script module HTML
 */
window.hapusPesan = function(key) {
    if (typeof window.hapusData === "function") {
        window.hapusData(key);
    } else {
        console.error("Fungsi hapusData belum siap di index.html");
    }
};
/* =================================================
   PISTON ENGINE CORE SYSTEM - TKR A VERSION
================================================= */

const EngineTKR = {
    // Pengaturan Dasar
    config: {
        idleRPM: 1.0,  // Kecepatan lambat (detik)
        fastRPM: 0.4,  // Kecepatan saat digas (detik)
        isRunning: true
    },

    init() {
        // Seleksi elemen penting
        this.pistonMaster = document.querySelector('.piston-assembly');
        this.conRod = document.querySelector('.con-rod-master');
        this.crank = document.querySelector('.crank-web');
        this.explosion = document.querySelector('.power-stroke');
        this.container = document.querySelector('.engine-master');

        if (!this.pistonMaster) return;

        this.bindEvents();
    },

    // Fungsi untuk mengubah kecepatan animasi secara global
    updateEngineSpeed(duration) {
        const elements = [this.pistonMaster, this.conRod, this.crank, this.explosion];
        
        elements.forEach(el => {
            if (el) {
                el.style.animationDuration = `${duration}s`;
            }
        });
    },

    bindEvents() {
        // Efek Gas Pol saat klik/sentuh mesin
        const startGas = () => {
            this.updateEngineSpeed(this.config.fastRPM);
            this.container.style.boxShadow = "0 0 30px rgba(255, 0, 0, 0.4)";
            this.container.style.transition = "0.2s";
        };

        const stopGas = () => {
            this.updateEngineSpeed(this.config.idleRPM);
            this.container.style.boxShadow = "none";
        };

        // Event Listeners (Mouse & Touch untuk HP)
        this.container.addEventListener('mousedown', startGas);
        this.container.addEventListener('mouseup', stopGas);
        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startGas();
        });
        this.container.addEventListener('touchend', stopGas);
    }
};

// Jalankan sistem saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    EngineTKR.init();
});
// Script untuk menghentikan lagu saat pindah tab atau keluar aplikasi
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        // Jika pengguna pindah tab atau minimize, musik berhenti
        Audio.pause();
    } else {
        // Jika kembali ke tab, musik bisa lanjut (opsional)
        // audio.play(); 
    }
});
// Fungsi untuk membuka dan menutup menu (Hamburger)
function aksiMenu() {
    const menu = document.getElementById("daftar-menu");
    menu.classList.toggle("tampilkan");
}

// Fungsi untuk menutup menu saat link diklik
function tutupMenu() {
    const menu = document.getElementById("daftar-menu");
    menu.classList.remove("tampilkan");
}