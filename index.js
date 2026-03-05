// ============================
// 1. FUNGSI SECTION NAVIGATION
// ============================
function muncul(idTujuan) {
    const sections = ['home', 'foto', 'vidio', 'about'];

    sections.forEach(function(id) {
        const elemen = document.getElementById(id);
        if (elemen) {
            elemen.style.display = "none";
        }
    });

    const target = document.getElementById(idTujuan);
    if (target) {
        target.style.display = "block";
    }
}

// ============================
// 2. WINDOW LOAD EVENT
// ============================
window.onload = function() {
    muncul('home');
    
    // Hapus loader
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Tambahkan event listener modal SETELAH elemen ada
    const modal = document.getElementById('fotoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
};

// ============================
// 3. FUNGSI MODAL FOTO
// ============================
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
    if (modal) {
        modal.style.display = "none";
    }
}

// ============================
// 4. COUNTDOWN TIMER
// ============================
const graduationDate = new Date("July 1, 2026 08:00:00").getTime();

const countdownTimer = setInterval(function() {
    const now = new Date().getTime();
    const distance = graduationDate - now;

    if (distance < 0) {
        clearInterval(countdownTimer);
        const timerDiv = document.getElementById("countdownTimer");
        if (timerDiv) {
            timerDiv.innerHTML = "<h3>SELAMAT GRADUASI! 🎉</h3>";
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = days;
    if (hoursEl) hoursEl.innerText = hours;
    if (minutesEl) minutesEl.innerText = minutes;
    if (secondsEl) secondsEl.innerText = seconds;
}, 1000);

// ============================
// 5. AUDIO CONTROL
// ============================
function toggleAudio() {
    const audio = document.getElementById('myAudio');
    const btn = document.getElementById('audioBtn');
    
    if (audio && btn) {
        if (audio.paused) {
            audio.play();
            btn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            btn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
}

// ============================
// 6. BACK TO TOP
// ============================
window.onscroll = function() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }
};

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// ============================
// 7. HAMBURGER MENU
// ============================
function toggleMenu() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navbar && menuToggle) {
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

function closeMenu() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navbar && menuToggle) {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

document.addEventListener('click', function(e) {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navbar && menuToggle) {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

// ============================
// 8. BUKU TAMU (GUESTBOOK)
// ============================
const CONFIG = {
    serviceID: "service_qsphmyj",
    templateID: "template_zt4lw4c",
    userID: "user_HokrM1TTNolfVDT9G"
};

emailjs.init(CONFIG.userID);

const guestbookForm = document.getElementById('guestbookForm');
const statusDiv = document.getElementById('guestbookStatus');
const entriesDiv = document.getElementById('guestbookEntries');

let messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];

function renderMessages() {
    if (!entriesDiv) return;
    
    if (messages.length === 0) {
        entriesDiv.innerHTML = '<p class="no-messages">Belum ada pesan. Jadilah yang pertama!</p>';
        return;
    }
    
    entriesDiv.innerHTML = messages.map(msg => `
        <div class="guest-entry">
            <div class="entry-header">
                <span class="entry-name">${escapeHtml(msg.name)}</span>
                <span class="entry-time">${msg.time}</span>
            </div>
            <div class="entry-message">${escapeHtml(msg.message)}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (guestbookForm) {
    guestbookForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        const name = document.getElementById('guestName').value;
        const email = document.getElementById('guestEmail').value;
        const message = document.getElementById('guestMessage').value;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        if (statusDiv) statusDiv.innerHTML = '<p class="status-loading">Sedang mengirim...</p>';
        
        try {
            await emailjs.send(CONFIG.serviceID, CONFIG.templateID, {
                from_name: name,
                from_email: email,
                message: message,
                to_name: "Admin TKR A"
            });
            
            const newMessage = {
                name: name,
                email: email,
                message: message,
                time: new Date().toLocaleString('id-ID')
            };
            messages.unshift(newMessage);
            localStorage.setItem('guestbookMessages', JSON.stringify(messages));
            
            if (statusDiv) statusDiv.innerHTML = '<p class="status-success">✅ Pesan terkirim ke Gmail!</p>';
            renderMessages();
            guestbookForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            if (statusDiv) statusDiv.innerHTML = '<p class="status-error">.</p>';
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        setTimeout(() => {
            if (statusDiv) statusDiv.innerHTML = '';
        }, 3000);
    });
}

renderMessages();

/* =================================================
   BUKU TAMU FULL SYSTEM — PREMIUM VERSION
================================================= */

let adminMode = false;
const ADMIN_PASSWORD = "mprihcuy"; // ubah bebas

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("guestbookForm");
    const entriesBox = document.getElementById("guestbookEntries");
    const searchInput = document.getElementById("searchInput");

    loadMessages();
    autoScrollBottom();

    // SEARCH
    searchInput.addEventListener("input", () => loadMessages(searchInput.value));

    // SUBMIT
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addMessage();
    });
});

/* LOAD */
function loadMessages(filter = "") {
    const entriesBox = document.getElementById("guestbookEntries");
    entriesBox.innerHTML = "";

    let messages = JSON.parse(localStorage.getItem("guestbook")) || [];

    messages
        .filter(msg => msg.message.toLowerCase().includes(filter.toLowerCase()) || msg.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach((msg, index) => {
            const div = document.createElement("div");
            div.classList.add("chat-entry");
            div.innerHTML = `
                <div class="name">${msg.name}</div>
                <div class="message">${msg.message}</div>
                <div class="time">${msg.time}</div>
                ${adminMode ? `<button class="delete-btn" onclick="deleteMessage(${index})">Hapus</button>` : ""}
            `;
            entriesBox.prepend(div);
        });

    autoScrollBottom();
}

/* ADD */
function addMessage() {
    const name = document.getElementById("guestName").value.trim();
    const email = document.getElementById("guestEmail").value.trim();
    const message = document.getElementById("guestMessage").value.trim();

    if (!name || !email || !message) return showNotif("Isi semua kolom!", "#ff0000");

    const time = new Date().toLocaleString("id-ID");

    let messages = JSON.parse(localStorage.getItem("guestbook")) || [];
    messages.push({ name, email, message, time });

    localStorage.setItem("guestbook", JSON.stringify(messages));
    showNotif("Pesan terkirim!", "#00ff00");
    document.getElementById("guestbookForm").reset();

    loadMessages();
}

/* ADMIN */
function toggleAdmin() {
    if (!adminMode) {
        let pass = prompt("Masukkan password admin:");
        if (pass === ADMIN_PASSWORD) {
            adminMode = true;
            showNotif("Mode Admin Aktif", "#00ff00");
        } else return showNotif("Password salah!", "#ff0000");
    } else {
        adminMode = false;
        showNotif("Mode Admin Off", "#ff0000");
    }
    loadMessages();
}

/* DELETE */
function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem("guestbook")) || [];
    messages.splice(index, 1);
    localStorage.setItem("guestbook", JSON.stringify(messages));
    showNotif("Pesan dihapus!", "#ff0000");
    loadMessages();
}

/* NOTIFICATION */
function showNotif(text, color) {
    const box = document.createElement("div");
    box.classList.add("notif-box");
    box.style.background = color;
    box.textContent = text;
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = "0"; setTimeout(() => box.remove(), 400); }, 1200);
}

/* SCROLL */
function autoScrollBottom() {
    const box = document.getElementById("guestbookEntries");
    box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
}

/* EXPORT */
function exportJSON() {
    downloadFile("guestbook.json", localStorage.getItem("guestbook"));
}
function exportTXT() {
    let messages = JSON.parse(localStorage.getItem("guestbook")) || [];
    let txt = messages.map(m => `${m.name} — ${m.time}\n${m.message}\n`).join("\n");
    downloadFile("guestbook.txt", txt);
}
function exportCSV() {
    let messages = JSON.parse(localStorage.getItem("guestbook")) || [];
    let csv = "Nama,Email,Pesan,Waktu\n" + messages.map(m => `${m.name},${m.email},"${m.message}",${m.time}`).join("\n");
    downloadFile("guestbook.csv", csv);
}
function downloadFile(filename, content) {
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    a.download = filename;
    a.click();
}

/* THEME */
let darkMode = true;
function toggleTheme() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.remove("light");
    } else {
        document.body.classList.add("light");
    }
}