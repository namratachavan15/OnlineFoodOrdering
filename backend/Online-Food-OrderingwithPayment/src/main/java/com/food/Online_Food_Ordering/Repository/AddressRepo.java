package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepo extends JpaRepository<Address,Long> {


}
