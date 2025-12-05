import { useState, useEffect } from 'react';
import deliveryService from '../../api/deliveryService';

export default function PendingJobsPopup({ delivererId, onClose }) {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    try {
      const pending = await deliveryService.getPendingDelivererJobs(
        delivererId
      );
      const completed = await deliveryService.getCompletedDelivererJobs(
        delivererId
      );

      setPendingJobs(pending);
      setCompletedJobs(completed);
    } catch (err) {
      console.error('Failed loading jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (delivererId) loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivererId]);

  async function finishJob(deliveryId) {
    try {
      await deliveryService.completeJob(delivererId, deliveryId);
      loadJobs(); // refresh lists
    } catch (err) {
      console.error('Failed to complete job:', err);
    }
  }

  if (!delivererId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="w-[420px] max-h-[80vh] overflow-y-auto bg-gray-800 rounded-lg shadow-xl p-6 text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl hover:text-red-400"
        >
          ×
        </button>

        <h2 className="text-lg font-bold mb-3">Current Deliveries</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : pendingJobs.length === 0 ? (
          <p className="text-gray-400 mb-3">No pending jobs</p>
        ) : (
          pendingJobs.map((job) => (
            <div
              key={job.delivery_id}
              className="bg-gray-700 p-3 rounded-lg mb-3 border border-gray-600"
            >
              <h3 className="font-semibold">{job.item_description}</h3>
              <p className="text-sm opacity-80">
                {job.Purchaser?.first_name} {job.Purchaser?.last_name}
              </p>
              <p className="text-sm">
                {job.pickup_address} → {job.dropoff_address}
              </p>
              <p className="text-sm font-medium text-green-400">
                ${job.proposed_payment}
              </p>

              <button
                onClick={() => finishJob(job.delivery_id)}
                className="mt-2 w-full py-1 bg-brandBlue rounded hover:opacity-90 transition text-sm font-semibold"
              >
                Finish Delivery
              </button>
            </div>
          ))
        )}

        <hr className="my-4 border-gray-600" />

        <h2 className="text-lg font-bold mb-3">Completed</h2>

        {completedJobs.length === 0 ? (
          <p className="text-gray-400">No completed jobs yet</p>
        ) : (
          completedJobs.map((job) => (
            <div
              key={job.delivery_id}
              className="bg-gray-700 p-3 rounded-lg mb-3 border border-gray-600"
            >
              <h3 className="font-semibold">{job.item_description}</h3>
              <p className="text-sm opacity-80">
                {job.Purchaser?.first_name} {job.Purchaser?.last_name}
              </p>
              <p className="text-sm">
                {job.pickup_address} → {job.dropoff_address}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
