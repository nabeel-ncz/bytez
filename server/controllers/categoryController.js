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
            await Category.create({ category, thumbnail: filename, status });
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { id, category, fileChanged } = req.body;
            if (fileChanged) {
                await Category.updateOne({ _id: id }, { category, thumbnail: filename });
            } else {
                await Category.updateOne({ _id: id }, { category });
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
                res.json({ status:"ok" });
            }
        } catch (error) {
            res.json({status:"error", message: error?.message});
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
        try{
            const id = req?.params?.id;
            const result = await Category.findById(id);
            if(!result){
                res.json({status:"error", message:"Category is not exist!"});
            } else {
                res.json({status:"ok", data: result});
            }
        } catch (error){
            res.json({status:"error", message: error?.message});
        }
    }
}