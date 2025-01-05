import { MentorBenefits } from "@/components/mentor/benefits/MentorBenefits";

export default function Benefits() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Benefits</h1>
      <p className="text-muted-foreground mb-8">Explore your exclusive mentor benefits and rewards.</p>
      
      <MentorBenefits />
    </div>
  );
}