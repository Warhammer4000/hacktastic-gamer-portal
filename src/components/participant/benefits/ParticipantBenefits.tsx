import { Card } from "@/components/ui/card";
import { Gift, Award, Trophy } from "lucide-react";

export function ParticipantBenefits() {
  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Access to special rewards and perks for active participants.",
    },
    {
      icon: Award,
      title: "Skill Development",
      description: "Opportunities to learn and grow through hands-on experience.",
    },
    {
      icon: Trophy,
      title: "Recognition",
      description: "Get recognized for your achievements and contributions.",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{benefit.title}</h3>
          </div>
          <p className="text-muted-foreground">{benefit.description}</p>
        </Card>
      ))}
    </div>
  );
}