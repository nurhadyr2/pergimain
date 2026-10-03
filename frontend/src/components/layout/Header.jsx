import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../../lib/icons';

export default function Header({ onManage }) {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
          <FontAwesomeIcon icon={ui.dice} className="text-xl" />
        </span>
        <div className="leading-tight">
          <h1 className="font-display text-xl font-bold text-brand-800">Mau Kemana Hari Ini</h1>
          <p className="text-xs text-slate-500">Biar mesin yang nentuin ✨</p>
        </div>
      </div>
      <button className="btn-ghost !px-4 !py-2 text-sm" onClick={onManage}>
        <FontAwesomeIcon icon={ui.pen} /> Kelola Tempat
      </button>
    </header>
  );
}
