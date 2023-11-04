const Category = require('../models/Category');

module.exports = {
    createCategory: async (req, res) => {
        try{
            const { category } = req.body;
            await Category.create({category});
            res.json({status:"ok"});
        }catch (error){
            res.json({status:"error", message:error?.message});
        }
    },
    getAllCategories: async (req, res) => {
        try{
            const result = await Category.find({}).lean();
            if(!result){
                res.json({staus:"error", message:"Category not found!"});
            } else {
                res.json({status:"ok",data: result});
            }
        } catch (error){
            res.json({status:"error", message: error?.message});
        }
    }
}