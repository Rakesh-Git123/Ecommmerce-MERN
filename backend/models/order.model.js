
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    name:String,
    phoneNo:Number,
    email:String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalPrice: Number,
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  deliveredAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days in ms
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
