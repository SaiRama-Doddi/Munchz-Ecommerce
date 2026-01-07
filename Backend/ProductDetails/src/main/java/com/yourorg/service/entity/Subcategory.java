package com.yourorg.service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subcategories")
public class Subcategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "custom_id", unique = true)
    private String customId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    public Subcategory() {}

    public Subcategory(String name, String description, Category category) {
        this.name = name;
        this.description = description;
        this.category = category;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCustomId() { return customId; }
    public void setCustomId(String customId) { this.customId = customId; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
