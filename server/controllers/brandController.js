const Brand = require('../models/Brand');

module.exports = {
    createBrand: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { brand, status } = req.body;
            if (!filename) {
                res.json({ status: "error", messsage: "Image upload error!" });
                return;
            }
            await Brand.create({ brand, thumbnail: filename, status });
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateBrand: async (req, res) => {
        try {
            const filename = req?.file?.filename;
            const { id, brand, fileChanged } = req.body;
            if (fileChanged) {
                await Brand.updateOne({ _id: id }, { brand, thumbnail: filename });
            } else {
                await Brand.updateOne({ _id: id }, { brand });
            }
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    updateBrandStatus: async (req, res) => {
        try {
            const id = req?.query?.id;
            const status = req?.query?.status;
            if (!id || !status) {
                res.json({ status: "error", message: "Brand is not found!" });
            } else {
                await Brand.updateOne({ _id: id }, { isBlocked: status });
                res.json({ status:"ok" });
            }
        } catch (error) {
            res.json({status:"error", message: error?.message});
        }
    },
    getAllBrands: async (req, res) => {
        try {
            const result = await Brand.find({}).lean();
            if (!result) {
                res.json({ staus: "error", message: "Brand not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getBrand: async (req, res) => {
        try {
            const id = req?.params?.id;
            const result = await Brand.findOne({ _id: id });
            if (!result) {
                res.json({ status: "error", message: "Brand not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    }
}