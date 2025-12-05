import { useState } from 'react';
import axios from 'axios';
import deliveryService from '../../api/deliveryService';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

async function geocodeAddress(address) {
  const key = import.meta.env.VITE_MAPS_KEY;
  if (!key) {
    console.warn('Missing Google Maps Key');
    return null;
  }

  const res = await axios.get(GEOCODE_URL, {
    params: { address, key },
  });

  if (res.data.status !== 'OK') return null;

  const { lat, lng } = res.data.results[0].geometry.location;
  return { lat, lng };
}

export default function CreatePostingForm({ purchaserId, onCreated }) {
  const stripe = useStripe();
  const elements = useElements();

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

    if (!stripe || !elements) return;

    if (!pickupAddress || !dropoffAddress || !description || !payment) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const coords = await geocodeAddress(pickupAddress);

      // 1️⃣ Create Delivery entry in DB
    const { delivery, clientSecret } = await deliveryService.createDelivery({
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

      // 2️⃣ Create Stripe PaymentIntent
       if (!clientSecret) {
        throw new Error('Missing clientSecret from backend response');
      }

      // 3️⃣ Confirm Payment Method using Stripe
      const cardElement = elements.getElement(CardElement);
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (confirmation.error) {
        throw new Error(confirmation.error.message);
      }

      // 4️⃣ Success!
      setSuccessMsg('Delivery created and payment authorized!');
      setPickupAddress('');
      setDropoffAddress('');
      setDescription('');
      setPayment('');
      if (cardElement) cardElement.clear();
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Create delivery failed:', err);
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
      {successMsg && (
        <p className="text-emerald-400 text-sm mb-2">{successMsg}</p>
      )}

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

        {/* Stripe Card Field Section */}
        <div className="border-t border-slate-700 pt-3">
          <label className="text-xs text-slate-300 font-semibold">
            Payment Method
          </label>

          <div 
            className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-3 mt-1"
            // This style ensures the div is always clickable
            style={{ pointerEvents: 'auto' }}
          >
            <CardElement
              disabled={loading}
              options={{
                style: {
                  base: {
                    color: '#fff',
                    fontSize: '16px',
                    '::placeholder': { color: '#8899a6' },
                  },
                  invalid: { color: '#ff6b6b' },
                  disabled: {
                    color: '#8899a6',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }
                },
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full mt-2 bg-brandBlue text-white py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}
