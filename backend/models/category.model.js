import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true }, // null = global default
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, trim: true },
    color: { type: String, trim: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, slug: 1 }, { unique: true });

function slugify(s) {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
}

categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
