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
          <p>Setiap proses memiliki instruksi: CPU (eksekusi), LOCK (ambil sumber daya), dan UNLOCK (lepas sumber daya)</p>
        </li>
        <li>
          <strong>Analisis Gantt Chart</strong>
          <p>Perhatikan Gantt Chart untuk melihat timeline proses (running, ready, blocked).</p>
        </li>
        <li>
          <strong>Pahami Log Sistem</strong>
          <p>Baca Log di panel kanan untuk memahami setiap kejadian.</p>
        </li>
      </ol>

      <Link to="/simulator" className="btn btn-primary">
        Lanjutkan ke Simulator
      </Link>
    </div>
  )
}

export default InstructionPage;