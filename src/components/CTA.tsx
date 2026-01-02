import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTA = () => {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Full feature access",
    "Dedicated support"
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl bg-card border border-border p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Ready to Transform Your{" "}
                <span className="text-gradient">Educational Institution?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of institutions already using EduAI to automate attendance, 
                track engagement, and improve student outcomes.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg glow-effect"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border hover:bg-card px-8 py-6 text-lg"
                >
                  Schedule Demo
                </Button>
              </div>

              {/* Contact Info */}
              <p className="mt-6 text-sm text-muted-foreground">
                Questions? Contact us at{" "}
                <a href="mailto:hello@eduai.com" className="text-primary hover:underline">
                  hello@eduai.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;