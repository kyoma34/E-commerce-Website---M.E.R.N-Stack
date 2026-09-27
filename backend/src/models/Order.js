import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String,  required: true },
  image:    { type: String },
  price:    { type: Number,  required: true },
  quantity: { type: Number,  required: true, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    country:  { type: String, required: true },
    zipCode:  { type: String },
  },
  totalPrice:  { type: Number, required: true, default: 0 },
  isPaid:      { type: Boolean, default: false },
  paidAt:      { type: Date },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;