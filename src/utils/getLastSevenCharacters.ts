export const getLastSevenCharacters = (str: string): string => {
  // Kiểm tra độ dài chuỗi
  if (str.length < 7) {
    return str; // Nếu chuỗi quá ngắn, trả về toàn bộ chuỗi
  }
  // Lấy 7 ký tự cuối cùng
  return str.slice(-7);
};
