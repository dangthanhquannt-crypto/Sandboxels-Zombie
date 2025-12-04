// ===============================================
// === 1. KHAI BÁO Z_HEAD (Đầu Zombie) - Yếu tố lây nhiễm
// ===============================================
elements.Z_HEAD = {
    // --- Thuộc tính Hiển thị và Nhận dạng ---
    color: "#3f5e3f", 
    colorOn: "#5f7e5f", // Màu khi được kích hoạt (ví dụ: bị điện)
    category: "life", 
    state: "solid",
    desc: "Đầu Zombie. Mang mầm bệnh lây nhiễm. Có thể bị tách khỏi thân.",
    
    // --- Thuộc tính Vật lý Cơ bản ---
    density: 1000, 
    hardness: 0.9, // Rất cứng, khó bị phá hủy bằng áp lực
    
    // --- Thuộc tính Nhiệt và Điện ---
    temp: 20, // Nhiệt độ khởi tạo
    temp_min: -20, // Nhiệt độ đông cứng tối thiểu
    temp_max: 150, // Nhiệt độ bốc cháy tối đa
    conduct: 0.05, // Độ dẫn điện thấp (điện giật nhẹ)
    insulate: true, // Không dẫn điện
    
    // --- Hàm Hành vi (Tick Function) ---
    tick: function(pixel) {
        // Cơ chế Lây nhiễm: Đầu là nơi mang mầm bệnh
        var adjacent = getAdjacentPixels(pixel.x, pixel.y);
        for (var i = 0; i < adjacent.length; i++) {
            var neighbor = adjacent[i];
            
            if (neighbor) {
                // Lây nhiễm và biến đổi con người
                if (neighbor.element === "human" || neighbor.element === "body") {
                    changePixel(neighbor, "Z_BODY"); // Biến cả body thành Z_BODY
                }
                // Lây nhiễm và biến đổi đầu con người
                if (neighbor.element === "head") {
                    changePixel(neighbor, "Z_HEAD"); 
                }
            }
        }
        
        // Phản ứng Vật lý: Đầu bị đóng băng ở nhiệt độ cực thấp
        if (pixel.temp < elements.Z_HEAD.temp_min) {
            pixel.temp = elements.Z_HEAD.temp_min; 
            changePixel(pixel, "frozen_z_head"); // Giả định có yếu tố frozen
        }
    }
};

// ===============================================
// === 2. KHAI BÁO Z_BODY (Thân Zombie) - Yếu tố di chuyển
// ===============================================
elements.Z_BODY = {
    // --- Thuộc tính Hiển thị và Nhận dạng ---
    color: "#4e5b4e",
    category: "life",
    state: "solid",
    desc: "Thân Zombie. Hỗ trợ di chuyển và tái tạo đầu (tùy thuộc vào mod gốc).",
    
    // --- Thuộc tính Vật lý Cơ bản ---
    density: 1500, // Nặng hơn đầu
    hardness: 0.7, 
    
    // --- Thuộc tính Nhiệt và Điện ---
    temp: 20,
    temp_min: -20,
    temp_max: 120,
    conduct: 0.1,
    insulate: true,
    
    // --- Hàm Hành vi (Tick Function) ---
    tick: function(pixel) {
        // Cơ chế Di chuyển: Rơi xuống chậm và đi ngang
        var below = getPixel(pixel.x, pixel.y + 1);
        if (pixel.y < height - 1 && elements[below.element].isGas) {
            var dx = (Math.random() > 0.5 ? 1 : -1); 
            movePixel(pixel, pixel.x + dx, pixel.y + 1);
        }

        // Cơ chế Tái tạo Đầu (Phức tạp hóa): Nếu không có đầu ở trên, tạo ra đầu mới
        var above = getPixel(pixel.x, pixel.y - 1);
        if (pixel.y > 0 && elements[above.element].isGas && Math.random() < 0.01) { 
            // 1% cơ hội mỗi tick để tạo lại đầu (rất chậm)
            createPixel("Z_HEAD", pixel.x, pixel.y - 1);
        }
        
        // Phản ứng Nhiệt: Thân bốc cháy nhanh hơn đầu
        if (pixel.temp > elements.Z_BODY.temp_max) {
            changePixel(pixel, "fire");
        }
    }
};

// ===============================================
// === 3. KHAI BÁO YẾU TỐ ĐÓNG BĂNG (Cần để Z_HEAD phản ứng) ===
// ===============================================
elements.frozen_z_head = {
    color: "#a0b0c0",
    category: "life",
    state: "solid",
    density: 1000,
    desc: "Đầu Zombie đã bị đóng băng.",
    temp: -20,
    temp_max: 0,
    tick: function(pixel) {
        // Cơ chế tan băng
        if (pixel.temp >= elements.frozen_z_head.temp_max) {
            changePixel(pixel, "Z_HEAD");
        }
    }
};
