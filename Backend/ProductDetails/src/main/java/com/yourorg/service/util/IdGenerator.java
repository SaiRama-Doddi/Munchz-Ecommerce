package com.yourorg.service.util;

public class IdGenerator {

    // Category ID → first 3 letters + 001
    public static String generateCategoryId(String categoryName, Long dbId) {
        String prefix = categoryName.substring(0, 3).toLowerCase();
        return prefix + String.format("%03d", dbId);
    }

    // Subcategory ID → categoryPrefix(3) + subcategoryPrefix(3) + 001
    public static String generateSubcategoryId(String categoryName, String subName, Long dbId) {
        String cat = categoryName.substring(0, 3).toLowerCase();
        String sub = subName.substring(0, 3).toLowerCase();
        return cat + sub + String.format("%03d", dbId);
    }

    // Product ID → category(3) + sub(3) + product(3) + 001
    public static String generateProductId(String categoryName, String subName, String productName, Long dbId) {
        String cat = categoryName.substring(0, 3).toLowerCase();
        String sub = subName != null ? subName.substring(0, 3).toLowerCase() : "gen";
        String pro = productName.substring(0, 3).toLowerCase();
        return cat + sub + pro + String.format("%03d", dbId);
    }
}
