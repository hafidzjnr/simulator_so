import React from "react";
import { Link } from "react-router-dom";
import '../src/styles/InstructionPage.css';

const InstructionPage = () => {
  return (
    <div className="instruction-container">
      <h2>Selamat Datang di SynSched!</h2>
      <h3>Panduan Penggunaan</h3>
      <p>Ikuti langkah-langkah berikut untuk memaksimalkan pengalaman belajar anda</p>

      <ol className="instruction-list">
        <li>
          <strong>Pilih Algoritma Penjadwalan</strong>
          <p>Tentukan algoritma yang ingin anda gunakan: Priority Scheduling, Round Robin, atau FCFS.</p>
        </li>
        <li>
          <strong>Buat Proses</strong>
          <p>Klik 'Add Process' untuk membuat proses baru. Atur nama proses, prioritas, dan instruksinya.</p>
        </li>
        <li>
          <strong>Definisikan Instruksi</strong>
          <p>Setiap proses memiliki instruksi: CPU (eksekusi), LOCK (ambil sumber daya), dan UNLOCK (lepas sumber daya).</p>
        </li>
        <li>
          <strong>Jalankan Simulasi</strong>
          <p>Gunakan tombol Play untuk menjalankan simulasi otomatis, atau Step untuk maju per detik. Amati pergerakan proses di antrian dan status sumber daya.</p>
        </li>
        <li>
          <strong>Analisis Gantt Chart</strong>
          <p>Perhatikan Gantt Chart untuk melihat timeline proses (running, ready, blocked).</p>
        </li>
        <li>
          <strong>Pahami Log Sistem</strong>
          <p>Baca Log di panel kanan untuk memahami setiap kejadian.</p>
        </li>
        <li>
          <strong>Coba Skenario Khusus</strong>
          <p>Eksperimen dengan deadlock (P1: LOCK A → LOCK B, P2: LOCK B → LOCK A) atau priority inversion dengan priority inheritance.</p>
        </li>
      </ol>

      <div className="continue-card">
  <div className="continue-text">
    <h4>Lanjutkan ke Simulator</h4>
    <p>Baca panduan atau langsung coba simulator</p>
  </div>

  <Link to="/simulator" className="continue-button">
    <span>Buka Simulator</span>
    <span className="continue-arrow">→</span>
  </Link>
</div>

    </div>
  )
}

export default InstructionPage;