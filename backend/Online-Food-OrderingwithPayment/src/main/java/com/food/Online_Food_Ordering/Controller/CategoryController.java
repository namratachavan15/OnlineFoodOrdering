package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Service.CategoryService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @PostMapping("/admin/category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category, @RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        Category createdCategory=categoryService.createCategory(category.getName(),user.getId());
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
    @GetMapping("/category/restaurant/{id}")
    public ResponseEntity<List<Category>> getRestaurantCategory(@PathVariable Long id ,@RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        List<Category> categories=categoryService.findCategoryByRestaurantId(id);
        return new ResponseEntity<>(categories, HttpStatus.CREATED);
    }

    @PutMapping("/admin/category/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Category updated = categoryService.updateCategory(id, category.getName(), user.getId());

        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/admin/category/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        categoryService.deleteCategory(id, user.getId());

        return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
    }
}
