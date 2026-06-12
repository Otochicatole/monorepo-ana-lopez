"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Filter, Plus, Search, X } from "lucide-react";
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
} from "@/features/admin/application/admin-actions";
import {
  MediaPickerField,
  type MediaPickerItem,
} from "@/features/admin/presentation/components/media/media-picker-field";
import { PageHeader, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Field } from "../_components/form-fields";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { CustomSelect } from "@/shared/components/common/custom-select";
import { cn } from "@/features/admin/presentation/lib/cn";
import { CreateGalleryItemModal } from "./create-gallery-item-modal";

export type GalleryTypeOption = {
  id: number;
  documentId: string;
};

export type GalleryItemRow = {
  id: number;
  documentId: string;
  name: string | null;
  mediaId: number;
  galleryTypeId: number | null;
  galleryTypeDocumentId: string | null;
  createdAt: string;
  media: MediaPickerItem;
};

type GalleryItemsClientProps = {
  items: GalleryItemRow[];
  mediaItems: MediaPickerItem[];
  types: GalleryTypeOption[];
  suggestedDocumentId: string;
};

export function GalleryItemsClient({
  items,
  mediaItems,
  types,
  suggestedDocumentId,
}: GalleryItemsClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = items.filter((item) => {
      if (query) {
        const haystack = [
          item.documentId,
          item.name,
          item.media.name,
          item.galleryTypeDocumentId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      if (typeFilter === "none") {
        if (item.galleryTypeId) return false;
      } else if (typeFilter !== "all") {
        if (item.galleryTypeId !== Number(typeFilter)) return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return dateSort === "newest" ? diff : -diff;
    });

    return result;
  }, [items, search, typeFilter, dateSort]);

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    dateSort !== "newest";

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setDateSort("newest");
  }

  return (
    <div>
      <PageHeader
        title="Gallery Items"
        description="Neutral gallery entries shared across all locales."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Create item
          </Button>
        }
      />

      <CreateGalleryItemModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mediaItems={mediaItems}
        types={types}
        suggestedDocumentId={suggestedDocumentId}
      />

      {/* ── Search & filter toolbar ── */}
      <div className="mb-6 space-y-3">
        {/* Row 1: search + sort toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, document ID, media…"
              className="w-full rounded-xl border border-white/10 bg-neutral-900/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-pk/50 focus:outline-none focus:ring-2 focus:ring-pk/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-neutral-900/70 p-1">
            <button
              type="button"
              onClick={() => setDateSort("newest")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                dateSort === "newest"
                  ? "bg-pk text-neutral-950"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setDateSort("oldest")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                dateSort === "oldest"
                  ? "bg-pk text-neutral-950"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              Oldest
            </button>
          </div>
        </div>

        {/* Row 2: type filter + result count */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 shrink-0 text-white/40" aria-hidden />
            <CustomSelect
              size="sm"
              className="min-w-[160px]"
              placeholder="All types"
              value={typeFilter}
              onChange={(v) => setTypeFilter(v)}
              options={[
                { value: "all", label: "All types" },
                { value: "none", label: "No type" },
                ...types.map((type) => ({
                  value: String(type.id),
                  label: type.documentId,
                })),
              ]}
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Result count + clear */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">
              <span className="font-semibold text-white/70">{filteredItems.length}</span>
              {" / "}
              {items.length} items
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-white/20 hover:text-white"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="flex items-center gap-1.5 rounded-full border border-pk/30 bg-pk/10 px-2.5 py-1 text-xs text-pk">
                <Search className="h-3 w-3" />
                {search}
                <button onClick={() => setSearch("")} className="hover:text-white" aria-label="Remove search">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                <Filter className="h-3 w-3" />
                {typeFilter === "none" ? "No type" : types.find((t) => String(t.id) === typeFilter)?.documentId ?? typeFilter}
                <button onClick={() => setTypeFilter("all")} className="hover:text-white" aria-label="Remove type filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No gallery items yet"
          description="Upload media first, then create your first gallery item."
          action={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              Create item
            </Button>
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No items match your filters"
          description="Try adjusting the search text or type filter."
          action={
            <Button type="button" variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full shrink-0 bg-black/40">
                {item.media.url.startsWith("/") ? (
                  <Image
                    src={item.media.url}
                    alt={item.media.alternativeText || item.media.name}
                    fill
                    sizes="(min-width:1280px) 33vw,(min-width:640px) 50vw,100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/20 text-xs">
                    No preview
                  </div>
                )}
                {/* Type badge overlay */}
                {item.galleryTypeDocumentId && (
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                    {item.galleryTypeDocumentId}
                  </span>
                )}
              </div>

              <CardBody className="flex flex-col gap-4">
                {/* Meta */}
                <div>
                  <p className="truncate font-mono text-xs text-white/50">{item.documentId}</p>
                  {item.name && (
                    <p className="mt-0.5 truncate text-sm font-semibold text-white">{item.name}</p>
                  )}
                  <p className="mt-1 text-[11px] text-white/35">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Edit form */}
                <form action={createGalleryItemAction} className="space-y-3">
                  <input type="hidden" name="documentId" value={item.documentId} />
                  <Field label="Internal name">
                    <Input name="name" defaultValue={item.name || ""} placeholder="Optional label" />
                  </Field>
                  <Field label="Gallery type">
                    <CustomSelect
                      name="galleryTypeId"
                      size="sm"
                      placeholder="No type"
                      value={item.galleryTypeId != null ? String(item.galleryTypeId) : ""}
                      options={[
                        { value: "", label: "No type" },
                        ...types.map((type) => ({
                          value: String(type.id),
                          label: type.documentId,
                        })),
                      ]}
                    />
                  </Field>
                  <MediaPickerField
                    name="mediaId"
                    media={mediaItems}
                    defaultValue={item.mediaId}
                    required
                    label="Image"
                    changeButtonLabel="Change"
                  />
                  <Button type="submit" size="sm" className="w-full">
                    Save changes
                  </Button>
                </form>

                <ConfirmDeleteButton
                  action={deleteGalleryItemAction}
                  id={item.id}
                  itemName={item.name || item.documentId}
                  title="Delete gallery item?"
                  fullWidth
                />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
