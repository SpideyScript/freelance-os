import crypto from 'crypto';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export class AuthService {
  static async register({ name, email, password, hourlyRate, currency }) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      hourlyRate: hourlyRate || 75,
      currency: currency || 'USD',
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select(
      '-password'
    );
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Avoid leaking user presence
      return { message: 'If an account exists, a reset token was generated.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    return {
      message: 'Password reset token generated.',
      resetToken,
    };
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      const error = new Error('Password reset token is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successful.' };
  }
}
