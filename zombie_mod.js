elements.ZOMBIE = {
    color: "#4e5b4e",
    behavior: behaviors.WALL,
    category: "life",
    density: 1500,
    state: "solid",
    conduct: 0.1,
    hardness: 0.8,
    desc: "Một sinh vật bị biến đổi có khả năng lây nhiễm.",
    tick: function(pixel) {
        // Tự động di chuyển (Rơi xuống chậm và đi ngang)
        if (pixel.y < height - 1 && elements[getPixel(pixel.x, pixel.y + 1).element].isGas) {
            movePixel(pixel, pixel.x + (Math.random() > 0.5 ? 1 : -1), pixel.y + 1);
        }

        // Lây nhiễm (Biến HUMAN thành ZOMBIE)
        var adjacent = getAdjacentPixels(pixel.x, pixel.y);
        for (var i = 0; i < adjacent.length; i++) {
            var neighbor = adjacent[i];
            if (neighbor && neighbor.element === "human") {
                changePixel(neighbor, "ZOMBIE");
            }
        }

        if (pixel.temp > 100) { changePixel(pixel, "fire"); }
    }
};
