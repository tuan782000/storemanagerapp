// Định dạng tiền Việt Nam (VND)
export const formatCurrencyVND = (amount: number): string => {
  // Sử dụng API quốc tế của JavaScript để định dạng số tiền
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

// Sử dụng hàm định dạng tiền VND
// const amount = 1234567890;
// console.log(formatCurrencyVND(amount)); // "1.234.567.890 ₫"

// Thêm tiền tố "VNĐ" thay vì "₫"
export const formatCurrencyVNDWithText = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};

// Sử dụng hàm định dạng tiền VND với tiền tố "VNĐ"
// console.log(formatCurrencyVNDWithText(amount)); // "1.234.567.890 VNĐ"
