import type { ComponentProps } from "react";

import type { StrictOmit } from "@/types/helpers";

import { useFormContext } from "@/lib/form/contexts";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps extends StrictOmit<
  ComponentProps<typeof Button>,
  "disabled" | "form" | "type"
> {
  submitText?: string;
  submittingText?: string;
}

export function SubmitButton({
  submitText = "Submit",
  submittingText = "Submitting...",
  ...props
}: SubmitButtonProps) {
  const formContext = useFormContext();

  return (
    <formContext.Subscribe
      selector={(state) => ({
        isPristine: state.isPristine,
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ isPristine, canSubmit, isSubmitting }) => (
        <Button
          disabled={isPristine || !canSubmit || isSubmitting}
          form={formContext.formId}
          type="submit"
          {...props}
        >
          {isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" /> {submittingText}{" "}
            </>
          ) : (
            submitText
          )}
        </Button>
      )}
    </formContext.Subscribe>
  );
}
