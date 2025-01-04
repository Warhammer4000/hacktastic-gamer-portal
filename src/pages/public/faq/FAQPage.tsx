import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  })).filter(category => category.faq_items.length > 0);

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
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredCategories?.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
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
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}