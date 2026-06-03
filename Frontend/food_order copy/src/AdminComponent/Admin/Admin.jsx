import React, { useEffect,useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSideBar from './AdminSidebar';
import { useAuth } from '../../component/Auth/AuthContext';
import Dashboard from '../Dashboard/Dashboard';
import Order from '../Orders/Order';
import Menu from '../Menu/Menu';
import FoodCategory from '../FoodCategory/FoodCategory';
import Ingredients from '../Ingredients/Ingredients';
import Events from '../Events/Events';
import RestaurantDetails from './RestaurantDetails';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import { useOrderContext } from '../../component/State/RestaurantOrder/OrderContext';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const jwt = localStorage.getItem("jwt");
  const { usersRestaurant, getRestaurantsCategory } = useRestaurantContext();
  const { fetchRestaurantOrder } = useOrderContext();

  useEffect(() => {
    getRestaurantsCategory({ jwt, restaurantId: usersRestaurant?.id });
    fetchRestaurantOrder({ restaurantId: usersRestaurant?.id, jwt });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("clicked");
  };

  return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
//       {/* Top Navbar */}
//     <nav className="navbar navbar-light bg-light">
//   <div className="container-fluid">
//     <button
//       className="navbar-toggler d-lg-none"
//       type="button"
//       data-bs-toggle="collapse"
//       data-bs-target="#sidebarMenu"
//       aria-controls="sidebarMenu"
//       aria-expanded="false"
//       aria-label="Toggle navigation"
//     >
//       <span className="navbar-toggler-icon"></span>
//     </button>
//   </div>
// </nav>

// <div className="collapse d-lg-block" id="sidebarMenu">
//   <AdminSideBar />
// </div>

    
//       {/* Main Content */}
//       <div
//         className="content-area"
//         style={{
//           marginTop: '56px',
//           marginLeft: '250px',
//           padding: '20px',
//           transition: 'margin-left 0.3s',
//           flex: 1,
//         }}
//       >
<div className="d-flex flex-column" style={{ height:"auto"}}>
      {/* Top Navbar */}
    <nav className="navbar navbar-light bg-light d-md-none w-100" style={{ position: 'fixed', zIndex: 1030,width:'100%' }}>
        <div className="container-fluid">
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar d-block d-md-none" style={{ position: 'absolute', zIndex: 2000 }}>
          <AdminSideBar onItemClick={() => setSidebarOpen(false)}/>
        </div>
      )}
    <div className="d-none d-md-block">
  <AdminSideBar />
</div>


      {/* Main Content */}
     <div
        className="content-area"
        style={{
          flex: 1,
          // marginLeft: showSidebar ? '250px' : '0',
          transition: 'margin-left 0.3s',
          padding: '20px',
          marginLeft:'270px'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/category" element={<FoodCategory />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/event" element={<Events />} />
          <Route path="/details" element={<RestaurantDetails />} />
        </Routes>
      </div>
    </div>
    
  );
};

export default Admin;
