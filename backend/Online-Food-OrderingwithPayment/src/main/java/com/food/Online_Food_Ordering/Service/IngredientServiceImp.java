package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Repository.IngredientCategoryRepo;
import com.food.Online_Food_Ordering.Repository.IngredientItemRepo;
import com.food.Online_Food_Ordering.model.IngredientCatgory;
import com.food.Online_Food_Ordering.model.IngredientsItem;
import com.food.Online_Food_Ordering.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientServiceImp implements IngredientsService{

    @Autowired
    private IngredientItemRepo ingredientItemRepo;

    @Autowired
    private IngredientCategoryRepo ingredientCategoryRepo;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public IngredientCatgory createIngredientCatgory(String name, Long restaurantId) throws Exception {

        Restaurant restaurant=restaurantService.findRestaurantById(restaurantId);
        IngredientCatgory catgory=new IngredientCatgory();
        catgory.setRestaurant(restaurant);
        catgory.setName(name);
        return ingredientCategoryRepo.save(catgory);
    }

    @Override
    public IngredientCatgory findIngredientCategoryById(Long id) throws Exception {

        Optional<IngredientCatgory> opt=ingredientCategoryRepo.findById(id);
        if(opt.isEmpty())
        {
            throw new Exception("Ingredient category not found");
        }
        return opt.get();
    }

    @Override
    public List<IngredientCatgory> findIngredientCategoryByRestaurantId(Long id) throws Exception {

        restaurantService.findRestaurantById(id);
        return ingredientCategoryRepo.findByRestaurantId(id);
    }

    @Override
    public List<IngredientsItem> findRestaurantsIngredients(Long restauratId) {
        return ingredientItemRepo.findByRestaurantId(restauratId);
    }

    @Override
    public IngredientsItem createIngredientItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception {
        Restaurant restaurant=restaurantService.findRestaurantById(restaurantId);
        IngredientCatgory category = findIngredientCategoryById(categoryId);
        IngredientsItem item=new IngredientsItem();
        item.setName(ingredientName);
        item.setRestaurant(restaurant);
        item.setCategory(category);
        IngredientsItem ingredientsItem=ingredientItemRepo.save(item);
        category.getIngredientsItems().add(ingredientsItem);

        return ingredientsItem;
    }

    @Override
    public IngredientsItem updateStock(Long id) throws Exception {

         Optional<IngredientsItem> optionalIngredientsItem=ingredientItemRepo.findById(id);
         if(optionalIngredientsItem.isEmpty())
         {
             throw new Exception("Ingredient not found");
         }
         IngredientsItem ingredientsItem=optionalIngredientsItem.get();
         ingredientsItem.setInStock(!ingredientsItem.isInStock());
        return ingredientItemRepo.save(ingredientsItem);
    }
    @Override
    public void deleteIngredientCategory(Long id) throws Exception {
        IngredientCatgory category = findIngredientCategoryById(id);
        ingredientCategoryRepo.delete(category);
    }
    @Override
    public IngredientCatgory updateIngredientCategory(Long id, String name) throws Exception {
        IngredientCatgory category = findIngredientCategoryById(id);
        category.setName(name);
        return ingredientCategoryRepo.save(category);
    }

    @Override
    public IngredientsItem updateIngredient(Long id, String name, Long categoryId) throws Exception {
        IngredientsItem item = ingredientItemRepo.findById(id)
                .orElseThrow(() -> new Exception("Ingredient not found"));

        IngredientCatgory category = findIngredientCategoryById(categoryId);

        item.setName(name);
        item.setCategory(category);

        return ingredientItemRepo.save(item);
    }

    @Override
    public void deleteIngredient(Long id) throws Exception {
        IngredientsItem item = ingredientItemRepo.findById(id)
                .orElseThrow(() -> new Exception("Ingredient not found"));

        ingredientItemRepo.delete(item);
    }

}
