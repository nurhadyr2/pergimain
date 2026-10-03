export default function CategoryPicker({ categories, selected, onToggle, disabled }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((c) => {
        const active = selected.includes(c.slug);
        return (
          <button
            key={c.slug}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(c.slug)}
            className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors
              ${active
                ? 'border-maroon-500 bg-maroon-500 text-gold-200'
                : 'border-ink-600 bg-ink-900 text-cream-300 hover:border-blush-300 hover:text-blush-200'}`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
