package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.model.Category;

import java.util.List;

public interface CategoryService {

    public Category createCategory(String name,Long userId) throws Exception;

    public List<Category> findCategoryByRestaurantId(Long id) throws Exception;

    public Category findCategoryById(Long id)throws Exception;
    Category updateCategory(Long categoryId, String name, Long userId) throws Exception;

    void deleteCategory(Long categoryId, Long userId) throws Exception;
}
