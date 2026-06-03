import React, { useEffect } from 'react'


import { Route,Routes } from 'react-router-dom';
import CreateRestaurantForm from '../../AdminComponent/CreateRestaurant/CreateRestaurantForm';
import Admin from '../../AdminComponent/Admin/Admin';
import { useRestaurantContext } from '../State/Restaurant/RestaurantContext';

const AdminRoute = () => {
  const{getRestaurantByUserId,usersRestaurant}=useRestaurantContext()
  console.log("userrest"+usersRestaurant);
 const jwt=localStorage.getItem('jwt')

  useEffect(()=>
  {
    if(jwt)
    {
      getRestaurantByUserId(jwt); 
    }
  },[jwt])
  return (
    <div>
      <Routes>
        {/* <Route path='/*' element={!restaurant?<CreateRestaurantForm/>:<Admin/>}> */}
        <Route path='/*' element={!usersRestaurant?<CreateRestaurantForm/>:<Admin/>}>
        </Route>
      </Routes>
    </div>
  )
}

export default AdminRoute
