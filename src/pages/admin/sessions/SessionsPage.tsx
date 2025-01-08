import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SessionListView } from "./components/SessionListView";
import { SessionForm } from "./components/session-form/SessionForm";
import { Session } from "./types/session-form";

export function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<Session | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <SessionListView onEditSession={handleEditSession} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <SessionForm
            sessionToEdit={selectedSession}
            onComplete={() => {
              setIsDialogOpen(false);
              setSelectedSession(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}