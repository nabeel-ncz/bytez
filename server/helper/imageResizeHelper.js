const sharp = require('sharp');
const path = require('path');

const resizeProductImage = async (files) => {
    const resizedFiles = [];
    try {
        for (let fieldname in files) {
            const file = files[fieldname][0];
            await sharp(file.path)
                .resize(400, 400, { position: 'centre' })
                .toFormat('png')
                .toFile(`../server/public/products/resized/${file.filename}`);
            resizedFiles.push(file.filename);
        }
        return { status: "ok", data: resizedFiles };
    } catch (error) {
        return { status: "error", message: error?.message };
    }
}

const resizeBannerImage = async (file) => {
    console.log(file)
    try {
        await sharp(file.path)
            .resize(2990, 2165, { position: 'centre' })
            .toFormat('png')
            .toFile(`../server/public/banners/resized/${file.filename}`);
        return { status: "ok", data: file.filename };
    } catch (error) {
        return { status: "error", message: error?.message };
    }
}

module.exports = { resizeProductImage, resizeBannerImage }