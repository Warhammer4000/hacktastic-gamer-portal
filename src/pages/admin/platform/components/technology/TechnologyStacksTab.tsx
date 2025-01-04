import { AddTechnologyStack } from "./AddTechnologyStack";
import { TechnologyStackList } from "./TechnologyStackList";

export const TechnologyStacksTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Technology Stacks</h2>
        <AddTechnologyStack />
      </div>
      <TechnologyStackList />
    </div>
  );
};