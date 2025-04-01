INSERT INTO Users (Name, Email, Dob) VALUES
('Mã Trường Vũ', 'matruongvu1@gmail.com', '1990-05-15'),
('Nguyễn Cao Cường', 'nguyencaocuong@gmail.com', '1995-08-22'),
('Nguyễn Mạnh Hùng', 'nguyenmanhhung@gmail.com', '1988-12-10'),
('Nguyễn Đình Đức', 'nguyendinhduc@gmail.com', '1992-03-30'),
('Lâm Tuấn Huy', 'lamtuanhuy@gmail.com', '1985-07-05');

INSERT INTO Account (username, password, role, userid) VALUES
('user', '$2a$10$rckZ2jYdVf912pXCRah.MuwIrgbHhYDUuk/YyLu8KcF8xeEPpsI4.', 'TEACHER', 1),
('user1', '$2a$10$rckZ2jYdVf912pXCRah.MuwIrgbHhYDUuk/YyLu8KcF8xeEPpsI4.', 'STUDENT', 2),
('user2', '$2a$10$rckZ2jYdVf912pXCRah.MuwIrgbHhYDUuk/YyLu8KcF8xeEPpsI4.', 'STUDENT', 3),
('user3', '$2a$10$rckZ2jYdVf912pXCRah.MuwIrgbHhYDUuk/YyLu8KcF8xeEPpsI4.', 'STUDENT', 4),
('user4', '$2a$10$rckZ2jYdVf912pXCRah.MuwIrgbHhYDUuk/YyLu8KcF8xeEPpsI4.', 'STUDENT', 5);

INSERT INTO Test (Title, Description, NumberQuestion, Passcode, TestTime, TimeOpen, TimeClose, TeacherID) VALUES
('Bài kiểm tra Toán', 'Kiểm tra đại số và hình học', 20, '12345678', 60, '2025-03-22 08:00:00', '2025-03-22 09:00:00', 1),
('Bài kiểm tra Lý', 'Kiểm tra về cơ học và điện từ', 15, '23456789', 45, '2025-03-23 10:00:00', '2025-03-23 10:45:00', 1),
('Bài kiểm tra Hóa', 'Kiểm tra hóa hữu cơ', 25, '34567890', 75, '2025-03-24 14:00:00', '2025-03-24 15:15:00', 1);

INSERT INTO Question (Content, Score, TestID) VALUES
('Phương trình bậc hai có dạng tổng quát là gì?', 2.0, 1),
('Tính diện tích tam giác có đáy 6cm, chiều cao 4cm.', 2.0, 1),
('Giải phương trình: 2x + 3 = 7.', 2.0, 1),
('Một hình tròn có bán kính 5cm, chu vi là bao nhiêu?', 2.0, 1),
('Hàm số y = 2x + 3 có đồ thị là đường gì?', 2.0, 1),

('Định luật I Newton phát biểu như thế nào?', 2.0, 2),
('Công thức tính công suất điện là gì?', 2.0, 2),
('Một vật rơi tự do, vận tốc tăng hay giảm?', 2.0, 2),
('Lực ma sát xuất hiện khi nào?', 2.0, 2),
('Dòng điện chạy qua dây dẫn sinh ra hiện tượng gì?', 2.0, 2),

('Công thức hóa học của nước là gì?', 2.0, 3),
('Nguyên tử có cấu tạo gồm mấy loại hạt?', 2.0, 3),
('Phản ứng oxi hóa - khử là gì?', 2.0, 3),
('Kim loại nào nhẹ nhất trong bảng tuần hoàn?', 2.0, 3),
('Dung dịch axit làm quỳ tím chuyển sang màu gì?', 2.0, 3);

INSERT INTO Answer (Content, IsCorrect, QuestionID) VALUES
('ax² + bx + c = 0', TRUE, 1),
('ax³ + bx + c = 0', FALSE, 1),
('ax² - bx + c = 0', FALSE, 1),
('ax² + bx - c = 0', FALSE, 1),

('12 cm²', TRUE, 2),
('10 cm²', FALSE, 2),
('8 cm²', FALSE, 2),
('14 cm²', FALSE, 2),

('x = 2', TRUE, 3),
('x = 1', FALSE, 3),
('x = -1', FALSE, 3),
('x = 3', FALSE, 3),

('31.4 cm', TRUE, 4),
('25.6 cm', FALSE, 4),
('20 cm', FALSE, 4),
('15.7 cm', FALSE, 4),

('Đường thẳng', TRUE, 5),
('Parabol', FALSE, 5),
('Đường tròn', FALSE, 5),
('Đường cong', FALSE, 5),

('Một vật không chịu tác dụng của lực thì sẽ giữ nguyên trạng thái chuyển động.', TRUE, 6),
('Một vật khi rơi luôn tăng tốc độ.', FALSE, 6),
('Lực tác động luôn lớn hơn phản lực.', FALSE, 6),
('Mọi vật luôn chuyển động không ngừng.', FALSE, 6),

('P = U.I', TRUE, 7),
('P = I².R', FALSE, 7),
('P = R.I', FALSE, 7),
('P = U²/R', FALSE, 7),

('Tăng', TRUE, 8),
('Giảm', FALSE, 8),
('Không đổi', FALSE, 8),
('Thay đổi thất thường', FALSE, 8),

('Khi có sự tiếp xúc giữa hai bề mặt', TRUE, 9),
('Khi vật không chịu lực nào', FALSE, 9),
('Khi vật di chuyển trong chân không', FALSE, 9),
('Khi có lực điện tác động', FALSE, 9),

('Hiện tượng cảm ứng điện từ', TRUE, 10),
('Hiện tượng phát sáng', FALSE, 10),
('Hiện tượng hóa học', FALSE, 10),
('Hiện tượng cộng hưởng', FALSE, 10),

('H₂O', TRUE, 11),
('CO₂', FALSE, 11),
('O₂', FALSE, 11),
('NaCl', FALSE, 11),

('3 loại: proton, neutron, electron', TRUE, 12),
('2 loại: neutron, proton', FALSE, 12),
('4 loại: electron, proton, neutron, ion', FALSE, 12),
('Chỉ có proton và electron', FALSE, 12),

('Phản ứng trao đổi electron', TRUE, 13),
('Phản ứng tạo nước', FALSE, 13),
('Phản ứng tỏa nhiệt', FALSE, 13),
('Phản ứng phân hủy', FALSE, 13),

('Liti (Li)', TRUE, 14),
('Natri (Na)', FALSE, 14),
('Nhôm (Al)', FALSE, 14),
('Sắt (Fe)', FALSE, 14),

('Đỏ', TRUE, 15),
('Xanh', FALSE, 15),
('Tím', FALSE, 15),
('Vàng', FALSE, 15);