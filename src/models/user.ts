import mongoose, {
  Schema, Document, SchemaOptions,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../types';

interface UserDocument extends User, Document {
  matchPassword: (password: string) => Promise<boolean>
  createAccountVerificationToken: () => string
  createPasswordResetToken: () => string
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    password: {
      type: String,
      required: true,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Blogger'],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: {
      type: Date,
    },
    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  } as SchemaOptions,
);

// Virtual method to populate created post
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id',
});

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('!isModified');
    next();
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Verify account
userSchema.methods.createAccountVerificationToken = async function () {
  // Create a token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 10 min
  return verificationToken;
};

// Password reset
userSchema.methods.createPasswordResetToken = async function () {
  // Create a token
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; // 10 min
  return resetPasswordToken;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
