import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
cartSchema.pre('save', function () {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate tax (assuming 10% tax rate)
  this.tax = this.subtotal * 0.1;
  this.total = this.subtotal + this.tax;
});

// Create indexes for production performance
cartSchema.index({ user: 1 }, { unique: true }); // One cart per user
cartSchema.index({ updatedAt: -1 }); // Find recent carts
cartSchema.index({ 'items.product': 1 }); // Query by product in cart

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
