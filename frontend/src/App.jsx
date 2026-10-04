import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from './components/layout/Header';
import CategoryPicker from './components/CategoryPicker';
import SpinFilters from './components/SpinFilters';
import SpinMachine from './components/SpinMachine';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import TripCalendar from './components/TripCalendar';
import JournalModal from './components/JournalModal';
import ManagePlacesModal from './components/ManagePlacesModal';
import RoomScene from './components/RoomScene';
import MobileScene from './components/MobileScene';
import PinGate from './components/PinGate';
import LevelUp from './components/LevelUp';

import { useCategories } from './hooks/useCategories';
import { useHistory } from './hooks/useHistory';
import { useAuth } from './hooks/useAuth';
import { useMood } from './hooks/useMood';
import { api } from './lib/api';
import { ui } from './lib/icons';
import { levelFrom } from './lib/level';
import { isDone } from './lib/calendar';
import { HAPPY, linesFor } from './lib/dialog';

// Gerbang PIN: isi aplikasi (dan semua fetch-nya) baru dipasang setelah terbuka.
export default function App() {
  const auth = useAuth();
  const lockedLines = useMemo(() => linesFor({ kind: 'locked', seed: Math.floor(Date.now() / 60000) }), []);

  if (auth.status !== 'ok') {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-3 pt-4 lg:pb-4">
        <RoomScene lines={lockedLines} />
        <div className="flex flex-1 flex-col justify-center pb-8">
          <PinGate onSubmit={auth.login} checking={auth.status === 'checking'} />
        </div>
        <MobileScene lines={lockedLines} />
      </div>
    );
  }

  return <Home onLock={auth.lock} />;
}

// "YYYY-MM-DD" dari <input type=date> -> jam 12 siang waktu lokal, biar tanggalnya tidak geser di zona waktu mana pun.
const localNoon = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 12).toISOString();
};

