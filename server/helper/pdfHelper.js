const PDFDocument = require("pdfkit");

const generateInvoicePDF = async (order) => {
    return new Promise((resolve, reject) => {

        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on("data", (buffer) => buffers.push(buffer));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (error) => reject(error));

            doc
                .image("public/images/bytez-logo.png", 50, 45, { width: 50 })
                .fillColor("#444444")
                .fontSize(20)
                .text("Bytez Inc.", 110, 65)
                .fontSize(10)
                .text("7th Avenue, Sector 801", 200, 65, { align: "right" })
                .text("Calicut, Kerala, IN", 200, 80, { align: "right" })
                .moveDown();

            // Invoice details section
            doc
                .fontSize(20)
                .text("Invoice", 50, 150)
                .fontSize(10)
                .moveTo(50, 190)
                .lineTo(550, 190)
                .lineWidth(0.5)
                .strokeColor("#ccc")
                .stroke()
                .text(`Order Id: ODR${order._id}`, 50, 200)
                .text(
                    `Order Date: ${(new Date(order.createdAt).toLocaleDateString())}`,
                    50,
                    215
                )
                .text(`Total Amount: ${order.totalPrice}`, 50, 230)
                .text(order.address.fullName, 300, 200)
                .text(order.address.address, 300, 215)
                .moveTo(50, 250)
                .lineTo(550, 250)
                .lineWidth(0.5)
                .strokeColor("#ccc")
                .stroke()
                .moveDown();

            // Products
            let i;
            const invoiceTableTop = 330;

            // Table Header
            generateTableRow(
                doc,
                invoiceTableTop,
                "SL No",
                "Product Name",
                "Qty",
                "Price",
                "Sub Total"
            );
            for (i = 0; i < order.items.length; i++) {
                const item = order.items[i];
                const position = invoiceTableTop + (i + 1) * 30;
                generateTableRow(
                    doc,
                    position,
                    i + 1,
                    item.name,
                    item.quantity,
                    item.price,
                    item.price * item.quantity
                );
            }

            const subtotalPosition = invoiceTableTop + (i + 1) * 30;
            generateTableRowNoLine(
                doc,
                subtotalPosition,
                "",
                "",
                "Subtotal",
                "",
                order.subTotal
            );

            const paidToDatePosition = subtotalPosition + 30;
            generateTableRowNoLine(
                doc,
                paidToDatePosition,
                "",
                "",
                "Discount",
                "",
                order.discount
            );
            const couponAppliedPosition = paidToDatePosition + 30;
            generateTableRowNoLine(
                doc,
                couponAppliedPosition,
                "",
                "",
                "Coupon Applied",
                "",
                order?.couponApplied || 0
            );
            const duePosition = couponAppliedPosition + 30;
            generateTableRowNoLine(
                doc,
                duePosition,
                "",
                "",
                "Total",
                "",
                order.totalPrice
            );
            doc.fontSize(10)
                .text(
                    "Payment has been received. Thank you for your business.",
                    50,
                    700,
                    { align: "center", width: 500 }
                );
            doc.end();
        } catch (error) {
            reject(error);
        }
    })
};

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    c2 = c2.slice(0, 40);

    doc
        .fontSize(10)
        .text(c1, 50, y)
        .text(c2, 100, y)
        .text(c3, 280, y, { width: 90, align: "right" })
        .text(c4, 370, y, { width: 90, align: "right" })
        .text(c5, 0, y, { align: "right" })
        .moveTo(50, y + 15)
        .lineTo(560, y + 15)
        .lineWidth(0.5)
        .strokeColor("#ccc")
        .stroke();
}

function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
    c2 = c2.slice(0, 40);

    doc
        .fontSize(10)
        .text(c1, 50, y)
        .text(c2, 100, y)
        .text(c3, 280, y, { width: 90, align: "right" })
        .text(c4, 370, y, { width: 90, align: "right" })
        .text(c5, 0, y, { align: "right" });
}


module.exports = { generateInvoicePDF }