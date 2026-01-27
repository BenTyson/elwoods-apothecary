'use client';

import { useState } from 'react';
import { slugify } from '@/lib/data';
import type { GatherContentType } from '@/types/gather-queue';

interface ManualEntryFormProps {
  type: GatherContentType;
  existingIds: Set<string>;
  onAdd: (id: string, name: string, type: GatherContentType) => void;
}

const typeLabels: Record<GatherContentType, string> = {
  plant: 'Plant',
  condition: 'Condition',
  remedy: 'Remedy',
  ingredient: 'Ingredient',
  preparation: 'Preparation',
  action: 'Action',
  term: 'Term',
  tea: 'Tea',
};

export function ManualEntryForm({ type, existingIds, onAdd }: ManualEntryFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }

    const id = slugify(trimmed);
    if (existingIds.has(id)) {
      setError(`"${trimmed}" is already in the queue`);
      return;
    }

    onAdd(id, trimmed, type);
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-sage">
        Add {typeLabels[type]}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder={`Enter ${typeLabels[type].toLowerCase()} name...`}
          className="flex-1 rounded-lg border border-moss bg-forest-900/50 px-3 py-2 text-sm text-cream placeholder-sage/50 outline-none transition-colors focus:border-amber"
        />
        <button
          type="submit"
          className="rounded-lg border border-moss bg-moss/30 px-4 py-2 text-sm font-medium text-cream transition-colors hover:border-amber hover:bg-amber/20 hover:text-amber"
        >
          Add
        </button>
      </div>
      {error && (
        <p className="text-xs text-womens">{error}</p>
      )}
    </form>
  );
}
