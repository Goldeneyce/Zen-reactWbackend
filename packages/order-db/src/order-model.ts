import mongoose, { InferSchemaType, model } from 'mongoose';
const { Schema } = mongoose;

export const OrderStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  UNPAID: 'unpaid',
  PAID: 'paid',
  DELIVERED: 'delivered',
};

export const PaymentMethod = {
  CARD: 'card',
  COD: 'cod',
};

const OrderSchema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  paymentMethod: { type: String, enum: Object.values(PaymentMethod), default: PaymentMethod.CARD },
  products: { type: [
                    {
                        name: { type: String, required: true },
                        quantity: { type: Number, required: true },
                        price: { type: Number, required: true }
                    },
                    ], required: true 
            },
    
  shippingAddress: { type: String, required: true },
  shippingDetails: {
    type: {
      fullName: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
    },
    required: false,
  },
    },
    { timestamps: true }
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;

export const Order = model<OrderSchemaType>('Order', OrderSchema);