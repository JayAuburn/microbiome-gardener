import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Start?
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          Create your account to see where your current approach stands.
        </p>

        <Button
          size="lg"
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg mb-4"
        >
          <Link href="/assessment">
            Take Free Assessment
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          Not sure which tier? Take the 5-minute assessment for personalized recommendation.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
