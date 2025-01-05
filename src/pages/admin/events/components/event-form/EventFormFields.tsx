import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { BasicInfoFields } from "./BasicInfoFields";
import { TechStackField } from "./TechStackField";
import { RolesField } from "./RolesField";
import { DateTimeFields } from "./DateTimeFields";

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  return (
    <>
      <BasicInfoFields form={form} />
      <TechStackField form={form} />
      <RolesField form={form} />
      <DateTimeFields form={form} />
    </>
  );
}