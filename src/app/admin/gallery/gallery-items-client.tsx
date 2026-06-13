"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Filter, ImageIcon, Plus, Search, X } from "lucide-react";
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
} from "@/features/admin/application/admin-actions";
import {
  MediaPickerField,
  type MediaPickerItem,
} from "@/features/admin/presentation/components/media/media-picker-field";
import { PageHeader, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { SubmitButton } from "@/features/admin/presentation/components/ui/submit-button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Field } from "../_components/form-fields";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { CustomSelect } from "@/shared/components/common/custom-select";
import { cn } from "@/features/admin/presentation/lib/cn";
import { buildImageUrl, isRenderableMediaUrl } from "@/core/http/build-image-url";
import { CreateGalleryItemModal } from "./create-gallery-item-modal";

export type GalleryTypeOption = { id: number; documentId: string };

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
};

/* ── Individual row with collapsible edit form ── */
function GalleryItemRow({
  item,
  mediaItems,
  types,
}: {
  item: GalleryItemRow;
  mediaItems: MediaPickerItem[];
  types: GalleryTypeOption[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="flex min-w-0 flex-col divide-y divide-white/[0.06]">
      {/* Summary row */}
      <div className="flex min-w-0 items-center gap-4 px-5 py-3">
        {/* Thumbnail */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/40">
          {isRenderableMediaUrl(item.media.url) ? (
            <Image
              src={buildImageUrl(item.media.url)}
              alt={item.media.alternativeText || item.media.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {item.name ?? <span className="italic text-white/40">Unnamed</span>}
          </p>
          <p className="truncate font-mono text-[11px] text-white/40">{item.documentId}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-white/30">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            {expanded ? (
              <><ChevronUp className="h-3.5 w-3.5" /> Close</>
            ) : (
              <><ChevronDown className="h-3.5 w-3.5" /> Edit</>
            )}
          </button>
          <ConfirmDeleteButton
            action={deleteGalleryItemAction}
            id={item.id}
            itemName={item.name || item.documentId}
            title="Delete gallery item?"
          />
        </div>
      </div>

      {/* Expanded edit form */}
      {expanded && (
        <div className="min-w-0 bg-white/[0.02] px-5 py-4">
          <form action={createGalleryItemAction} className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  ...types.map((t) => ({ value: String(t.id), label: t.documentId })),
                ]}
              />
            </Field>
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <MediaPickerField
                name="mediaId"
                media={mediaItems}
                defaultValue={item.mediaId}
                required
                label="Image"
                changeButtonLabel="Change"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <SubmitButton variant="secondary" size="sm">Save changes</SubmitButton>
            </div>
          </form>
        </div>
      )}
    </li>
  );
}

/* ── Main client component ── */
export function GalleryItemsClient({
  items,
  mediaItems,
  types,
}: GalleryItemsClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = items.filter((item) => {
      if (query) {
        const haystack = [item.documentId, item.name, item.media.name, item.galleryTypeDocumentId]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (typeFilter === "none") { if (item.galleryTypeId) return false; }
      else if (typeFilter !== "all") { if (item.galleryTypeId !== Number(typeFilter)) return false; }
      return true;
    });

    return result.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return dateSort === "newest" ? diff : -diff;
    });
  }, [items, search, typeFilter, dateSort]);

  const hasActiveFilters = search.trim() !== "" || typeFilter !== "all" || dateSort !== "newest";

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
            <Plus className="h-4 w-4" />
            Create item
          </Button>
        }
      />

      <CreateGalleryItemModal
        key={createOpen ? "open" : "closed"}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mediaItems={mediaItems}
        types={types}
      />

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="flex shrink-0 items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-white/40" />
            <CustomSelect
              size="sm"
              className="min-w-[150px]"
              placeholder="All types"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "all", label: "All types" },
                { value: "none", label: "No type" },
                ...types.map((t) => ({ value: String(t.id), label: t.documentId })),
              ]}
            />
          </div>

          {/* Sort */}
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-neutral-900/70 p-1">
            {(["newest", "oldest"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDateSort(v)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                  dateSort === v ? "bg-pk text-neutral-950" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Count + clear */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">
            <span className="font-semibold text-white/70">{filteredItems.length}</span>
            {" / "}{items.length} items
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:border-white/20 hover:text-white"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* List */}
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
        <Card>
          <CardHeader title={`${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}`} />
          <ul className="divide-y divide-white/10">
            {filteredItems.map((item) => (
              <GalleryItemRow
                key={item.id}
                item={item}
                mediaItems={mediaItems}
                types={types}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
