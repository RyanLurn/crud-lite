export function formatErrorMessage<
  TAction extends string,
  TReason extends string = "an unexpected error",
>({
  action,
  reason,
}: {
  action: TAction;
  reason: TReason;
}): `Failed to ${TAction} because of ${TReason}.` {
  return `Failed to ${action} because of ${reason}.`;
}
