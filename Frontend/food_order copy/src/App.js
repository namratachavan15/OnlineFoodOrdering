import './App.css';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './Theme/DarkTheme';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './component/Auth/AuthContext';
import { CartProvider, useCart } from './component/State/Cart/CartContext';
import { IngredientsProvider } from './component/State/Ingredient/IngredientsContext';
import { MenuItemProvider } from './component/State/Menu/MenuItemContext';
import { OrderProvider } from './component/State/Order/OrderContext';
import { RestaurantProvider, useRestaurantContext } from './component/State/Restaurant/RestaurantContext';
import { RestaurantOrderProvider } from './component/State/RestaurantOrder/OrderContext';
import Routers from './component/Routers/Routers';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <IngredientsProvider>
          <MenuItemProvider>
            <OrderProvider>
              <RestaurantProvider>
                <RestaurantOrderProvider>
                  <MainApp />
                </RestaurantOrderProvider>
              </RestaurantProvider>
            </OrderProvider>
          </MenuItemProvider>
        </IngredientsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user, jwt, fetchUser } = useAuth(); // Destructure the values from useAuth
  const { findCart } = useCart(); // Get cart functions from CartContext
  const { getRestaurantByUserId } = useRestaurantContext(); // Get restaurant functions from RestaurantContext

  const [isDataFetched, setIsDataFetched] = useState(false); // State to track if data has been fetched

  // Fetch user data and cart details when JWT changes (only once when jwt is available)
  useEffect(() => {
    if (jwt && !isDataFetched) {
      // We want to fetch user data and cart details only if JWT is available
      fetchUser(jwt); // Fetch user details
      findCart(jwt); // Find cart details
     // getRestaurantByUserId(jwt); // Get restaurant details by user ID
      setIsDataFetched(true); // Set data fetched flag to true to avoid re-fetching
    }
  }, [jwt, fetchUser, findCart, isDataFetched]); // Dependency on `jwt` and `isDataFetched`

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
