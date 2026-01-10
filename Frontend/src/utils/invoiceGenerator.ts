import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order: any, profile: any) => {
  const doc = new jsPDF();

  /* ================= LOGO ================= */
  const logoUrl = "/logo.png";
  doc.addImage(logoUrl, "PNG", 15, 10, 40, 20);

  /* ================= HEADER ================= */
  doc.setFontSize(18);
  doc.text("INVOICE", 150, 20);

  doc.setFontSize(10);
  doc.text(`Order ID: ${order.orderId}`, 150, 28);
  doc.text(`Date: ${new Date(order.placedAt).toLocaleDateString()}`, 150, 34);

  /* ================= COMPANY INFO ================= */
  doc.setFontSize(11);
  doc.text("MUNCHZ ECOMMERCE", 15, 40);
  doc.setFontSize(9);
  doc.text("support@munchz.com", 15, 46);
  doc.text("India", 15, 52);

  /* ================= CUSTOMER INFO ================= */
  doc.setFontSize(11);
  doc.text("Bill To:", 15, 64);
  doc.setFontSize(9);
  doc.text(`${profile.firstName} ${profile.lastName}`, 15, 70);
  doc.text(profile.email || profile.mobile, 15, 76);
  doc.text(order.billingAddress, 15, 82);

  /* ================= TABLE ================= */
  autoTable(doc, {
    startY: 95,
    head: [["Product", "Qty", "Unit Price", "Total"]],
    body: order.items.map((item: any) => [
      item.productName,
      item.quantity,
      `₹${item.unitPrice}`,
      `₹${item.lineTotal}`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] }, // green premium
  });

  /* ================= TOTAL ================= */
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text(`Total Amount: ₹${order.totalAmount}`, 150, finalY);

  /* ================= FOOTER ================= */
  doc.setFontSize(8);
  doc.text(
    "Thank you for shopping with us!",
    105,
    285,
    { align: "center" }
  );

  doc.save(`Invoice_${order.orderId}.pdf`);
};
