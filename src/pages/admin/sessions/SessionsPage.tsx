import { CreateSessionForm } from "./components/CreateSessionForm";
import { SessionListView } from "./components/SessionListView";

export default function SessionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CreateSessionForm />
        </div>
        <div>
          <SessionListView />
        </div>
      </div>
    </div>
  );
}