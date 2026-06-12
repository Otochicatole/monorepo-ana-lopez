import { PublicLocale } from "@/shared/domain/locale";
import { MediaFileEntity } from "./media";

export interface HomeContentEntity {
  id: number;
  locale: PublicLocale;
  about: string;
  imageAbout: MediaFileEntity;
  createdAt: Date;
  updatedAt: Date;
}
