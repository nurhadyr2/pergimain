import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';

const BUDGETS = [
  { id: 'hemat', label: 'HEMAT', hint: '≤ Rp50rb' },
  { id: 'sedang', label: 'SEDANG', hint: 'Rp50-150rb' },
  { id: 'royal', label: 'ROYAL', hint: 'Rp150rb+' },
];

// Filter spin: budget (kosong = semua) + "belum pernah" (hanya tempat yang belum dikunjungi).
export default function SpinFilters({ budget, onBudget, fresh, onFresh, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="pix-title" style={{ fontSize: 7, color: '#9f86d9' }}>
        <FontAwesomeIcon icon={ui.coins} />&nbsp;BUDGET
      </span>
      {BUDGETS.map((b) => (
        <button
          key={b.id}
          type="button"
          className={`pix-chip ${budget === b.id ? 'pix-chip-on' : ''}`}
          style={{ fontSize: 7, padding: '0.4rem 0.5rem' }}
          onClick={() => onBudget(budget === b.id ? '' : b.id)}
          disabled={disabled}
          title={b.hint}
        >
          {b.label}
        </button>
      ))}
      <button
        type="button"
        className={`pix-chip ${fresh ? 'pix-chip-on' : ''}`}
        style={{ fontSize: 7, padding: '0.4rem 0.5rem', marginLeft: 4 }}
        onClick={() => onFresh(!fresh)}
        disabled={disabled}
        title="Hanya tempat yang belum pernah kalian datangi"
      >
        <FontAwesomeIcon icon={ui.sparkle} />&nbsp;BELUM PERNAH
      </button>
    </div>
  );
}
