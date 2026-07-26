import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  crop: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing', required: true },
  listing_id: { type: String, required: true },
  crop_name: { type: String, required: true },
  farmer_name: { type: String, required: true },
  quantity_kg: { type: Number, required: true, min: 0.1, max: 1000 },
  price_per_kg: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  order_number: { type: String, required: true, unique: true, index: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true },
  payment: {
    method: { type: String, required: true, enum: ['cod', 'bank_transfer', 'card'] },
    status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    transaction_id: { type: String, default: null },
  },
  delivery: {
    district: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
}, { timestamps: true });

// Auto-generate order number before validation
orderSchema.pre('validate', function (next) {
  if (!this.order_number) {
    this.order_number = 'AGH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);
