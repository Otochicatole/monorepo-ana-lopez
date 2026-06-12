export interface MediaFileEntity {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: unknown;
  hash: string | null;
  ext: string | null;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  providerMetadata: unknown;
  focalPoint: unknown;
  createdAt: Date;
  updatedAt: Date;
}
