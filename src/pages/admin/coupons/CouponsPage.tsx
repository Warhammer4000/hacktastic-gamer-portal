import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorsTab } from "./components/vendors/VendorsTab";
import { BatchesTab } from "./components/batches/BatchesTab";
import { CouponsTab } from "./components/coupons/CouponsTab";

const CouponsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coupon Management</h1>
      
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <VendorsTab />
        </TabsContent>
        
        <TabsContent value="batches">
          <BatchesTab />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CouponsPage;