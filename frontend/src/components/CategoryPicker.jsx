import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { iconFor } from '../lib/icons';

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
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors
              ${active
                ? 'text-white ring-transparent shadow-card'
                : 'bg-white/80 text-slate-600 ring-slate-200 hover:ring-brand-300'}`}
            style={active ? { backgroundColor: c.color } : undefined}
          >
            <FontAwesomeIcon icon={iconFor(c.icon)} style={!active ? { color: c.color } : undefined} />
            <span>{c.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
