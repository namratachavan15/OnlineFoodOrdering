package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Request.IngredientCategoryRequest;
import com.food.Online_Food_Ordering.Request.IngredientRequest;
import com.food.Online_Food_Ordering.Service.IngredientsService;
import com.food.Online_Food_Ordering.model.IngredientCatgory;
import com.food.Online_Food_Ordering.model.IngredientsItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ingredients")
public class IngredientController {

    @Autowired
    private IngredientsService ingredientsService;

    @PostMapping("/category")
    public ResponseEntity<IngredientCatgory> createIngredientCategory(@RequestBody IngredientCategoryRequest req) throws Exception {
        IngredientCatgory item=ingredientsService.createIngredientCatgory(req.getName(),req.getRestaurantId());
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PostMapping()
    public ResponseEntity<IngredientsItem> createIngredientItem(@RequestBody IngredientRequest req) throws Exception {
        IngredientsItem item=ingredientsService.createIngredientItem(req.getRestaurantId(),req.getName(),req.getCategoryId());
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<IngredientsItem>> getRestaurantIngredient(@PathVariable Long id) throws Exception {

        List<IngredientsItem> items=ingredientsService.findRestaurantsIngredients(id);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{id}/category")
    public ResponseEntity<List<IngredientCatgory>> getRestaurantIngredientCategory(@PathVariable Long id) throws Exception {
        List<IngredientCatgory> items=ingredientsService.findIngredientCategoryByRestaurantId(id);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
    @PutMapping("/{id}/stock")
    public ResponseEntity<IngredientsItem> updateIngredientStock(@PathVariable Long id) throws Exception {
        IngredientsItem updatedItem = ingredientsService.updateStock(id);
        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<IngredientCatgory> updateCategory(
            @PathVariable Long id,
            @RequestBody IngredientCategoryRequest req) throws Exception {
        return new ResponseEntity<>(
                ingredientsService.updateIngredientCategory(id, req.getName()),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) throws Exception {
        ingredientsService.deleteIngredientCategory(id);
        return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientsItem> updateIngredient(
            @PathVariable Long id,
            @RequestBody IngredientRequest req) throws Exception {

        return new ResponseEntity<>(
                ingredientsService.updateIngredient(id, req.getName(), req.getCategoryId()),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIngredient(@PathVariable Long id) throws Exception {
        ingredientsService.deleteIngredient(id);
        return new ResponseEntity<>("Ingredient deleted successfully", HttpStatus.OK);
    }
}
