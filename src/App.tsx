import React from "react";

export default function App() {
  return (
    <div className="page">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <main className="container">
        <header className="hero">
          <p className="eyebrow">Full-Stack Software Engineer</p>
          <h1 className="title">Vuk Topalović</h1>
          <p className="subtitle">
            Full-Stack Software Engineer with 5+ years of experience building
            secure, microservice-based systems in enterprise and R&D
            environments. Strong background in backend systems, REST APIs,
            messaging, security, CI/CD, and containerized deployments.
          </p>
          <div className="actions">
            <a href="#projects" className="button button-primary">
              View Projects
            </a>
            <a href="#contact" className="button button-secondary">
              Get in Touch
            </a>
          </div>
        </header>

        <section id="about" className="section">
          <h2 className="section-title">About</h2>
          <p className="paragraph">
            I build secure backend services and full-stack applications with a
            strong focus on maintainability, modular design, and predictable
            system behavior. My recent work spans Java, Spring Boot, REST APIs,
            MQTT-based messaging, Keycloak/JWT/RBAC security, PostgreSQL,
            Docker, and CI/CD.
          </p>
          <p className="paragraph">
            I have worked across enterprise and R&amp;D environments,
            contributing to backend systems, frontend features, deployments,
            system hardening, and cross-functional delivery.
          </p>
        </section>

        <section id="experience" className="section">
          <h2 className="section-title">Experience</h2>
          <p className="paragraph">
            <strong>European Dynamics</strong> — Java Software Engineer —
            12/2022 to Present
          </p>
          <p className="paragraph">
            <strong>Nordeus d.o.o.</strong> — Junior C# Developer — 01/2020 to
            08/2021
          </p>
          <p className="paragraph">
            <strong>Robert Bosch GmbH</strong> — Coordinator — 03/2019 to
            12/2022
          </p>
        </section>

        <section id="projects" className="section">
          <h2 className="section-title">Selected Projects</h2>
          <div className="project-grid">
            <article className="card">
              <h3 className="card-title">EnerShare Platform</h3>
              <p className="card-text">
                Secure and scalable REST APIs for energy data exchange with
                modular backend design, authentication mechanisms, and
                PostgreSQL integrations.
              </p>
            </article>
            <article className="card">
              <h3 className="card-title">Resonance Platform</h3>
              <p className="card-text">
                Backend services and REST APIs integrating MQTT-based messaging,
                marketplace features, and real-time data flows.
              </p>
            </article>
            <article className="card">
              <h3 className="card-title">UnderSec</h3>
              <p className="card-text">
                Secure MQTT messaging platform with Keycloak authentication and
                Dockerized services for telemetry ingestion and risk assessment.
              </p>
            </article>
            <article className="card">
              <h3 className="card-title">Tenacity RMT</h3>
              <p className="card-text">
                UI redesign with dynamic filtering, reporting, and data
                visualization tools for risk and pattern analysis.
              </p>
            </article>
            <article className="card">
              <h3 className="card-title">Gym App</h3>
              <p className="card-text">
                Full-stack application built with React, Next.js, and
                TypeScript, using React Query, Ant Design, CI/CD via GitHub
                Actions, and Jest testing.
              </p>
            </article>
            <article className="card">
              <h3 className="card-title">MQTT Orchestrator</h3>
              <p className="card-text">
                Backend orchestration service for MQTT-based workflows,
                integrating messaging patterns, external services, and
                event-driven processing.
              </p>
            </article>
          </div>
        </section>

        <section id="skills" className="section">
          <h2 className="section-title">Skills</h2>
          <p className="paragraph">
            Java, Spring Boot, Microservices, REST APIs, Node.js, Next.js,
            React, TypeScript, JavaScript, Angular, PostgreSQL, Hibernate/JPA,
            MySQL, MongoDB, Keycloak, JWT, RBAC, Spring Security, MQTT, Docker,
            Jenkins, GitHub Actions, Git, Linux, Jest.
          </p>
        </section>

        <section id="contact" className="section">
          <h2 className="section-title">Contact</h2>
          <p className="paragraph">
            Email:{" "}
            <a href="mailto:vuk.topalovic@gmail.com">vuk.topalovic@gmail.com</a>
          </p>
          <p className="paragraph">
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/vuktopalovic"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/vuktopalovic
            </a>
          </p>
          <p className="paragraph">
            GitHub:{" "}
            <a
              href="https://github.com/vukkt"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/vukkt
            </a>
          </p>
          <p className="paragraph">Belgrade, Serbia</p>
        </section>

        <footer className="footer">© 2026 Vuk Topalović</footer>
      </main>
    </div>
  );
}
