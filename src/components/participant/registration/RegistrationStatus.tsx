import { useEffect, useState } from "react";
import { useRegistrationSettings } from "@/hooks/useRegistrationSettings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export function RegistrationStatus({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useRegistrationSettings();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [registrationState, setRegistrationState] = useState<
    "closed" | "not-started" | "active" | "ended"
  >("closed");

  useEffect(() => {
    const checkRegistrationStatus = () => {
      if (!settings?.participant_registration_enabled) {
        setRegistrationState("closed");
        return;
      }

      const now = new Date().getTime();
      const startDate = settings.participant_registration_start 
        ? new Date(settings.participant_registration_start).getTime()
        : null;
      const endDate = settings.participant_registration_end
        ? new Date(settings.participant_registration_end).getTime()
        : null;

      // If no dates set but enabled, consider it active
      if (!startDate && !endDate) {
        setRegistrationState("active");
        return;
      }

      if (startDate && now < startDate) {
        setRegistrationState("not-started");
        const difference = startDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (endDate && now > endDate) {
        setRegistrationState("ended");
      } else {
        setRegistrationState("active");
        if (endDate) {
          const difference = endDate - now;
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }
      }
    };

    checkRegistrationStatus();
    const interval = setInterval(checkRegistrationStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [settings]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (registrationState === "closed" || registrationState === "ended") {
    return (
      <div className="container max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Registration Closed</h1>
        <p className="text-muted-foreground mb-6">
          Participant registration is currently not available.
        </p>
        <Button onClick={() => navigate("/")} variant="default">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (registrationState === "not-started") {
    return (
      <div className="container max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Registration Opens In</h1>
        <p className="text-2xl font-semibold text-primary mb-6">{timeLeft}</p>
        <p className="text-muted-foreground mb-6">
          Please check back when registration opens.
        </p>
        <Button onClick={() => navigate("/")} variant="default">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (registrationState === "active") {
    return (
      <div>
        {settings?.participant_registration_end && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Registration closes in: <span className="font-semibold">{timeLeft}</span>
            </p>
          </div>
        )}
        {children}
        <div className="text-center mt-6">
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return null;
}