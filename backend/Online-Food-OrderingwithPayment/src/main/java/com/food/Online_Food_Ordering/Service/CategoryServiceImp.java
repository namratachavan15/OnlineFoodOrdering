package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Repository.CategoryRepo;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImp  implements  CategoryService{

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public Category createCategory(String name, Long userId) throws Exception {


        Restaurant restaurant=restaurantService.getRestaurantByUserId(userId);

        Category category=new Category();
        category.setName(name);
        category.setRestaurant(restaurant);

        return categoryRepo.save(category);
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {


        Restaurant restaurant=restaurantService.findRestaurantById(id);
        System.out.println(restaurant);
        return categoryRepo.findByRestaurantId(id);
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {
        Optional<Category> optionalCategory=categoryRepo.findById(id);
        if(optionalCategory.isEmpty())
        {
            throw new Exception("category not found");
        }
        return optionalCategory.get();
    }
    @Override
    public Category updateCategory(Long categoryId, String name, Long userId) throws Exception {

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found"));

        category.setName(name);

        return categoryRepo.save(category);
    }
    @Override
    public void deleteCategory(Long categoryId, Long userId) throws Exception {

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found"));

        categoryRepo.delete(category);
    }
}
