import React from "react";
import "../src/styles/AboutPage.css";

const teamMembers = [
  {
    name: "Mohamad Rayhan Arhbytio",
    role: "Research Materials",
    photo: "../src/assets/images/team/Rayhan.jpg",
    github: "https://github.com/RayhanHannn",
    instagram: "https://www.instagram.com/han.synn?igsh=MWhjZms2MmU0b2Z2eA==",
  },
  {
    name: "Hafidz Januar Faturahman",
    role: "Backend Development",
    photo: "../src/assets/images/team/Hafidz.jpg",
    github: "https://www.instagram.com/hfdjnr06_?igsh=MWxuaGp1ZjBsODdrZg==",
    instagram: "https://www.instagram.com/hfdjnr06_?igsh=aXphaHJ0NnhkNHg0",
  },
  {
    name: "Nanda Raissa",
    role: "Frontend Development",
    photo: "../src/assets/images/team/Nanda.jpg",
    github: "https://github.com/nandaRssa",
    instagram:
      "https://www.instagram.com/nanda_rsa?igsh=NjMwejQxNDJmMXYx&utm_source=qr",
  },
  {
    name: "Muhammad Naufal Syifau Rahman",
    role: "UI Design",
    photo: "../src/assets/images/team/Naufal.jpg",
    github: "https://github.com/naufalgacor",
    instagram:
      "https://www.instagram.com/mhmdnaufalsr_?igsh=MThqYjhjajNycDJhaQ==",
  },
  {
    name: "M Fauz Haunan Zaky",
    role: "UX Design",
    photo: "../src/assets/images/team/Fauz.jpg",
    github: "https://github.com/Hnzzky",
    instagram: "https://www.instagram.com/hnzzky_?igsh=bmxkaDhjd3B4M2k5",
  },
  {
    name: "Teguh Gustiana Nur Fadhilah",
    role: "Quality Assurance / Tester",
    photo: "../src/assets/images/team/Teguh.jpg",
    github: "https://github.com/gustiana08",
    instagram: "https://www.instagram.com/gutluc_?igsh=Z3BoN3RybmhhcjB6",
  },
];

const AboutPage = () => {
  return (
    <div className="about-container">
      <h2>Selamat Datang di SynSched!</h2>
      <p className="team-description">
        Kami adalah tim pengembang yang berdedikasi untuk membantu Anda memahami
        konsep penjadwalan proses CPU dan sinkronisasi sumber daya dengan cara
        yang mudah, interaktif, dan intuitif. Melalui SyncSched Simulator, kami
        menghadirkan pengalaman belajar yang ilmiah sekaligus menyenangkan, agar
        setiap pengguna dapat menguasai prinsip-prinsip sistem operasi dengan
        lebih efektif.
      </p>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="photo-container">
              <img
                src={member.photo}
                alt={member.name}
                className="member-photo"
              />
              <div className="photo-overlay"></div>
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
            <div className="social-links">
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.55C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.665 3.735 16.65C4.68 16.635 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C20.565 21.795 24 17.295 24 12C24 5.37 18.63 0 12 0Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
