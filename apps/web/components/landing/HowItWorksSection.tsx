import { ClipboardCheck, FileText, Sprout } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: ClipboardCheck,
      title: "Complete Your Assessment",
      description: "Answer a few questions about your space, location, and daily reality.",
    },
    {
      number: 2,
      icon: FileText,
      title: "See Where Your Approach Leads",
      description: "Understand whether your current inputs are aligned, inconsistent, or misapplied.",
    },
    {
      number: 3,
      icon: Sprout,
      title: "Explore with Guidance",
      description: "Use the system to decide what to keep, change, or leave alone.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-6 bg-card border border-border rounded-lg"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
