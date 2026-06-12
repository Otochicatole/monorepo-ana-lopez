import { PaginationInput } from "@/shared/domain/pagination";
import { PublicLocale } from "@/shared/domain/locale";
import { ContentReadRepository } from "./content-read-repository";

export class ListGalleryItems {
  constructor(private readonly repository: ContentReadRepository) {}

  execute(input: {
    pagination: PaginationInput;
    galleryTypeDocumentId?: string;
    locale?: PublicLocale;
  }) {
    return this.repository.listGalleryItems(input);
  }
}

