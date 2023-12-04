const Category = require('../models/Category');

module.exports = {
    createCategory: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { category, status } = req.body;
            if (!filename) {
                res.json({ status: "error", messsage: "Image upload error!" });
                return;
            }
            const isExist = await Category.findOne({ category: category.toLowerCase(), status: "active" });
            if (isExist) {
                return res.json({ status: 'error', message: 'Category is already exist!' });
            }
            const newCategory = new Category({
                category: category.toLowerCase(),
                thumbnail: filename,
                status
            });
            await newCategory.save();
            res.json({ status: "ok", data: newCategory });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { id, category, fileChanged, status } = req.body;
            const isExist = await Category.findOne({ category: category.toLowerCase(), status: "active" });
            if (isExist?._id.toString() !== id && isExist) {
                return res.json({ status: 'error', message: 'Category is already exist!' });
            };
            if (fileChanged) {
                await Category.updateOne({ _id: id }, { category: category.toLowerCase(), thumbnail: filename, status });
            } else {
                await Category.updateOne({ _id: id }, { category: category.toLowerCase(), status });
            }
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateCategoryStatus: async (req, res) => {
        try {
            const id = req?.query?.id;
            const status = req?.query?.status;
            if (!id || !status) {
                res.json({ status: "error", message: "Category Id not found!" });
            } else {
                await Category.updateOne({ _id: id }, { isBlocked: status });
                res.json({ status: "ok" });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllCategories: async (req, res) => {
        try {
            const result = await Category.find({}).lean();
            if (!result) {
                res.json({ staus: "error", message: "Category not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getCategory: async (req, res) => {
        try {
            const id = req?.params?.id;
            const result = await Category.findById(id);
            if (!result) {
                res.json({ status: "error", message: "Category is not exist!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllActiveCategories: async (req, res) => {
        try {
            const result = await Category.find({ status: 'active' }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Category not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    }
}