import { Schema } from 'mongoose';

export interface User {
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
  passwordResetTokenExpires: Date;
  active: Boolean;
}
