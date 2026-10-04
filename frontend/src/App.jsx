import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from './components/layout/Header';
import CategoryPicker from './components/CategoryPicker';
import SpinMachine from './components/SpinMachine';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import ManagePlacesModal from './components/ManagePlacesModal';
import RoomScene from './components/RoomScene';
import MobileScene from './components/MobileScene';

import { useCategories } from './hooks/useCategories';
import { useHistory } from './hooks/useHistory';
import { api } from './lib/api';
import { ui } from './lib/icons';
import { levelFrom } from './lib/level';

export default function App() {
  const { categories, loading, error: catError } = useCategories();
  const history = useHistory();

  const [tab, setTab] = useState('spin'); // 'spin' | 'riwayat'
  const [selected, setSelected] = useState([]);
  const [spin, setSpin] = useState({ pool: [], winner: null, spinId: 0 });
  const [result, setResult] = useState(null);
  const [chosen, setChosen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState('');
  const [manageOpen, setManageOpen] = useState(false);

  const toggle = (slug) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const handleSpin = async () => {
    setTab('spin');
    setSpinning(true);
    setError('');
    setResult(null);
    setChosen(false);
    try {
      const { pool, winner } = await api.spin(selected);
      setSpin({ pool, winner, spinId: Date.now() });
    } catch (e) {
      setError(e.message);
      setSpinning(false);
    }
  };

  const handleSettle = (winner) => {
    setSpinning(false);
    setResult(winner);
  };

  const handleChoose = async () => {
    if (!result) return;
    try {
      await history.add(result);
      setChosen(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const lvl = levelFrom(history.items.length);

  const NavBtn = ({ id, label, icon, onClick, on }) => (
    <button
      className={`pix-btn min-w-0 flex-1 !px-1 sm:!px-4 ${on ?? tab === id ? 'pix-grape' : 'pix-white'}`}
      onClick={onClick || (() => setTab(id))}
    >
      <FontAwesomeIcon icon={icon} />&nbsp; {label}
    </button>
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-xl px-3 py-4">
      <RoomScene />
      <div className="pix-panel flex flex-col gap-4 p-5">
        <Header level={lvl.level} progress={lvl.progress} toNext={lvl.toNext} />

        {tab === 'spin' && (
          <main className="flex flex-col gap-4">
            <p className="pix-title text-center" style={{ fontSize: 8, color: '#8367c7' }}>
              PILIH KATEGORI (KOSONG = SEMUA)
            </p>

            {loading ? (
              <p className="font-body text-center" style={{ fontSize: 18, color: '#8367c7' }}>memuat…</p>
            ) : catError ? (
              <p className="font-body text-center" style={{ fontSize: 17, color: '#e45f97' }}>
                gagal konek server: {catError}
              </p>
            ) : (
              <CategoryPicker categories={categories} selected={selected} onToggle={toggle} disabled={spinning} />
            )}

            <SpinMachine
              pool={spin.pool}
              winner={spin.winner}
              spinId={spin.spinId}
              onSettle={handleSettle}
            />

            <motion.button
              className="pix-btn pix-pink w-full flex-col gap-0"
              style={{ padding: '0.85rem 1rem' }}
              onClick={handleSpin}
              disabled={spinning || loading}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ fontSize: 16 }}>{spinning ? '... MENGACAK ...' : 'SPIN!'}</span>
              {!spinning && (
                <span className="font-body normal-case" style={{ fontSize: 15, letterSpacing: 0, color: '#6b5b95' }}>
                  biar semesta yang milih
                </span>
              )}
            </motion.button>

            {error && (
              <p className="font-body text-center" style={{ fontSize: 17, color: '#e45f97' }}>{error}</p>
            )}

            {result && !spinning && (
              <ResultCard place={result} onRespin={handleSpin} onChoose={handleChoose} chosen={chosen} />
            )}
          </main>
        )}

        {tab === 'riwayat' && (
          <main className="flex flex-col gap-4">
            <HistoryList items={history.items} onDelete={history.remove} />
          </main>
        )}

        {/* Bottom nav ala konsol */}
        <nav className="mt-1 flex gap-2">
          <NavBtn id="spin" label="SPIN" icon={ui.dice} />
          <NavBtn id="riwayat" label="RIWAYAT" icon={ui.book} />
          <button className="pix-btn pix-sun min-w-0 flex-1 !px-1 sm:!px-4" onClick={() => setManageOpen(true)}>
            <FontAwesomeIcon icon={ui.gear} />&nbsp; KELOLA
          </button>
        </nav>
      </div>

      <p className="font-body mt-4 text-center" style={{ fontSize: 16, color: '#9f86d9' }}>
        dibuat buat kita berdua
      </p>

      <MobileScene />

      <ManagePlacesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        categories={categories}
        onChanged={() => {}}
      />
    </div>
  );
}
