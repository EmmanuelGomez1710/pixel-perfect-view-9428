import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Flower2,
  Heart,
  Instagram,
  Menu,
  MessageCircle,
  Package,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BouquetConfigurator } from "@/components/BouquetConfigurator";
import { INSTAGRAM_URL, whatsappLink } from "@/config/contact";
import { Button } from "@/components/ui/button";
import beePetalsLogo from "@/assets/bee-petals-logo.png";
import heroAsset from "@/assets/bee-petals-hero.png";
import storyAsset from "@/assets/ramo-rosa-artesanal.jpeg";
import collectionAsset from "@/assets/coleccion-bee-petals.jpeg";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bee Petals | Ramos hechos para contar historias" },
      {
        name: "description",
        content: "Ramos personalizados y detalles florales hechos a mano por Bee Petals.",
      },
      { property: "og:title", content: "Bee Petals | Ramos hechos para contar historias" },
      {
        property: "og:description",
        content: "Ramos personalizados y detalles florales hechos a mano por Bee Petals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BeePetalsPage,
});

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#inicio" className="brand-mark" aria-label="Bee Petals, inicio">
      <span className="brand-icon">
        <img
          src={beePetalsLogo}
          alt="Logo de Bee Petals"
          className="brand-logo"
        />
      </span>
      <span>
        <strong>BEE PETALS</strong>
        {!compact && <small>Arma tu ramo. Crea tu historia.</small>}
      </span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Navegación principal">
        <BrandMark compact />
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          <a href="#historia" onClick={() => setOpen(false)}>Nuestra historia</a>
          <a href="#detalles" onClick={() => setOpen(false)}>Ramos</a>
          <a href="#proceso" onClick={() => setOpen(false)}>Cómo funciona</a>
          <a href="#configurador" onClick={() => setOpen(false)}>Contacto</a>
          <Button asChild className="nav-cta"><a href="#configurador" onClick={() => setOpen(false)}>Armar mi ramo</a></Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>
    </header>
  );
}

