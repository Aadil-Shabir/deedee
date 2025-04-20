interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex gap-2">
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => onStepClick(step.id)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentStep === step.id
              ? "bg-primary text-white"
              : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
          }`}
          type="button"
        >
          Step {step.id}
        </button>
      ))}
    </div>
  );
} 