import { supabase } from './supabase';
import { adjustProductStock } from './products.service';

/**
 * Insert a new order into the orders table.
 */
export async function createOrder({ orderNumber, customer, items, total }) {
  const { error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: customer.name,
      customer_email: customer.email || null,
      customer_phone: customer.phone || null,
      customer_address: customer.address,
      customer_city: customer.city,
      items,                // JSONB — the cart array
      total,
      status: 'pending',
    });

  if (error) throw error;
}

/**
 * Fetch all orders (admin), most recent first.
 */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(normalizeOrder);
}

/**
 * Update the status of an order and handle stock adjustments.
 */
export async function updateOrderStatus(orderId, status) {
  // 1. Fetch current order to check old status and get items
  const { data: currentOrder, error: fetchError } = await supabase
    .from('orders')
    .select('status, items')
    .eq('id', orderId)
    .single();

  if (fetchError) throw fetchError;

  // 2. Update the status
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  // 3. Handle stock deduction / refund
  const oldStatus = currentOrder.status;
  const newStatus = status;

  if (oldStatus !== 'delivered' && newStatus === 'delivered') {
    // Deduct stock
    for (const item of currentOrder.items) {
      await adjustProductStock(item.id, -item.quantity).catch(console.error);
    }
  } else if (oldStatus === 'delivered' && newStatus !== 'delivered') {
    // Refund stock
    for (const item of currentOrder.items) {
      await adjustProductStock(item.id, item.quantity).catch(console.error);
    }
  }

  return data;
}

/**
 * Delete an order by id.
 */
export async function deleteOrder(orderId) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
}

// ─── Helpers ───────────────────────────────────────────────

/**
 * Normalize a raw Supabase order row into the shape the admin UI expects.
 */
function normalizeOrder(row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.customer_address,
      city: row.customer_city,
    },
    items: row.items ?? [],
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
  };
}
