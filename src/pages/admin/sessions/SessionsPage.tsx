import { useState } from "react";
import { SessionListView } from "./components/SessionListView";
import { SessionForm } from "./components/session-form/SessionForm";
import { Session } from "./types/session-form";

export function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<Session | undefined>();

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="order-2 md:order-1">
          <SessionForm
            sessionToEdit={selectedSession}
            onComplete={() => {
              setSelectedSession(undefined);
            }}
          />
        </div>
        <div className="order-1 md:order-2">
          <SessionListView onEditSession={handleEditSession} />
        </div>
      </div>
    </div>
  );
}