import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import deliveryService from '../api/deliveryService';
import CreatePostingForm from '../components/purchaser/CreatePostingForm';
import DeliveryCard from '../components/purchaser/DeliveryCard';
import NavBar from '../components/common/NavBar';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PurchaserDashboardPage() {
  const { user } = useAuth();
  const purchaserId = user?.id;
 
  const [deliveries, setDeliveries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDeliveries = useCallback(async () => {
    if (!purchaserId) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await deliveryService.getPurchaserDeliveries(purchaserId);
      setDeliveries(data || []);
    } catch (err) {
      console.error('Failed to load deliveries:', err);
      setErrorMsg('Failed to load your deliveries.');
    } finally {
      setLoading(false);
    }
  }, [purchaserId]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const filteredDeliveries = deliveries.filter((d) => {
    if (filterStatus === 'all') return true;
    return d.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 pb-10 pt-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Purchaser dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create delivery requests and track their status in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Logged in as{' '}
            <span className="font-semibold text-slate-100">
              {user?.first_name} {user?.last_name}
            </span>
          </div>
        </header>

        {/* Top layout: create form + filter */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
                <CreatePostingForm
                  purchaserId={purchaserId}
                  onCreated={loadDeliveries}
                />
            </Elements>
            
          </div>

          <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 shadow-md shadow-black/40 flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-1">
                Filter posts
              </p>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-brandBlue"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="closed">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              <p>
                <span className="inline-flex h-2 w-2 rounded-full bg-sky-400 mr-1" />
                <span className="font-semibold text-slate-100">Open</span> –
                waiting for a deliverer.
              </p>
              <p>
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 mr-1" />
                <span className="font-semibold text-slate-100">
                  In progress
                </span>{' '}
                – accepted, not finished.
              </p>
              <p>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-1" />
                <span className="font-semibold text-slate-100">Completed</span>{' '}
                – delivery finished and ready for capture.
              </p>
            </div>
          </div>
        </section>

        {/* Error / loading */}
        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

        {/* Delivery list */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Your delivery posts
            </h2>
            {loading && <p className="text-xs text-slate-400">Loading…</p>}
          </div>

          {filteredDeliveries.length === 0 && !loading ? (
            <div className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 px-4 py-6 text-center text-sm text-slate-400">
              You do not have any delivery posts yet.
              <br />
              <span className="text-slate-300 font-medium">
                Create your first request above.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredDeliveries.map((d) => (
                <DeliveryCard
                  key={d.deliveryId}
                  delivery={d}
                  onClick={() => {
                    // Later: open manage / rate modal here
                    console.log('Clicked delivery', d.deliveryId);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
