import { PublicLocale } from "@/shared/domain/locale";
import { MediaFileEntity } from "./media";

export interface AboutContentEntity {
  id: number;
  locale: PublicLocale;
  text1: string | null;
  image1: MediaFileEntity | null;
  text2: string | null;
  image2: MediaFileEntity | null;
  text3: string | null;
  image3: MediaFileEntity | null;
  createdAt: Date;
  updatedAt: Date;
}
