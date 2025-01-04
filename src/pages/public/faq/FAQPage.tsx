import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQCategory {
  id: string;
  title: string;
  faq_items: FAQItem[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["faq-categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("faq_categories")
        .select(`
          id,
          title,
          faq_items (
            id,
            question,
            answer
          )
        `)
        .eq("status", "published")
        .order("sort_order");

      if (error) throw error;
      return categories as FAQCategory[];
    },
  });

  const filteredCategories = categories?.map(category => ({
    ...category,
    faq_items: category.faq_items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>

      <div className="relative max-w-xl mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={filteredCategories?.[0]?.id} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent h-auto p-0">
              {filteredCategories?.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {filteredCategories?.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faq_items.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="prose dark:prose-invert max-w-none">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {category.faq_items.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No FAQs found for this category
                      </p>
                    )}
                  </Accordion>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}