export const extractUsernameFromEmail = (email: string) => {
  // Tìm vị trí của ký tự '@'
  const atIndex = email.indexOf('@');

  // Kiểm tra xem email có hợp lệ (có chứa '@') hay không
  if (atIndex === -1) {
    return ''; // Nếu không tìm thấy '@', trả về chuỗi rỗng
  }

  // Cắt chuỗi từ đầu đến trước ký tự '@' và trả về
  return email.slice(0, atIndex);
};
