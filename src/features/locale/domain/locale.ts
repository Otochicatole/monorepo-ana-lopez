import { Locale } from "@prisma/client";

export type LocaleEntity = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
};

export function mapLocale(record: Locale): LocaleEntity {
  return {
    id: record.id,
    code: record.code,
    name: record.name,
    isDefault: record.isDefault,
    isActive: record.isActive,
    sortOrder: record.sortOrder,
  };
}
