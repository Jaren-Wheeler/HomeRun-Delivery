import { useState } from 'react';
import axios from 'axios';
import deliveryService from '../../api/deliveryService';
import mapsService from "../../api/mapsService";   // ⭐ USE BACKEND KEY


const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// ⭐ FIXED → Always use the SAME Google key your map uses
async function geocodeAddress(address) {
  const res = await mapsService.getMapsKey();
  const apiKey = res.apiKey || res.key || res.googleKey;

  if (!apiKey) {
    console.warn("❌ Missing Google Maps API Key from backend", res);
    return null;
  }

  const geo = await axios.get(GEOCODE_URL, {
    params: { address, key: apiKey },
  });

  if (geo.data.status !== "OK") return null;

  return geo.data.results[0].geometry.location;
}


export default function CreatePostingForm({ purchaserId, onCreated }) {

  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [description, setDescription] = useState('');
  const [payment, setPayment] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!pickupAddress || !dropoffAddress || !description || !payment) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // ⭐ Geocode pickup address BEFORE creating job
      const coords = await geocodeAddress(pickupAddress);

      // 1️⃣ Create DB record
      const delivery = await deliveryService.createDelivery({
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        item_description: description,
        proposed_payment: Number(payment),
        purchaser_id: purchaserId,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      });

      if (!delivery?.deliveryId) {
        throw new Error('Backend did not return a deliveryId');
      }

      // 2️⃣ (Stripe disabled for now)

      // SUCCESS
      setSuccessMsg('Delivery created successfully!');
      setPickupAddress('');
      setDropoffAddress('');
      setDescription('');
      setPayment('');

      if (onCreated) onCreated();

    } catch (err) {
      console.error("Create delivery failed:", err);
      setErrorMsg(err.message || 'Failed to create delivery.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-black/40">
      <h2 className="text-lg font-semibold text-slate-50 mb-3">
        Create a delivery request
      </h2>

      {errorMsg && <p className="text-red-400 text-sm mb-2">{errorMsg}</p>}
      {successMsg && <p className="text-emerald-400 text-sm mb-2">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-300">Pickup address</label>
          <input
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Drop-off address</label>
          <input
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Item description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 min-h-[70px]"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Proposed payment ($)</label>
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-brandBlue text-white py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}
