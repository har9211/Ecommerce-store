const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = async (_req, res) => {
  try {
    // Bring projects created before category management into the new list.
    // Once listed, a populated category cannot be deleted, so this does not
    // re-create a category an administrator has successfully removed.
    const productCategories = await Product.distinct("category", { category: { $ne: "" } });
    if (productCategories.length) {
      await Category.bulkWrite(
        productCategories.map((name) => ({ updateOne: { filter: { name }, update: { $setOnInsert: { name } }, upsert: true } }))
      );
    }
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await Category.findOne({ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } });
    if (existing) return res.status(400).json({ message: "This category already exists" });

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount) {
      return res.status(409).json({
        message: `Move or delete the ${productCount} product(s) in ${category.name} before deleting this category.`,
      });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
