import { MentorBenefits } from "@/components/mentor/benefits/MentorBenefits";

export default function MentorDashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to your mentor dashboard!</p>
      
      <MentorBenefits />
    </div>
  );
}