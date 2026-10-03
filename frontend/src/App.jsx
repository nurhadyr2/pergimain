import { useState } from 'react';
import { motion } from 'framer-motion';

import Header from './components/layout/Header';
import CategoryPicker from './components/CategoryPicker';
import SpinMachine from './components/SpinMachine';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import ManagePlacesModal from './components/ManagePlacesModal';

import { useCategories } from './hooks/useCategories';
import { useHistory } from './hooks/useHistory';
import { api } from './lib/api';

export default function App() {
  const { categories, loading, error: catError } = useCategories();
  const history = useHistory();

  const [selected, setSelected] = useState([]); // slug kategori; kosong = semua
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

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-10">
      <Header onManage={() => setManageOpen(true)} />

      <main className="mt-6 flex flex-col gap-6">
        {/* Pemilih kategori */}
        <section className="flex flex-col gap-3">
          <p className="text-center text-sm font-medium text-cream-400">
            Pilih kategori (kosongkan = semua tempat)
          </p>
          {loading ? (
            <p className="text-center text-sm text-cream-400">Memuat kategori…</p>
          ) : catError ? (
            <p className="text-center text-sm text-blush-300">
              Gagal konek ke server: {catError}
            </p>
          ) : (
            <CategoryPicker
              categories={categories}
              selected={selected}
              onToggle={toggle}
              disabled={spinning}
            />
          )}
        </section>

        {/* Mesin spin */}
        <SpinMachine
          pool={spin.pool}
          winner={spin.winner}
          spinId={spin.spinId}
          onSettle={handleSettle}
        />

        {/* Tombol SPIN */}
        <motion.button
          className="btn-gold mx-auto w-full max-w-sm py-3.5 font-display text-lg"
          onClick={handleSpin}
          disabled={spinning || loading}
          whileTap={{ scale: 0.97 }}
        >
          {spinning ? 'Mengacak…' : 'SPIN'}
        </motion.button>

        {error && <p className="text-center text-sm text-blush-300">{error}</p>}

        {/* Hasil */}
        {result && !spinning && (
          <ResultCard
            place={result}
            onRespin={handleSpin}
            onChoose={handleChoose}
            chosen={chosen}
          />
        )}

        {/* Riwayat */}
        <HistoryList items={history.items} onDelete={history.remove} />
      </main>

      <footer className="mt-8 text-center text-xs text-cream-400">
        Dibuat buat kita berdua
      </footer>

      <ManagePlacesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        categories={categories}
        onChanged={() => {}}
      />
    </div>
  );
}
