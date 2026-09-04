import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    hourlyRate: { type: Number, default: 75 },
    currency: { type: String, default: 'USD' },
    role: { type: String, enum: ['freelancer', 'admin'], default: 'freelancer' },
    businessDetails: {
      companyName: { type: String, default: '' },
      taxNumber: { type: String, default: '' },
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      website: { type: String, default: '' },
      defaultPaymentTerms: { type: String, default: 'Payment due within 14 days of invoice date.' },
      defaultInvoiceNotes: { type: String, default: 'Thank you for your business! Please transfer funds via direct wire.' },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
