import { useState } from "react";
import { ArrowRight } from "lucide-react";
import RegisterDialog from "@/pages/auth/RegisterDialog";

export default function CTA() {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  return (
    <section className="bg-gradient-to-r from-primary to-secondary py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="heading-lg mb-6">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our community today and take your first step towards becoming a
          hackathon champion.
        </p>
        <button
          onClick={() => setShowRegisterDialog(true)}
          className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
      <RegisterDialog 
        isOpen={showRegisterDialog} 
        onClose={() => setShowRegisterDialog(false)} 
      />
    </section>
  );
}