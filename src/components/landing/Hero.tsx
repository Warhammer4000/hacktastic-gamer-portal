import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-primary mb-4">Join the Innovation</span>
          <h1 className="heading-xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Where Innovation Meets Competition
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our thriving community of developers, designers, and innovators.
            Participate in exciting hackathons, learn from mentors, and level up your skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}