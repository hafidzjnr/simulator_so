import React from "react";
import { Link } from "react-router-dom";
import "../src/styles/HomePage.css";

// import gambar
import heroChip from "../src/assets/images/hero-chip.png";
import iconSchedule from "../src/assets/images/icon-schedule.png";
import iconLock from "../src/assets/images/icon-lock.png";
import iconCpu from "../src/assets/images/icon-cpu.png";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* HERO: teks kiri, ilustrasi kanan */}
      <div className="home-hero">
        <header className="home-header">
          <h1>SynSched Simulator</h1>
          <p>
            Visualisasi interaktif untuk penjadwalan proses CPU dan sinkronisasi
            sumber daya. Pelajari konsep sistem operasi dengan cara yang
            menyenangkan dan intuitif.
          </p>
          <div className="home-button">
            <Link to="/instruction" className="btn btn-primary">
              Mulai Tutorial
            </Link>
            <Link to="/simulator" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </header>

        <div className="home-hero-graphic">
          <img src={heroChip} alt="SynSched hero" />
        </div>
      </div>

      {/* FEATURES */}
      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <img src={iconSchedule} alt="Algoritma Penjadwalan" />
          </div>
          <h3>Algoritma Penjadwalan</h3>
          <p>
            Simulasikan Round Robin, Priority Scheduling, dan FCFS dengan
            visualisasi real-time.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={iconLock} alt="Manajemen Sumber Daya" />
          </div>
          <h3>Manajemen Sumber Daya</h3>
          <p>
            Pelajari sinkronisasi dengan semaphore dan mutex. Hindari deadlock
            dan race condition.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={iconCpu} alt="Gantt Chart" />
          </div>
          <h3>Gantt Chart</h3>
          <p>
            Visualisasi timeline eksekusi proses dengan Gantt Chart yang
            interaktif dan informatif.
          </p>
        </div>
      </section>

      {/* CONCEPTS */}
      <section className="home-concepts">
        <h2>Konsep yang Dipelajari</h2>

        <div className="concept-grid">
          <div className="concept-column">
            <div className="concept-item">
              <h3>Ready Queue &amp; Blocked Queue</h3>
              <p>
                Pahami bagaimana proses berpindah antar antrian berdasarkan
                status dan kebutuhan sumber daya.
              </p>
            </div>

            <div className="concept-item">
              <h3>Priority Inversion</h3>
              <p>
                Lihat bagaimana priority inheritance mengatasi masalah priority
                inversion.
              </p>
            </div>
          </div>

          <div className="concept-column">
            <div className="concept-item">
              <h3>Deadlock Detection</h3>
              <p>
                Simulasikan skenario deadlock dan pelajari cara mendeteksi serta
                mencegahnya.
              </p>
            </div>

            <div className="concept-item">
              <h3>Race Condition</h3>
              <p>
                Pahami pentingnya sinkronisasi untuk mencegah race condition
                pada sumber daya bersama.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
