import { motion } from "framer-motion";
import { Code, Users, Trophy } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Code,
      title: "Learn & Grow",
      description: "Gain XP points as you participate, complete challenges, and help others.",
    },
    {
      icon: Users,
      title: "Find Your Team",
      description: "Connect with like-minded developers and form the perfect team.",
    },
    {
      icon: Trophy,
      title: "Compete & Win",
      description: "Participate in exciting hackathons and win amazing prizes.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Why Choose HackathonHub?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience a new way of participating in hackathons with our
            gamified platform designed for growth and collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}