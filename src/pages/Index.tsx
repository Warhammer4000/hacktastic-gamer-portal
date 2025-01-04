import { motion } from "framer-motion";
import { ArrowRight, Code, Users, Trophy, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-display font-bold text-primary">
              HackathonHub
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/mentors" className="nav-link">Mentors</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/news" className="nav-link">News</Link>
              <Link to="/gallery" className="nav-link">Gallery</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
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

        {/* Features Section */}
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
              {[
                {
                  icon: Code,
                  title: "Learn & Grow",
                  description:
                    "Gain XP points as you participate, complete challenges, and help others.",
                },
                {
                  icon: Users,
                  title: "Find Your Team",
                  description:
                    "Connect with like-minded developers and form the perfect team.",
                },
                {
                  icon: Trophy,
                  title: "Compete & Win",
                  description:
                    "Participate in exciting hackathons and win amazing prizes.",
                },
              ].map((feature, index) => (
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

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,000+", label: "Active Members" },
              { number: "50+", label: "Hackathons Hosted" },
              { number: "200+", label: "Projects Created" },
              { number: "100+", label: "Expert Mentors" },
            ].map((stat, index) => (
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="heading-lg mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community today and take your first step towards becoming a
              hackathon champion.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Join Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">HackathonHub</h3>
              <p className="text-gray-400">
                Where innovation meets competition. Join our community of developers
                and creators.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/mentors" className="hover:text-white transition-colors">
                    Mentors
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-white transition-colors">
                    News
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/guidelines" className="hover:text-white transition-colors">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HackathonHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;