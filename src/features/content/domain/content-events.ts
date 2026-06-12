import { DomainEvent } from "@/shared/domain/domain-event";
import { PublicLocale } from "@/shared/domain/locale";

export type ContentReadEvent = DomainEvent<{
  entity: "home" | "about" | "gallery" | "gallery-type";
  locale?: PublicLocale;
}>;

export function contentRead(
  entity: ContentReadEvent["payload"]["entity"],
  locale?: PublicLocale
): ContentReadEvent {
  return {
    name: "ContentRead",
    occurredAt: new Date(),
    payload: { entity, locale },
  };
}

