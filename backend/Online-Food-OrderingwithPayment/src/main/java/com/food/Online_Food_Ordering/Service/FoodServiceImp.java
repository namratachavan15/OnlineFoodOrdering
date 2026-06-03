package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Repository.FoodRepo;
import com.food.Online_Food_Ordering.Request.CreateFoodRequest;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImp implements  FoodService {


    @Autowired
    private FoodRepo foodRepo;

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) {


        Food food=new Food();
        food.setFoodcategory(category);
        food.setRestaurant(restaurant);
        food.setDescription(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setIngredients(req.getIngredientsItems());
        food.setPrice(req.getPrice());
        food.setSeasonal(req.isSeasonal());
        food.setVegetarian(req.isVegetarian());
        food.setCreationDate(new Date());
        Food savedFood=foodRepo.save(food);
        restaurant.getFoods().add(savedFood);


        return savedFood;
    }

    @Override

    public void deleteFood(Long foodId) throws Exception {
        // Find the food item by its ID
        Food food = findFoodById(foodId);

        // Optionally, you can add logic to check if the food item exists before trying to delete
        if (food == null) {
            throw new Exception("Food not found with id: " + foodId);
        }

        // Delete the food item from the repository
        foodRepo.deleteById(foodId);
    }


    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, boolean isVegitarian, boolean isnonVeg, boolean isSeasonal, String foodCategory) {

        List<Food> foods=foodRepo.findByRestaurantId(restaurantId);
        System.out.println("food size"+foods.size());
        if (foods.isEmpty()) {
            System.out.println("No foods found for the restaurant with ID: " + restaurantId);
        } else {
            for (Food f : foods) {
                System.out.println(f.toString());  // This will print the full details of the food items
            }
        }
        if(isVegitarian)
        {
            foods=filterByVegetrian(foods,isVegitarian);
        }
        if(isnonVeg)
        {
            foods=filterByNonVeg(foods,isnonVeg);
        }
        if(isSeasonal)
        {
            foods=filterBySeassonal(foods,isSeasonal);

        }
        if(foodCategory!=null && !foodCategory.equals(""))
        {
            foods=filterByCategory(foods,foodCategory);
        }
        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {

        return foods.stream().filter(food -> {
            if(food.getFoodcategory()!=null)
            {
                return food.getFoodcategory().getName().equals(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());

    }

    private List<Food> filterBySeassonal(List<Food> foods, boolean isSeasonal) {
        return foods.stream().filter(food -> food.isSeasonal()==isSeasonal).collect(Collectors.toList());
    }

    private List<Food> filterByNonVeg(List<Food> foods, boolean isnonVeg) {
     return foods.stream().filter(food -> food.isVegetarian()==false).collect(Collectors.toList());
    }

    private List<Food> filterByVegetrian(List<Food> foods, boolean isVegitarian) {
    return  foods.stream().filter(food -> food.isVegetarian()==isVegitarian).collect(Collectors.toList());

    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepo.searchFood(keyword);
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {
        Optional<Food> byId = foodRepo.findById(foodId);
        if(byId.isEmpty())
        {
            throw new Exception("Food not exist..");
        }
        return byId.get();
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {

        Food food=findFoodById(foodId);
        food.setAvailable(!food.isAvailable());
        return foodRepo.save(food);

    }

    public Food updateFood(Long id, CreateFoodRequest req, Category category, Restaurant restaurant) throws Exception {

        Food food = findFoodById(id);

        food.setName(req.getName());
        food.setDescription(req.getDescription());
        food.setPrice(req.getPrice());
        food.setFoodcategory(category);
        food.setImages(req.getImages());
        food.setSeasonal(req.isSeasonal());
        food.setVegetarian(req.isVegetarian());
        food.setIngredients(req.getIngredientsItems());

        return foodRepo.save(food);
    }
}
