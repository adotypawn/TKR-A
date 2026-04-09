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
    const navbar = document.getElementById('navbar');
    const toggle = document.querySelector('.menu-toggle');
    if (navbar && toggle) {
        navbar.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

function closeMenu() {
    const navbar = document.getElementById('navbar');
    const toggle = document.querySelector('.menu-toggle');
    if (navbar && toggle) {
        navbar.classList.remove('active');
        toggle.classList.remove('active');
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
   PISTON ENGINE CORE SYSTEM - HEIMU JOKI ENGINE
================================================= */

const EngineSystem = {
    rpm: 1000, // Kecepatan awal
    isRunning: true,
    
    init() {
        this.pistonAssembly = document.querySelector('.piston-assembly');
        this.explosionEffect = document.querySelector('.power-stroke');
        this.engineContainer = document.querySelector('.engine-master');
        
        this.startEngine();
        this.bindEvents();
    },

    // 1. Sinkronisasi Gerakan & RPM
    setSpeed(newRpm) {
        this.rpm = newRpm;
        const duration = (60 / this.rpm).toFixed(2); // Menghitung detik per siklus
        
        // Update durasi animasi pada elemen SVG
        const animatedElements = document.querySelectorAll('.piston-assembly, .con-rod-ultra, .crank-web, .power-stroke');
        animatedElements.forEach(el => {
            el.style.animationDuration = `${duration}s`;
        });
    },

    // 2. Efek Getaran Kamera (Screen Shake)
    // Berjalan setiap kali piston mencapai TMA (Top Dead Center)
    applyVibration() {
        if (!this.isRunning) return;
        
        // Menambahkan class shake ke container
        this.engineContainer.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`;
        
        setTimeout(() => {
            this.engineContainer.style.transform = 'translate(0,0)';
        }, 50);
    },

    startEngine() {
        // Loop untuk efek vibrasi yang sinkron dengan ledakan
        setInterval(() => {
            if (this.isRunning) {
                this.applyVibration();
            }
        }, (60 / this.rpm) * 1000); // Sinkron dengan RPM
    },

    bindEvents() {
        // Contoh: Jika user klik mesin, RPM bertambah (Gas Pol!)
        this.engineContainer.addEventListener('mousedown', () => {
            this.setSpeed(3000); // Naik ke 3000 RPM
            this.engineContainer.style.filter = "contrast(1.2) brightness(1.2)";
        });

        this.engineContainer.addEventListener('mouseup', () => {
            this.setSpeed(1000); // Balik ke Idle
            this.engineContainer.style.filter = "contrast(1) brightness(1)";
        });
    }
};

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', () => EngineSystem.init());

