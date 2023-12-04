import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const handleDownloadPDF = (data) => {
    const jsonBody = data?.map((doc) => [doc._id, `${doc.address?.fullName}, ${doc.address?.email}`, doc.itemsQuantity, doc.totalPrice, doc.status, doc.paymentMode])
    const pdfDoc = new jsPDF();
    autoTable(pdfDoc, {
        head: [['Order ID', 'User', 'No of Items', 'Amount', 'Status', 'Payment Mode']],
        body: jsonBody,
        theme: 'striped',
        tableWidth: 180,
        styles: {},
        columnStyles: {},
    });
    pdfDoc.save("SalesReport.pdf");
};

