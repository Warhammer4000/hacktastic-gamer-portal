import { useState } from "react";
import { AddPartner } from "./AddPartner";
import { PartnersList } from "./PartnersList";

export const PartnersTab = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Partners</h2>
        <AddPartner open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
      <PartnersList />
    </div>
  );
};