import React from "react";
import '../src/styles/AboutPage.css';

const teamMambers = [
  {name: 'Mohamad Rayhan Arhbytio', role: 'Research Materials'},
  {name: 'Hafidz Januar Faturahman', role: 'Frontend Development'},
  {name: 'Nanda Raissa', role: 'Backend Development'},
  {name: 'Muhammad Naufal Syifau Rahman', role: 'UI design'},
  {name: 'M Fauz Haunan Zaky', role: 'UX Design'},
];

const AboutPage = () => {
  return (
    <div className="about-container">
      <h2>Selamat Datang di SynSched!</h2>
      <p className="team-description">
        Kami adalah tim pengembang yang berdedikasi untuk membantu Anda memahami konsep penjadwalan proses CPU dan sinkronisasi sumber daya dengan cara yang mudah, interaktif, dan intuitif. Melalui SyncSched Simulator, kami menghadirkan pengalaman belajar yang ilmiah sekaligus menyenangkan, agar setiap pengguna dapat menguasai prinsip-prinsip sistem operasi dengan lebih efektif.
      </p>

      <div className="team-grid">
        {teamMambers.map((member, index) => (
          <div key={index} className="team-card">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;