function Home({ onLock }) {
  const { categories, loading, error: catError } = useCategories();
  const history = useHistory();

  const [tab, setTab] = useState('spin'); // 'spin' | 'riwayat'
  const [selected, setSelected] = useState([]);
  const [budget, setBudget] = useState(''); // '' | 'hemat' | 'sedang' | 'royal'
  const [fresh, setFresh] = useState(false); // hanya tempat yang belum pernah
  const [spin, setSpin] = useState({ pool: [], winner: null, spinId: 0, meta: null });
  const [result, setResult] = useState(null);
  const [chosen, setChosen] = useState(false);
  const [planned, setPlanned] = useState(null); // ISO tanggal rencana untuk hasil spin ini
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState('');
  const [manageOpen, setManageOpen] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [levelUp, setLevelUp] = useState(null); // { level, trips, toNext } saat baru naik level
  const { mood, say } = useMood();

  const toggle = (slug) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    if (!selected.includes(slug)) say('category', { slug });
  };

  // Dipanggil setelah riwayat bertambah: kalau level naik, rayakan.
  const checkLevelUp = (doneBefore) => {
    const before = levelFrom(doneBefore);
    const after = levelFrom(doneBefore + 1);
    if (after.level > before.level) {
      setLevelUp({ level: after.level, trips: doneBefore + 1, toNext: after.toNext });
      say('levelup');
      return true;
    }
    return false;
  };
  const doneCount = history.items.filter(isDone).length;

  const handleSpin = async () => {
    setTab('spin');
    setSpinning(true);
    setError('');
    setResult(null);
    setChosen(false);
    setPlanned(null);
    say('spinning');
    try {
      const { pool, winner, meta } = await api.spin(selected, { budget, fresh });
      setSpin({ pool, winner, spinId: Date.now(), meta });
    } catch (e) {
      setError(e.message);
      setSpinning(false);
    }
  };

  const handleSettle = (winner) => {
    setSpinning(false);
    setResult(winner);
    say('result', { slug: winner.category?.slug });
  };

  // Pergi sekarang: langsung jadi riwayat (♥) dan dihitung ke level.
  const handleChoose = async () => {
    if (!result) return;
    try {
      await history.add(result);
      setChosen(true);
      if (!checkLevelUp(doneCount)) say('saved');
    } catch (e) {
      setError(e.message);
    }
  };

  // Jadwalkan: masuk kalender sebagai rencana (📌), belum dihitung ke level.
  const handlePlan = async (ymd) => {
    if (!result) return;
    try {
      const iso = localNoon(ymd);
      await history.add(result, { plannedAt: iso });
      setPlanned(iso);
      say('planned');
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const handleDone = async (h) => {
    try {
      const updated = await history.update(h.id, { status: 'done' });
      setJournalId(updated.id); // langsung tawarkan tulis cerita
      if (!checkLevelUp(doneCount)) say('saved');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancelPlan = async (h) => {
    if (!confirm(`Batalkan rencana ke ${h.placeName}?`)) return;
    try {
      await history.remove(h.id);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus riwayat ini?')) return;
    try {
      await history.remove(id);
    } catch (e) {
      setError(e.message);
    }
  };

  // Level hanya dari yang sudah pergi; rencana belum dihitung.
  const lvl = levelFrom(doneCount);
  const lines = useMemo(() => linesFor(mood, { toNext: lvl.toNext, level: lvl.level }), [mood, lvl.toNext, lvl.level]);
  const pose = HAPPY.has(mood.kind) ? 'peace' : 'idle';
  const scene = { lines, pose, jump: mood.kind === 'levelup' };
  const journalItem = journalId ? history.items.find((h) => h.id === journalId) : null;

  const NavBtn = ({ id, label, icon, onClick, on }) => (
    <button
      className={`pix-btn min-w-0 flex-1 whitespace-nowrap !gap-1.5 !px-1 sm:!gap-2 sm:!px-4 ${on ?? tab === id ? 'pix-grape' : 'pix-white'}`}
      onClick={onClick || (() => { setTab(id); if (id === 'riwayat') say('riwayat'); })}
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-3 pt-4 lg:pb-4">
      <RoomScene {...scene} />
      <div className="pix-panel flex flex-col gap-4 p-4 sm:p-5">
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
              <>
                <CategoryPicker categories={categories} selected={selected} onToggle={toggle} disabled={spinning} />
                <SpinFilters budget={budget} onBudget={setBudget} fresh={fresh} onFresh={setFresh} disabled={spinning} />
              </>
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
              <ResultCard
                place={result}
                onRespin={handleSpin}
                onChoose={handleChoose}
                onPlan={handlePlan}
                chosen={chosen}
                planned={planned}
                meta={spin.meta}
              />
            )}
          </main>
        )}

        {tab === 'riwayat' && (
          <main className="flex flex-col gap-4">
            {(error || history.error) && (
              <p className="font-body text-center" style={{ fontSize: 17, color: '#e45f97' }}>
                {error || `riwayat gagal dimuat: ${history.error}`}
              </p>
            )}
            <TripCalendar
              items={history.items}
              onJournal={(h) => setJournalId(h.id)}
              onDone={handleDone}
              onCancelPlan={handleCancelPlan}
            />
            <HistoryList
              items={history.items}
              onDelete={handleDelete}
              onJournal={(h) => setJournalId(h.id)}
              onDone={handleDone}
              onCancelPlan={handleCancelPlan}
            />
          </main>
        )}

        {/* Bottom nav ala konsol */}
        <nav className="mt-1 flex gap-2">
          <NavBtn id="spin" label="SPIN" icon={ui.dice} />
          <NavBtn id="riwayat" label="RIWAYAT" icon={ui.book} />
          <button className="pix-btn pix-sun min-w-0 flex-1 whitespace-nowrap !gap-1.5 !px-1 sm:!gap-2 sm:!px-4" onClick={() => setManageOpen(true)}>
            <FontAwesomeIcon icon={ui.gear} />
            <span>KELOLA</span>
          </button>
        </nav>
      </div>

      <p className="font-body mt-4 text-center" style={{ fontSize: 16, color: '#9f86d9' }}>
        dibuat buat kita berdua ·{' '}
        <button type="button" className="underline" onClick={onLock} style={{ color: '#9f86d9' }}>
          <FontAwesomeIcon icon={ui.lock} style={{ fontSize: 11 }} /> kunci
        </button>
      </p>

      <MobileScene {...scene} />

      <LevelUp info={levelUp} onClose={() => setLevelUp(null)} />

      <ManagePlacesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        categories={categories}
        onChanged={() => {}}
      />

      {journalItem && (
        <JournalModal
          item={journalItem}
          onClose={() => setJournalId(null)}
          onSave={history.update}
          onPhoto={history.uploadPhoto}
          onRemovePhoto={history.removePhoto}
        />
      )}
    </div>
  );
}
