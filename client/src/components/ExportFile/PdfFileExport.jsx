import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const handleDownloadPDF = (data) => {
    const jsonBody = data?.map((doc) => [doc._id, `${doc.address?.fullName}, ${doc.address?.email}`, doc.itemsQuantity, doc.status, doc.paymentMode, doc.paymentStatus])
    const pdfDoc = new jsPDF();
    autoTable(pdfDoc, {
        head: [['Order ID', 'User', 'No of Products', 'Status', 'Payment Mode', 'Payment Status']],
        body: jsonBody,
        theme: 'grid',
        tableWidth: 180,
        styles: {},
        columnStyles: {},
    });
    pdfDoc.save("SalesReport.pdf");
};

