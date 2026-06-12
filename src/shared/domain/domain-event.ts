export interface DomainEvent<TPayload extends Record<string, unknown>> {
  name: string;
  occurredAt: Date;
  payload: TPayload;
}

