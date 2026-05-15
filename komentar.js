const formKomentar = document.querySelector('#form-komentar');
const listKomentar = document.querySelector('#list-komentar');

// Fungsi Kirim Komentar
function kirimKomentar(nama, pesan) {
    const dataBaru = db.ref('komentar').push();
    dataBaru.set({
        nama: nama,
        pesan: pesan,
        waktu: Date.now()
    });
}

// Fungsi Ambil Data (Realtime)
db.ref('komentar').on('value', (snapshot) => {
    const data = snapshot.val();
    // Kode untuk menampilkan data ke HTML kamu di sini...
    console.log("Data diterima:", data);
});
