import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "@/lib/form/contexts";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
});
