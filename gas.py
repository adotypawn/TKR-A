import os
from PIL import Image

ext_foto = ('.jpg', '.jpeg', '.png')
print("--- Memulai Konversi Massal ke WebP ---")

count = 0
for file in os.listdir("."):
    if file.lower().endswith(ext_foto):
        try:
            img = Image.open(file)
            nama_file = os.path.splitext(file)[0]
            # Kualitas 75 agar file sangat ringan tapi tetap tajam
            img.save(nama_file + ".webp", "webp", quality=75)
            print(f"✅ Berhasil: {file} -> {nama_file}.webp")
            count += 1
        except Exception as e:
            print(f"❌ Gagal: {file}: {e}")

print(f"--- Selesai! {count} foto telah dikonversi ---")
