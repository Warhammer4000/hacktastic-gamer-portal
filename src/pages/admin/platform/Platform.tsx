import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnologyStacksTab } from "./components/technology/TechnologyStacksTab";
import { PartnersTab } from "./components/partners/PartnersTab";

const Platform = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Settings</h1>
      
      <Tabs defaultValue="technology" className="w-full">
        <TabsList>
          <TabsTrigger value="technology">Technology Stacks</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="technology">
          <TechnologyStacksTab />
        </TabsContent>
        
        <TabsContent value="partners">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="terms">
          <div className="text-muted-foreground">
            Terms & Conditions management coming soon...
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="text-muted-foreground">
            Privacy Policy management coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Platform;