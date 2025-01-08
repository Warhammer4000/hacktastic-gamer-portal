import { useState } from "react";
import { CreateSessionForm } from "./components/CreateSessionForm";
import { SessionListView } from "./components/SessionListView";

export default function SessionsPage() {
  const [sessionToEdit, setSessionToEdit] = useState<any>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CreateSessionForm 
            sessionToEdit={sessionToEdit} 
            onComplete={() => setSessionToEdit(null)} 
          />
        </div>
        <div>
          <SessionListView onEditSession={setSessionToEdit} />
        </div>
      </div>
    </div>
  );
}