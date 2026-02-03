import { MapPin, Sprout, Network, Compass } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Customized to You",
      description: "Guidance that works within your location, space, and real-world constraints.",
    },
    {
      icon: Sprout,
      title: "Context-Aware Growing",
      description: "Growing guidance that accounts for climate, season, and scale — without generic plans.",
    },
    {
      icon: Network,
      title: "Whole-System Perspective",
      description: "Property ecosystem design using permaculture principles — water harvesting, food forests, regenerative design (Premium+)",
    },
    {
      icon: Compass,
      title: "Adaptive System Guidance",
      description: "Adjusts as conditions change, without adding unnecessary complexity.",
    },
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What You Get
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-lg hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
