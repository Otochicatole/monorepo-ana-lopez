import { prisma } from "@/shared/infrastructure/prisma";
import { GetAboutContent } from "../application/get-about-content";
import { GetGalleryTypeWithItems } from "../application/get-gallery-type-with-items";
import { GetHomeContent } from "../application/get-home-content";
import { ListGalleryItems } from "../application/list-gallery-items";
import { ListGalleryTypes } from "../application/list-gallery-types";
import { PrismaContentReadRepository } from "./prisma-content-read-repository";

const repository = new PrismaContentReadRepository(prisma);

export const contentUseCases = {
  getHomeContent: new GetHomeContent(repository),
  getAboutContent: new GetAboutContent(repository),
  listGalleryItems: new ListGalleryItems(repository),
  listGalleryTypes: new ListGalleryTypes(repository),
  getGalleryTypeWithItems: new GetGalleryTypeWithItems(repository),
};

