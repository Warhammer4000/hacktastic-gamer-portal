import { ParticipantBenefits } from "@/components/participant/benefits/ParticipantBenefits";

export default function Benefits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Benefits</h1>
        <p className="text-muted-foreground">
          Explore your exclusive participant benefits and rewards.
        </p>
      </div>
      
      <ParticipantBenefits />
    </div>
  );
}