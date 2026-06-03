package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Dto.RestaurantDto;
import com.food.Online_Food_Ordering.Repository.AddressRepo;
import com.food.Online_Food_Ordering.Repository.RestaurantRepo;
import com.food.Online_Food_Ordering.Repository.UserRepo;
import com.food.Online_Food_Ordering.Request.CreateRestaurantRequest;
import com.food.Online_Food_Ordering.model.Address;
import com.food.Online_Food_Ordering.model.Restaurant;
import com.food.Online_Food_Ordering.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantServiceImp implements  RestaurantService{

    @Autowired
    private RestaurantRepo restaurantRepo;


    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {

        Address address=addressRepo.save(req.getAddress());

        Restaurant restaurant=new Restaurant();
        restaurant.setAddress(address);
        restaurant.setName(req.getName());
        System.out.println("contact info"+req.getContactInformation());
        restaurant.setContactInformation(req.getContactInformation());;
        restaurant.setCuisineType(req.getCuisineType());
        restaurant.setDescription(req.getDescription());
        restaurant.setImages(req.getImages());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);
        restaurant.setOpen(req.isOpen());
        System.out.println("rest"+restaurant.toString());
        return restaurantRepo.save(restaurant);
    }

    @Override
    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant) throws Exception {

        Restaurant restaurant=findRestaurantById(restaurantId);
        if(restaurant.getCuisineType()!=null)
        {
            restaurant.setCuisineType(updatedRestaurant.getCuisineType());
        }
        if(restaurant.getDescription()!=null)
        {
            restaurant.setDescription(updatedRestaurant.getDescription());
        }
        if(restaurant.getName()!=null)
        {
            restaurant.setName(updatedRestaurant.getName());
        }
        return restaurantRepo.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {

        Restaurant restaurant=findRestaurantById(restaurantId);
        restaurantRepo.delete(restaurant);
    }

    @Override
    public List<Restaurant> getAllRestaurant() {
        return restaurantRepo.findAll();
    }

    @Override
    public List<Restaurant> searchRestaurant(String keyword) {
        return restaurantRepo.findBySearchQuery(keyword);
    }

    @Override

    @Transactional
    public Restaurant findRestaurantById(Long id) throws Exception {
        Optional<Restaurant> opt = restaurantRepo.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Restaurant not found with id " + id);
        }
        // Ensuring the Restaurant is fully initialized before returning
        Restaurant restaurant = opt.get();
        restaurant.getName();  // Trigger initialization if lazy loading
        System.out.println(restaurant.getName());
        System.out.println(restaurant.getAddress());
        System.out.println(restaurant.getDescription());
        System.out.println(restaurant.getDescription());
        System.out.println(restaurant.getCuisineType());
        System.out.println(restaurant.getImages());
        System.out.println(restaurant.getContactInformation());

        System.out.println(restaurant.getOpeningHours());
        System.out.println(restaurant.getOrders());
        System.out.println(restaurant.getOwner());
        System.out.println(restaurant.getRegistrationDate());
        System.out.println(restaurant.getFoods());
        return restaurant;
    }



@Override
public Restaurant getRestaurantByUserId(Long userId) throws Exception {
    System.out.println("Fetching restaurant for user ID: " + userId);

    // Fetch the restaurant linked to the user by their ID
    Optional<Restaurant> restaurant = restaurantRepo.findByOwner_Id(userId);

    if (!restaurant.isPresent()) {
        throw new Exception("Restaurant not found for owner with ID: " + userId);
    }

    return restaurant.get();
}

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {

        Restaurant restaurant=findRestaurantById(restaurantId);
      RestaurantDto dto=new RestaurantDto();
      dto.setDescription(restaurant.getDescription());
      dto.setImages(restaurant.getImages());
      System.out.println("rest"+restaurant.getName());
      dto.setTitle(restaurant.getName());
      dto.setId(restaurantId);

      boolean isFavorited=false;
      List<RestaurantDto> favorites=user.getFavorites();
      for(RestaurantDto favorite:favorites)
      {
          if(favorite.getId().equals(restaurantId))
          {
              isFavorited=true;
              break;
          }
      }

      if(isFavorited)
      {
          favorites.removeIf(favorite->favorite.getId().equals(restaurantId));

      }
      else {
          favorites.add(dto);
      }
      userRepo.save(user);
        return dto;
    }

    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {
        Restaurant restaurant=findRestaurantById(id);
        System.out.println("before update rest is"+restaurant.isOpen());
        restaurant.setOpen(!restaurant.isOpen());
        System.out.println("after update rest is"+restaurant.isOpen());
        return restaurantRepo.save(restaurant);
    }
}
