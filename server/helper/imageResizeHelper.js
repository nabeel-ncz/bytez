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
        return {status:"ok", data: resizedFiles};
    } catch (error) {
        return { status:"error", message: error?.message};
    }
}

module.exports = { resizeProductImage }