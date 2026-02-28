"use client";

import { useState } from "react";
import type { Platform } from "@/lib/types";

interface NewContentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const PLATFORMS: Platform[] = [
  "Blue Octopus Blog",
  "Blue Octopus LinkedIn",
  "Blue Octopus X",
  "Blue Octopus YouTube",
  "UtilitarianTechnology YouTube",
  "OpenClaw Posts",
];

export default function NewContentModal({ open, onClose, onAdd }: NewContentModalProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("Blue Octopus Blog");
  const [priority, setPriority] = useState("Medium");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          platform,
          title: title.trim(),
          priority,
          source,
          notes,
        }),
      });
      if (res.ok) {
        setTitle("");
        setSource("");
        setNotes("");
        onAdd();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "rgba(6, 9, 15, 0.6)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.3)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 rounded-xl p-6"
        style={{
          background: "var(--bg-card-solid)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          New Content Piece
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={inputStyle}
              placeholder="Content title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={inputStyle}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={inputStyle}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={inputStyle}
              placeholder="Research source..."
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-muted)" }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              rows={2}
              style={inputStyle}
              placeholder="Notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold"
              style={{
                background: "transparent",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold"
              style={{
                background: "linear-gradient(135deg, var(--accent-blue), #1d4ed8)",
                color: "white",
                opacity: saving ? 0.5 : 1,
                boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)",
              }}
            >
              {saving ? "Adding..." : "Add Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
