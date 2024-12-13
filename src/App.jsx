import React from 'react';
import ReactDOM from 'react-dom';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Redux Slice for Cart
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // Add item to cart
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.name === action.payload.name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Remove item from cart
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload.name);
    },

    // Update quantity of a cart item
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
  },
});

const { addItem, removeItem, updateQuantity } = cartSlice.actions;

// Redux store
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// ProductList Component
const ProductList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items); // Access cart state

  const plantsArray = [
    { name: 'Cactus', cost: '$10', description: 'A small cactus', image: 'cactus.jpg' },
    { name: 'Ficus', cost: '$15', description: 'A tall ficus', image: 'ficus.jpg' },
  ];

  const getCartQuantity = (plantName) => {
    const item = cartItems.find((item) => item.name === plantName);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant)); // Dispatch the action to add the plant
  };

  return (
    <div className="product-list">
      <h1>Plants for Sale</h1>
      <div className="product-grid">
        {plantsArray.map((plant) => (
          <div key={plant.name} className="product-card">
            <img src={plant.image} alt={plant.name} />
            <h3>{plant.name}</h3>
            <p>{plant.description}</p>
            <p>{plant.cost}</p>
            <p>In Cart: {getCartQuantity(plant.name)}</p>
            <button onClick={() => handleAddToCart(plant)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// CartItem Component
const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = () => {
    if (item.quantity === 1) {
      dispatch(removeItem({ name: item.name }));
    } else {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeItem({ name: item.name }));
  };

  const calculateTotalCost = () => {
    return (parseFloat(item.cost.replace('$', '')) * item.quantity).toFixed(2);
  };

  return (
    <div className="cart-item">
      <h2>{item.name}</h2>
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <p>{item.description}</p>
      <p>{item.cost} per unit</p>
      <div className="quantity-controls">
        <button onClick={handleDecrement}>-</button>
        <span>{item.quantity}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
      <p>Subtotal: ${calculateTotalCost()}</p>
      <button onClick={handleRemove}>Remove from Cart</button>
    </div>
  );
};

// CartPage Component
const Cart = ({ onContinueShopping }) => {
  const cartItems = useSelector((state) => state.cart.items);

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.cost.replace('$', '')) * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => <CartItem key={item.name} item={item} />)
      )}
      <div className="cart-summary">
        <h3>Total: ${calculateTotalAmount()}</h3>
        <button onClick={onContinueShopping}>Continue Shopping</button>
        <button onClick={() => alert('Functionality to be added for future reference')}>Checkout</button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [showCart, setShowCart] = React.useState(false);

  const handleContinueShopping = () => {
    setShowCart(false);
  };

  return (
    <div>
      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? 'Go to Product List' : 'View Cart'}
      </button>
      {showCart ? <Cart onContinueShopping={handleContinueShopping} /> : <ProductList />}
    </div>
  );
};

// Rendering the App Component with Redux Provider
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
