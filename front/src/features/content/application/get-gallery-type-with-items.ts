import { PublicLocale } from "@/shared/domain/locale";
import { ContentReadRepository } from "./content-read-repository";

export class GetGalleryTypeWithItems {
  constructor(private readonly repository: ContentReadRepository) {}

  execute(input: { documentId: string; locale?: PublicLocale }) {
    return this.repository.findGalleryTypeWithItems(input);
  }
}

