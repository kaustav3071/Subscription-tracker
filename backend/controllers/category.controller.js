import Category from '../models/category.model.js';

export async function listCategories(req, res) {
  const userId = req.user?.id || null;
  const items = await Category.find({ $or: [{ user: null }, { user: userId }] }).sort({ user: 1, name: 1 });
  res.json(items);
}

export async function createCategory(req, res) {
  const payload = {
    user: req.user?.id || null,
    name: req.body?.name,
    slug: req.body?.slug,
    color: req.body?.color,
    icon: req.body?.icon,
    description: req.body?.description,
  };
  const doc = await Category.create(payload);
  res.status(201).json(doc);
}

export async function updateCategory(req, res) {
  const updates = { ...req.body };
  delete updates.user;
  const doc = await Category.findOneAndUpdate(
    { _id: req.params.id, $or: [{ user: null }, { user: req.user?.id }] },
    updates,
    { new: true, runValidators: true }
  );
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
}

export async function deleteCategory(req, res) {
  const result = await Category.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
  if (!result) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
