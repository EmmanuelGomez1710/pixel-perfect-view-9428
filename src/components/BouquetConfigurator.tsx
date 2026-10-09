import { ArrowLeft, ArrowRight, Flower2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { buildBouquetMessage, whatsappAppLink, whatsappWebLink } from "@/config/contact";

const STEPS = [
  {
    key: "ocasion",
    title: "¿Para qué ocasión?",
    options: ["🎂 Cumpleaños", "💕 Aniversario", "🎓 Graduación", "💐 Otra"],
  },
  {
    key: "estilo",
    title: "¿Qué estilo quieres?",
    options: ["🌹 Rosas de listón", "🌸 Flores de limpiapipas", "🎀 Mixto"],
  },
  {
    key: "colores",
    title: "¿Qué colores imaginas?",
    options: ["Rosa", "Crema", "Blanco", "Personalizado"],
  },
  {
    key: "tamano",
    title: "¿Cuántas flores aproximadamente?",
    options: ["Pequeño", "Mediano", "Grande", "Quiero cotizar"],
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export function BouquetConfigurator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<StepKey, string>>>({});

  const isSummary = step === STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)]!;

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStep((s) => s + 1);
  };

  const message = buildBouquetMessage(answers);

  return (
    <div className="configurator">
      <ol className="config-progress" aria-label="Progreso">
        {STEPS.map((s, index) => (
          <li key={s.key} className={index <= step ? "is-done" : ""}>
            <span>{index + 1}</span>
          </li>
        ))}
      </ol>

      {!isSummary ? (
        <div className="config-step" key={current.key}>
          <p className="eyebrow">Paso {step + 1} de {STEPS.length}</p>
          <h3>{current.title}</h3>
          <div className="config-options">
            {current.options.map((option) => (
              <button
                type="button"
                key={option}
                className={`config-option ${answers[current.key] === option ? "is-active" : ""}`}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" className="config-back" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Volver
            </button>
          )}
        </div>
      ) : (
        <div className="config-step config-summary">
          <Flower2 aria-hidden="true" />
          <h3>💐 Tu idea de ramo</h3>
          <dl>
            <div><dt>Ocasión</dt><dd>{answers.ocasion ?? "—"}</dd></div>
            <div><dt>Estilo</dt><dd>{answers.estilo ?? "—"}</dd></div>
            <div><dt>Colores</dt><dd>{answers.colores ?? "—"}</dd></div>
            <div><dt>Tamaño</dt><dd>{answers.tamano ?? "—"}</dd></div>
          </dl>
          <Button asChild size="lg" className="editorial-button">
            <a
              href={whatsappWebLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                // En teléfonos se abre directamente la app de WhatsApp (sin redirecciones)
                const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
                if (isMobile) {
                  event.preventDefault();
                  window.location.href = whatsappAppLink(message);
                }
              }}
            >
              Cotizar mi ramo <ArrowRight />
            </a>
          </Button>
          <button type="button" className="config-back" onClick={() => { setStep(0); setAnswers({}); }}>
            <RotateCcw /> Empezar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
