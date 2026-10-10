import { ArrowLeft, ArrowRight, Flower2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { BouquetAnswers, buildBouquetMessage, whatsappAppLink, whatsappWebLink } from "@/config/contact";

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

const FLORES = ["Rosas", "Tulipanes", "Gerberas", "Lirios", "Girasoles", "Peonías"];

type StepKey = (typeof STEPS)[number]["key"] | "flores";

interface Step {
  key: StepKey;
  title: string;
  options: readonly string[];
}

const FLOWERS_STEP: Step = {
  key: "flores",
  title: "¿Qué flores lleva tu ramo?",
  options: FLORES,
};

export function BouquetConfigurator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<BouquetAnswers>({});

  const steps: Step[] = answers.estilo?.includes("Mixto")
    ? [...STEPS.slice(0, 2), FLOWERS_STEP, ...STEPS.slice(2)]
    : [...STEPS];

  const isSummary = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)]!;
  const isFlowersStep = current.key === "flores";
  const selectedFlores = answers.flores ?? [];

  const choose = (value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [current.key]: value } as BouquetAnswers;
      if (current.key === "estilo" && !value.includes("Mixto")) delete next.flores;
      return next;
    });
    setStep((s) => s + 1);
  };

  const toggleFlor = (flor: string) => {
    setAnswers((prev) => {
      const flores = prev.flores ?? [];
      const next = flores.includes(flor) ? flores.filter((f) => f !== flor) : [...flores, flor];
      return { ...prev, flores: next };
    });
  };

  const message = buildBouquetMessage(answers);

  return (
    <div className="configurator">
      <ol className="config-progress" aria-label="Progreso">
        {steps.map((s, index) => (
          <li key={s.key} className={index <= step ? "is-done" : ""}>
            <span>{index + 1}</span>
          </li>
        ))}
      </ol>

      {isSummary ? (
        <div className="config-step config-summary">
          <Flower2 aria-hidden="true" />
          <h3>💐 Tu idea de ramo</h3>
          <dl>
            <div><dt>Ocasión</dt><dd>{answers.ocasion ?? "—"}</dd></div>
            <div><dt>Estilo</dt><dd>{answers.estilo ?? "—"}</dd></div>
            {selectedFlores.length > 0 && (
              <div><dt>Tipo de flores</dt><dd>{selectedFlores.join(", ")}</dd></div>
            )}
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
      ) : isFlowersStep ? (
        <div className="config-step" key="flores">
          <p className="eyebrow">Paso {step + 1} de {steps.length}</p>
          <h3>{current.title}</h3>
          <div className="config-options">
            {FLORES.map((flor) => (
              <button
                type="button"
                key={flor}
                className={`config-option ${selectedFlores.includes(flor) ? "is-active" : ""}`}
                aria-pressed={selectedFlores.includes(flor)}
                onClick={() => toggleFlor(flor)}
              >
                {flor}
              </button>
            ))}
          </div>
          <Button
            type="button"
            size="lg"
            className="editorial-button"
            disabled={selectedFlores.length === 0}
            onClick={() => setStep((s) => s + 1)}
          >
            Continuar <ArrowRight />
          </Button>
          <button type="button" className="config-back" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft /> Volver
          </button>
        </div>
      ) : (
        <div className="config-step" key={current.key}>
          <p className="eyebrow">Paso {step + 1} de {steps.length}</p>
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
      )}
    </div>
  );
}
