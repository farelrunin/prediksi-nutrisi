const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to Python executable in .venv (cross-platform)
const pythonPath = process.platform === 'win32'
  ? path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe')
  : path.join(__dirname, '..', '..', '.venv', 'bin', 'python');
const scriptPath = path.join(__dirname, '..', 'predict.py');

let pyProcess = null;
let queue = [];
let stdoutBuffer = '';

/**
 * Inisialisasi proses background Python.
 * Ini memuat model Keras ke memori sekali saja di awal saat server Express dijalankan.
 * Prediksi berikutnya akan terasa instan (<0.2 detik).
 */
const initPyProcess = () => {
  if (pyProcess) return;

  console.log('[AI ENGINE] Memulai proses persistent python untuk model TensorFlow...');
  pyProcess = spawn(pythonPath, [scriptPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  pyProcess.stdout.on('data', (data) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split('\n');
    stdoutBuffer = lines.pop(); // simpan data baris parsial yang belum selesai

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === 'READY') {
        console.log('[AI ENGINE] Model TensorFlow lokal BERHASIL dimuat dan SIAP digunakan.');
        continue;
      }

      // Selesaikan promise permintaan paling depan di antrean
      if (queue.length > 0) {
        const { resolve } = queue.shift();
        try {
          const json = JSON.parse(trimmed);
          resolve(json);
        } catch (err) {
          console.error('[AI ENGINE] Gagal membaca output JSON dari Python:', trimmed);
          resolve(null);
        }
      }
    }
  });

  pyProcess.on('close', (code) => {
    console.log(`[AI ENGINE] Proses Python tertutup dengan kode ${code}. Memulai ulang...`);
    pyProcess = null;
    
    // Tolak semua promise yang masih menggantung
    const oldQueue = queue;
    queue = [];
    oldQueue.forEach(({ resolve }) => resolve(null));
    
    // Mulai ulang proses
    setTimeout(initPyProcess, 2000);
  });
};

// Mulai proses Python secara persistent
initPyProcess();

/**
 * AI Model Service
 * Bridge langsung antara Express (Node.js) dan model Keras menggunakan Python persistent process.
 */
const predictFoodFromImage = async (imageBuffer, originalName = 'food.jpg') => {
  const tempFilePath = path.join(__dirname, '..', `temp_${Date.now()}_${originalName}`);
  
  try {
    // Tulis buffer ke file sementara
    fs.writeFileSync(tempFilePath, imageBuffer);
    
    return new Promise((resolve) => {
      // Daftarkan callback resolve ke antrean antarmuka
      queue.push({ resolve });

      // Kirim path gambar ke stdin proses Python
      if (pyProcess && pyProcess.stdin.writable) {
        pyProcess.stdin.write(tempFilePath + '\n');
      } else {
        console.error('[AI ENGINE] Proses Python model tidak aktif atau tidak dapat menerima input.');
        queue.pop(); // Hapus kembali dari antrean jika gagal kirim
        resolve(null);
      }
    }).then((result) => {
      // Hapus file sementara setelah proses prediksi selesai
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (unlinkError) {
        console.error("[AI ENGINE] Gagal menghapus file sementara:", unlinkError.message);
      }
      return result;
    });
  } catch (err) {
    console.error("[AI ENGINE] Service Error:", err.message);
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (_) {}
    return null;
  }
};

module.exports = { predictFoodFromImage };


