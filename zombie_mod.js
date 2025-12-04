// Khai báo yếu tố ZOMBIE với đầy đủ thuộc tính
elements.ZOMBIE = {
    // Thuộc tính cơ bản
    color: "#4e5b4e", // Mã màu xám/xanh lá đặc trưng của Zombie
    behavior: behaviors.WALL, // Khởi tạo hành vi ban đầu (giống tường tĩnh)
    category: "life", // Đặt yếu tố vào nhóm 'life'
    density: 1500, // Độ đặc (làm cho nó nặng)
    state: "solid", // Trạng thái vật chất là rắn
    conduct: 0.1, // Độ dẫn nhiệt thấp
    hardness: 0.8, // Độ cứng
    desc: "Một sinh vật bị biến đổi có khả năng lây nhiễm con người khi tiếp xúc vật lý.", // Mô tả đầy đủ

    // Hàm hành vi (tick function) - Hàm được gọi mỗi khung hình
    tick: function(pixel) {
        // --- 1. Cơ chế Lây nhiễm (Infection Mechanism) ---
        
        // Khai báo các pixel lân cận
        var adjacent = getAdjacentPixels(pixel.x, pixel.y);

        // Lặp qua tất cả các pixel lân cận xung quanh Zombie
        for (var i = 0; i < adjacent.length; i++) {
            var neighbor = adjacent[i];
            
            // Kiểm tra xem pixel lân cận có tồn tại không
            if (neighbor) {
                
                // Nếu pixel lân cận là 'human' (con người)
                if (neighbor.element === "human") {
                    
                    // Thực hiện việc biến đổi: thay đổi yếu tố của pixel lân cận thành ZOMBIE
                    changePixel(neighbor, "ZOMBIE");
                }
            }
        }

        // --- 2. Cơ chế Di chuyển Cơ bản (Movement Mechanism) ---
        
        // Kiểm tra xem có không khí hoặc chất khí (gas) bên dưới Zombie không
        var below = getPixel(pixel.x, pixel.y + 1);
        if (pixel.y < height - 1 && elements[below.element].isGas) {
            
            // Nếu có không khí bên dưới, Zombie sẽ "rơi" xuống chậm
            
            // Quyết định hướng đi ngang ngẫu nhiên (trái hoặc phải)
            var dx = (Math.random() > 0.5 ? 1 : -1); 
            
            // Thực hiện di chuyển xuống 1 pixel và sang ngang dx pixel
            movePixel(pixel, pixel.x + dx, pixel.y + 1);
        }

        // --- 3. Cơ chế Phản ứng Nhiệt (Heat Reaction) ---
        
        // Nếu nhiệt độ của Zombie quá cao (ví dụ: chạm lửa)
        if (pixel.temp > 100) { 
            
            // Biến Zombie thành yếu tố lửa (cháy)
            changePixel(pixel, "fire");
        }
    }
};
