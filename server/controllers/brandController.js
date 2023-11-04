const Brand = require('../models/Brand');

module.exports = {
    createBrand: async (req, res) => {
        try{
            const { brand } = req.body;
            await Brand.create({brand});
            res.json({status:"ok"});
        }catch (error){
            res.json({status:"error", message:error?.message});
        }
    },
    getAllBrands: async (req, res) => {
        try{
            const result = await Brand.find({}).lean();
            if(!result){
                res.json({staus:"error", message:"Brand not found!"});
            } else {
                res.json({status:"ok",data: result});
            }
        } catch (error){
            res.json({status:"error", message: error?.message});
        }
    }
}