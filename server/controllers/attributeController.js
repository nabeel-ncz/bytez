const Attributes = require('../models/Attributes');
module.exports = {
    createNewAttribute: async (req, res) => {
        try {
            const { ram, rom } = req.body;
            await Attributes.create({ ram, rom });
            res.json({ status: "ok" });
        } catch (error) {
            res.json({ status: "error", message: error?.message });
        }
    },
    getAllAttributes: async (req, res) => {
        try {
            const result = await Attributes.find({}).lean();
            if (!result) {
                res.json({ status: "error", message: "Result not found!" });
                return;
            }
            res.json({ status: "ok", data: result });
        } catch (error){
            res.json({ status: "error", message: error?.message });
        }
    }
}