function BeePetalsPage() {

  useEffect(() => {
    const root = document.documentElement;
    const setY = () => root.style.setProperty("--scroll-y", `${window.scrollY}px`);
    setY();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", setY, { passive: true });
      return () => window.removeEventListener("scroll", setY);
    }

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let started = false;

    const loop = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const progress = Math.min(1, Math.max(0, y / max));
      root.style.setProperty("--scroll-y", `${y}px`);
      root.style.setProperty("--scroll-progress", progress.toFixed(4));

      let tx = 50 + 30 * Math.sin(progress * Math.PI * 2.4 - 1.1) - 24 * Math.sin(progress * Math.PI * 5.5);
      let ty = 14 + 66 * progress + 5 * Math.sin(progress * Math.PI * 7);
      let ease = 0.06;

      document.querySelectorAll<HTMLElement>(".parallax-photo, .feature-photo, .hero-photo").forEach((el) => {
        const r = el.getBoundingClientRect();
        const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (overlap > vh * 0.45 && r.width > 0) {
          tx = ((r.left + r.width * 0.7) / (window.innerWidth || 1)) * 100;
          ty = ((r.top + r.height * 0.24) / vh) * 100;
          ease = 0.012;
        }
      });

      if (!started) {
        cx = tx;
        cy = ty;
        started = true;
      }
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      root.style.setProperty("--bee-x", `${cx.toFixed(2)}vw`);
      root.style.setProperty("--bee-y", `${cy.toFixed(2)}vh`);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div id="inicio" className="bee-page">
      <div className="flying-bee" aria-hidden="true"><span>✦</span></div>
      <Navigation />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-photo">
            <img src={heroAsset} alt="Ramo de rosas rosas artesanales Bee Petals iluminado por luz cálida" />
          </div>
          <div className="hero-wash" />
          <div className="hero-copy">
            <Reveal>
              <h1 id="hero-title">BEE PETALS</h1>
              <p className="hero-tagline">Arma tu ramo.<br />Crea tu historia.</p>
              <Button asChild size="lg" className="editorial-button">
                <a href="#configurador">Armar mi ramo <ArrowRight /></a>
              </Button>
            </Reveal>
          </div>
          <a className="scroll-cue" href="#historia" aria-label="Ir a nuestra historia"><ChevronDown /></a>
        </section>

        <section id="historia" className="manifesto-section section-pad">
          <div className="section-inner">
            <Reveal className="manifesto-heading">
              <p className="eyebrow">Hecho a mano, pensado para regalar algo especial</p>
              <h2><span>✿</span> DETALLES QUE<br />HABLAN POR TI</h2>
            </Reveal>
            <div className="story-grid">
              <Reveal className="story-card">
                <Flower2 className="line-flower" aria-hidden="true" />
                <h3>Hecho a mano,<br />pensado para perdurar.</h3>
                <p>Cada pétalo cuenta una historia.</p>
                <ul>
                  <li><Heart /> Hecho a mano</li>
                  <li><Package /> Personalizable</li>
                  <li><Sparkles /> Creado con detalle</li>
                </ul>
                <a className="text-link" href="#configurador">Conoce más <ArrowRight /></a>
              </Reveal>
              <Reveal className="story-photo-shell" delay={140}>
                <div className="parallax-photo">
                  <img src={storyAsset} alt="Ramo artesanal de tulipanes y lirios rosas" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="detalles" className="feature-section section-pad">
          <div className="section-inner feature-grid">
            <Reveal className="feature-photo">
              <img src={collectionAsset} alt="Colección de ramos artesanales Bee Petals bajo un cielo azul" loading="lazy" />
            </Reveal>
            <Reveal className="feature-copy" delay={120}>
              <p className="eyebrow">Detalles hechos a mano</p>
              <h2>HECHO PARA<br />SORPRENDER</h2>
              <p>Cada ramo nace de una idea y se convierte en un detalle hecho especialmente para ti.</p>
              <Button asChild size="lg" className="editorial-button"><a href="#configurador">Armar mi ramo <ArrowRight /></a></Button>
              <span className="petal petal-one" aria-hidden="true" />
              <span className="petal petal-two" aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        <section id="proceso" className="process-section section-pad">
          <div className="section-inner">
            <Reveal className="center-heading">
              <p className="eyebrow">Un detalle tan único como su historia</p>
              <h2>CREA ALGO ESPECIAL</h2>
            </Reveal>
            <div className="steps-grid">
              {[
                ["01", "Cuéntanos tu idea", "Comparte la ocasión, los colores y la emoción que quieres regalar."],
                ["02", "Elige los detalles", "Personaliza cada elemento para que el ramo hable por ti."],
                ["03", "Nosotras lo creamos", "Armamos tu detalle a mano, con cuidado y mucha intención."],
              ].map(([number, title, copy], index) => (
                <Reveal className="step" delay={index * 110} key={number}>
                  <span>{number}</span><Flower2 /><h3>{title}</h3><p>{copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="configurador" className="configurator-section section-pad" aria-labelledby="config-title">
          <div className="section-inner">
            <Reveal className="center-heading">
              <p className="eyebrow">Arma tu ramo paso a paso</p>
              <h2 id="config-title">🌸 CUÉNTANOS QUÉ QUIERES CREAR</h2>
            </Reveal>
            <Reveal delay={100}>
              <BouquetConfigurator />
            </Reveal>
          </div>
        </section>

        <section className="quote-band">
          <Reveal>
            <Flower2 aria-hidden="true" />
            <blockquote>“Más que flores,<br /><em>historias que florecen.</em>”</blockquote>
          </Reveal>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <BrandMark />
            <div className="socials" aria-label="Redes sociales">
              <a
                href={INSTAGRAM_URL || "#configurador"}
                aria-label="Instagram"
                {...(INSTAGRAM_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Instagram />
              </a>
              <a
                href={whatsappLink("Hola, Bee Petals. Me gustaría más información.")}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />
              </a>
            </div>
          </div>
          <div className="footer-col"><h3>Navegación</h3><a href="#inicio">Inicio</a><a href="#historia">Nuestra historia</a><a href="#proceso">Cómo funciona</a><a href="#configurador">Contacto</a></div>
          <div className="footer-col"><h3>Productos</h3><a href="#detalles">Ramos personalizados</a><a href="#detalles">Ramos de flores</a><a href="#detalles">Regalos</a></div>
          <div className="footer-col"><h3>Ayuda</h3><a href="#configurador">Preguntas frecuentes</a><a href="#configurador">Pedidos</a><a href="#configurador">WhatsApp</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Bee Petals. Todos los derechos reservados.</span><span>✿ &nbsp; HECHO CON AMOR EN MÉXICO</span></div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsappLink("Hola, Bee Petals. Me gustaría más información.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribirnos por WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </a>
    </div>
  );
}