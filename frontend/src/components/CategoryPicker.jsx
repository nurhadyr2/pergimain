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
            className={`pix-chip ${active ? 'pix-chip-on' : ''}`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
