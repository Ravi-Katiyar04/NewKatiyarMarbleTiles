export function downloadBookingReceipt(order, { currency = "₹", userName = "" } = {}) {
    const items = (order.items || [])
        .map(
            (item) => `
      <tr>
        <td>${item.product?.name || "Product"}</td>
        <td>${item.quantity}</td>
        <td>${currency}${(item.product?.offerPrice || 0) * item.quantity}</td>
      </tr>`
        )
        .join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Booking Receipt - ${order._id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .muted { color: #666; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
    th { background: #f5f5f5; }
    .totals { margin-top: 20px; font-size: 14px; }
    .totals p { margin: 6px 0; }
    .badge { display: inline-block; background: #166534; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Katiyar Marble Tiles</h1>
  <p class="muted">Booking Receipt</p>
  <p><span class="badge">CONFIRMED</span></p>
  <p class="muted">Receipt ID: ${order._id}</p>
  <p class="muted">Date: ${new Date(order.createdAt).toLocaleString()}</p>
  <p class="muted">Customer: ${userName || order.userId?.name || "—"}</p>
  <table>
    <thead>
      <tr><th>Product</th><th>Qty</th><th>Amount</th></tr>
    </thead>
    <tbody>${items}</tbody>
  </table>
  <div class="totals">
    <p><strong>Total:</strong> ${currency}${order.amount}</p>
    <p><strong>Deposit paid (${order.depositPercent || 10}%):</strong> ${currency}${order.paidAmount || 0}</p>
    <p><strong>Payment:</strong> ${order.paymentType || "Online"}</p>
  </div>
  <p class="muted" style="margin-top:32px;">Thank you for your booking.</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `booking-receipt-${order._id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
