package com.yourorg.service.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products",
       indexes = {
           @Index(name = "idx_products_category", columnList = "category_id"),
           @Index(name = "idx_products_subcategory", columnList = "subcategory_id")
       })
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "custom_id", unique = true)
private String customId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
private List<ProductImage> images = new ArrayList<>();


    public Product() {
    }

    public Product(String name, String description, String imageUrl, Category category, Subcategory subcategory) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.subcategory = subcategory;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    public String getCustomId() {
    return customId;
}

    public void setName(String name) {
        this.name = name;
    }
public void setCustomId(String customId) {
    this.customId = customId;
}
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Subcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(Subcategory subcategory) {
        this.subcategory = subcategory;
    }

    public List<ProductVariant> getVariants() {
        return variants;
    }

  
    public List<ProductImage> getImages() {
    return images;
}

public void addVariant(ProductVariant variant) {
    variants.add(variant);
    variant.setProduct(this);
}

public void removeVariant(ProductVariant variant) {
    variants.remove(variant);
    variant.setProduct(null);
}

public void addImage(ProductImage image) {
    images.add(image);
    image.setProduct(this);
}

public void removeImage(ProductImage image) {
    images.remove(image);
    image.setProduct(null);
}

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}