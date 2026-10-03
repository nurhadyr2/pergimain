export default function Header({ onManage }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-700 py-5">
      <div className="leading-tight">
        <h1 className="font-display text-xl font-bold text-gold-300">Mau Kemana Hari Ini</h1>
        <p className="text-xs text-cream-400">Biar mesin yang nentuin</p>
      </div>
      <button className="btn-ghost shrink-0 whitespace-nowrap !px-3.5 !py-2 text-sm" onClick={onManage}>
        Kelola Tempat
      </button>
    </header>
  );
}
