import type { ComponentProps } from "react";

import type { StrictOmit } from "@/types/helpers";

import { FieldError, FieldLabel, Field } from "@/components/ui/field";
import { useFieldContext } from "@/lib/form/contexts";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends StrictOmit<
  ComponentProps<typeof Input>,
  "aria-invalid" | "onChange" | "onBlur" | "value" | "name" | "id"
> {
  label: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        name={field.name}
        id={field.name}
        {...props}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
