import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import deliveryService from '../api/deliveryService';
import NavBar from '../components/common/NavBar';
import PendingJobsList from '../components/deliverer/PendingJobList';
import MapComponent from '../components/map/MapComponent'; // ⭐ Use your map component

export default function DelivererDashboardPage() {
  const { user } = useAuth();
  const delivererId = user?.id;

  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(false);

  async function loadOpenJobs() {
    if (!delivererId) return;
    setLoading(true);

    try {
      const jobs = await deliveryService.getPendingDelivererJobs(delivererId);
      setOpenJobs(jobs || []);
    } catch (err) {
      console.error('Failed loading open jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpenJobs();
  }, [delivererId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 pb-10 pt-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">Deliverer Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse and accept available delivery jobs.
            </p>
          </div>

          <button
            onClick={() => setShowPending(true)}
            className="text-xs px-4 py-2 rounded-lg bg-brandBlue hover:brightness-110 transition font-semibold"
          >
            View My Deliveries
          </button>
        </header>

        {/* MAP SECTION */}
        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-700 shadow-lg">
          <MapComponent />
        </div>

        {/* Optional list under map */}
        {loading ? (
          <p className="text-slate-400 text-sm">Loading available jobs…</p>
        ) : openJobs.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No open jobs right now. Check again soon.
          </p>
        ) : (
          <p className="text-slate-400 text-xs">
            Showing {openJobs.length} jobs on the map
          </p>
        )}
      </main>

      {/* Deliverer's “Your Jobs” modal */}
      {showPending && (
        <PendingJobList
          delivererId={delivererId}
          onClose={() => setShowPending(false)}
        />
      )}
    </div>
  );
}
