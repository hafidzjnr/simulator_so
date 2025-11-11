import React from "react";
import { Link } from "react-router-dom";
import '../src/styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>SyncShed Simulator</h1>
        <p>
          Visualisasi interaktif untuk penjadwalan proses CPU dan sinkronisasi sumber daya.
          Pelajari konsep sistem operasi dengan cara yang menyenangkan dan intuitif.
        </p>
        <div className="home-button">
          <Link to="/introduction" className="btn btn-secondary">Mulai Tutorial</Link>
          <Link to="/simulator" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="home-features">
        <div className="feature-card">
          <h3>Algoritma Penjadwalan</h3>
          <p>Simulasikan Round Robin, Priority Scheduling, dan FCFS dan visualisasi real time.</p>
        </div>
        <div className="feature-card">
          <h3>Manajemen Sumber Daya</h3>
          <p>Pelajari sinkronisasi dengan semaphore dan mutex. Hindari deadlock dan race condition.</p>
        </div>
        <div className="feature-card">
          <h3>Gantt Chart</h3>
          <p>Visualisasi timeline eksekusi proses dengan Gantt Chart yang interaktifdan informatif</p>
        </div>
      </section>

      <section className="home-concepts">
        <h2>Kpnsep Yang Dipelajari</h2>
        <ul>
          <li>Ready Queue & Blockef Queue</li>
          <li>Priority Inversion</li>
          <li>Deadlock Detection</li>
          <li>Race Condition</li>
        </ul>
      </section>
    </div>
  )
}

export default HomePage;