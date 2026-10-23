"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/validations";
import { cn } from "@/lib/utils";

/** Daftar baris yang dapat diurutkan dengan drag-and-drop (bidang usaha, slider, armada). */
/**
 * `items[].content` berupa ReactNode yang sudah dirender di server, sehingga komponen ini
 * dapat dipakai langsung dari Server Component (fungsi render tidak bisa melewati batas server→client).
 */
export function SortableRows({
  items: initial,
  onReorder,
}: {
  items: { id: number; content: ReactNode }[];
  onReorder: (ids: number[]) => Promise<ActionResult>;
}) {
  const [items, setItems] = useState(initial);
  const [, start] = useTransition();
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setItems(initial);
  }
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const next = arrayMove(
      items,
      items.findIndex((i) => i.id === e.active.id),
      items.findIndex((i) => i.id === e.over!.id),
    );
    const prev = items;
    setItems(next);
    start(async () => {
      const r = await onReorder(next.map((i) => i.id));
      if (r.ok) toast.success(r.message ?? "Urutan tersimpan.");
      else {
        toast.error(r.error);
        setItems(prev);
      }
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {items.map((item) => (
            <Row key={item.id} id={item.id}>
              {item.content}
            </Row>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function Row({ id, children }: { id: number; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 bg-card p-3 sm:p-4",
        isDragging && "relative z-10 shadow-xl ring-2 ring-primary",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Seret untuk mengubah urutan"
        className="grid size-8 shrink-0 cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-secondary active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{children}</div>
    </li>
  );
}
