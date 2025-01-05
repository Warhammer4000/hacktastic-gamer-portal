import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnologyStacksTab } from "./components/technology/TechnologyStacksTab";
import { PartnersTab } from "./components/partners/PartnersTab";
import { FAQTab } from "./components/faq/FAQTab";
import { PrivacyPolicyTab } from "./components/privacy/PrivacyPolicyTab";
import { TermsAndConditionsTab } from "./components/terms/TermsAndConditionsTab";
import { SocialMediaTab } from "./components/social/SocialMediaTab";

const Platform = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Settings</h1>
      
      <Tabs defaultValue="technology" className="w-full">
        <TabsList>
          <TabsTrigger value="technology">Technology Stacks</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="technology">
          <TechnologyStacksTab />
        </TabsContent>
        
        <TabsContent value="partners">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaTab />
        </TabsContent>

        <TabsContent value="faq">
          <FAQTab />
        </TabsContent>

        <TabsContent value="terms">
          <TermsAndConditionsTab />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacyPolicyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Platform;