import { PublicLocale } from "@/shared/domain/locale";
import { ContentReadRepository } from "./content-read-repository";

export class GetHomeContent {
  constructor(private readonly repository: ContentReadRepository) {}

  execute(locale: PublicLocale) {
    return this.repository.findHome(locale);
  }
}

