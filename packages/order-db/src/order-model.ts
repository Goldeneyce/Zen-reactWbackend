import mongoose, { InferSchemaType, model } from 'mongoose';
const { Schema } = mongoose;

export const OrderStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  UNPAID: 'unpaid',
  PAID: 'paid',
  DELIVERED: 'delivered',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  ON_HOLD: 'on_hold',
};

export const PaymentMethod = {
  CARD: 'card',
  COD: 'cod',
};

export const FraudRiskLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const ReturnStatus = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RECEIVED: 'received',
  REFUNDED: 'refunded',
  EXCHANGED: 'exchanged',
};

export const NoteType = {
  INTERNAL: 'internal',
  CUSTOMER: 'customer',
  SYSTEM: 'system',
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
                        price: { type: Number, required: true },
                        sku: { type: String },
                        productId: { type: String },
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
  // Fraud analysis
  fraudAnalysis: {
    type: {
      riskLevel: { type: String, enum: Object.values(FraudRiskLevel), default: FraudRiskLevel.LOW },
      riskScore: { type: Number, default: 0 },
      flags: [{ type: String }],
      ipAddress: { type: String },
      reviewedBy: { type: String },
      reviewedAt: { type: Date },
      notes: { type: String },
    },
    required: false,
  },
  // Admin notes / internal log
  adminNotes: { type: String },
  tags: [{ type: String }],
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  assignedTo: { type: String },
    },
    { timestamps: true }
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;
export const Order = model<OrderSchemaType>('Order', OrderSchema);

// Order Activity Log (Timeline)
const OrderActivitySchema = new Schema({
  orderId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  performedBy: { type: String, required: true },
  performedByEmail: { type: String },
  noteType: { type: String, enum: Object.values(NoteType), default: NoteType.SYSTEM },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export type OrderActivityType = InferSchemaType<typeof OrderActivitySchema>;
export const OrderActivity = model<OrderActivityType>('OrderActivity', OrderActivitySchema);

// Returns, Refunds & Exchanges
const ReturnRequestSchema = new Schema({
  orderId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: Object.values(ReturnStatus), default: ReturnStatus.REQUESTED },
  type: { type: String, enum: ['return', 'refund', 'exchange'], required: true },
  reason: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    productId: { type: String },
  }],
  refundAmount: { type: Number, default: 0 },
  refundMethod: { type: String, enum: ['original', 'store_credit', 'manual'], default: 'original' },
  exchangeOrderId: { type: String },
  processedBy: { type: String },
  processedAt: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export type ReturnRequestType = InferSchemaType<typeof ReturnRequestSchema>;
export const ReturnRequest = model<ReturnRequestType>('ReturnRequest', ReturnRequestSchema);