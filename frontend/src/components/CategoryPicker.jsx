import { motion } from 'framer-motion';

export default function CategoryPicker({ categories, selected, onToggle, disabled }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {categories.map((c) => {
        const active = selected.includes(c.slug);
        return (
          <motion.button
            key={c.slug}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(c.slug)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors
              ${active
                ? 'bg-maroon-500 text-gold-200 ring-gold-400/60 shadow-card'
                : 'bg-ink-800 text-cream-300 ring-gold-400/15 hover:text-blush-300 hover:ring-blush-300/50'}`}
          >
            {c.name}
          </motion.button>
        );
      })}
    </div>
  );
}
