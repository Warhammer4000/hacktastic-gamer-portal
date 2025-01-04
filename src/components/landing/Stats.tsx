import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { number: "1,000+", label: "Active Members" },
    { number: "50+", label: "Hackathons Hosted" },
    { number: "200+", label: "Projects Created" },
    { number: "100+", label: "Expert Mentors" },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
            }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-3xl font-bold text-primary mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}