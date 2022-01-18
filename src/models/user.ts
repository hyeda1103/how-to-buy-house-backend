import mongoose, {
  Schema, Document, SchemaOptions,
} from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  profilePhoto: string;
  postCount: Number;
  isBlocked: Boolean;
  password: string;
  isAdmin: boolean;
  role: String;
  isFollowing: Boolean;
  isUnFollowing: Boolean;
  isAccountVerified: Boolean;
  accountVerificationToken: String;
  accountVerificationTokenExpires: Date;
  viewedBy: Array<typeof Schema.Types.ObjectId>;
  followers: Array<typeof Schema.Types.ObjectId>;
  following: Array<typeof Schema.Types.ObjectId>;
  passwordChangeAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  active: Boolean;
}

interface IUserDocument extends IUser, Document {
  matchPassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUserDocument>(
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
    passwordResetExpires: Date,
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

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
