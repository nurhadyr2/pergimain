import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { catIcon } from '../lib/icons';

export default function CategoryPicker({ categories, selected, onToggle, disabled }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {categories.map((c) => {
        const active = selected.includes(c.slug);
        return (
          <button
            key={c.slug}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(c.slug)}
            className={`cat-tile ${active ? 'cat-on' : ''}`}
          >
            <span className="cat-ico">
              <FontAwesomeIcon icon={catIcon(c.slug)} />
            </span>
            <span className="cat-lbl">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
