const { User, Delivery } = require('../models');

async function seed() {
  const user = await User.create({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password_hash: 'test-hash',
    phone: '1234567890',
    role: 'customer',
    isVerified: true,
  });

  const delivery = await Delivery.create({
    pickup_address: '123 Test St',
    dropoff_address: '987 Delivery Ln',
    item_description: 'Gaming PC',
    price: 49.99,
    status: 'pending',
    customerId: user.user_id, // Use actual FK
  });

  console.log('Seeded delivery:', delivery.delivery_id);
  process.exit();
}

seed();
