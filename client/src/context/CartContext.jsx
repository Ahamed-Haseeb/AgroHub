import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem('agrohub_cart')) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.listing_id === action.payload.listing_id);
      const incQty = action.payload.quantity_kg || 0.1;
      
      if (existing) {
        return state.map(i => {
          if (i.listing_id === action.payload.listing_id) {
            const sum = i.quantity_kg + incQty;
            const newQty = Number(Math.min(1000, i.available_kg, sum).toFixed(2));
            return { ...i, quantity_kg: newQty };
          }
          return i;
        });
      }
      return [...state, { ...action.payload, quantity_kg: incQty }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.listing_id !== action.payload);
    case 'UPDATE_QTY':
      return state.map(i => {
        if (i.listing_id === action.payload.id) {
          const qty = Number(Math.max(0.1, Math.min(1000, i.available_kg, action.payload.qty)).toFixed(2));
          return { ...i, quantity_kg: qty };
        }
        return i;
      });
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('agrohub_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartTotal = cart.reduce((total, item) => total + (item.price_per_kg * item.quantity_kg), 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
