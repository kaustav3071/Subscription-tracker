import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: [true, "Email is required"],
      unique: true, 
      lowercase: true, 
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    // For compatibility with controllers that send `passwordHash`
    passwordHash: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
    required: false,
      trim: true,
      validate: {
        validator: function (v) {
      if (!v) return true;
      return validator.isMobilePhone(v, "any", { strictMode: false });
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    emailVerificationToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.passwordHash;
        delete ret.emailVerificationToken;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.passwordHash;
        delete ret.emailVerificationToken;
        return ret;
      },
    },
  }
);


userSchema.pre('validate', function (next) {
  if (!this.password && this.passwordHash) {
    this.password = this.passwordHash;
    this.$locals = this.$locals || {};
    this.$locals.isPreHashed = true;
  }
  next();
});

userSchema.pre('save', async function (next) {
  const preHashed = this.$locals?.isPreHashed;
  if (this.isModified('password') && !preHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.$locals) delete this.$locals.isPreHashed;
  this.passwordHash = undefined;
  next();
});

userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign({ _id: this._id, model: 'User' }, secret, { expiresIn: '7d' });
};

userSchema.methods.comparePassword = async function (password) {
  let hashed = this.password;
  if (!hashed) {
    const fresh = await this.constructor.findById(this._id).select('+password');
    if (!fresh || !fresh.password) return false;
    hashed = fresh.password;
  }
  return bcrypt.compare(password, hashed);
};

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 10);
};


const User = mongoose.model('User', userSchema);
export default User;
