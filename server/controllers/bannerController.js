const { resizeBannerImage } = require('../helper/imageResizeHelper');
const Banner = require('../models/Banner');
module.exports = {
    createBanner: async (req, res) => {
        const resizedFile = await resizeBannerImage(req?.file);
        try {
            if (resizedFile?.status === "ok") {
                const { type } = req.body;
                await Banner.create({ image: resizedFile?.data, type });
                res.json({ status: 'ok' });
            } else {
                throw new Error('Image upload error!');
            }
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    },
    updateBanner: async (req, res) => {
        const file = req?.file?.filename;
        const { id, filechanged, type } = req.body;
        if (!file) {
            return res.json({ status: "error", messsage: "Image upload error!" });
        }
        try {
            if (filechanged) {
                await Banner.updateOne({ _id: id }, { image: file, type });
            } else {
                await Banner.updateOne({ _id: id }, { type });
            };
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    },
    getAllBanners: async (req, res) => {
        try {
            const type = req.params?.type;
            const result = await Banner.find({ type }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Banner not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        };
    },
    getCarouselImagesForUser: async (req, res) => {
        try {
            const result = await Banner.find({ type: "carousel" }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Banner not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        };
    },
    getPosterImagesForUser: async (req, res) => {
        try {
            const result = await Banner.find({ type: "poster" }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Banner not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        };
    },
    getNewsImagesForUser: async (req, res) => {
        try {
            const result = await Banner.find({ type: "news" }).lean();
            if (!result) {
                res.json({ staus: "error", message: "Banner not found!" });
            } else {
                res.json({ status: "ok", data: result });
            }
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        };
    },
    deleteBanner: async (req, res) => {
        try {
            const id = req.params?.id;
            await Banner.deleteOne({ _id: id });
            res.json({ status: 'ok' });
        } catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
}