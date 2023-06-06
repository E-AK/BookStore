import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  title: string;
  price: number;
  checked: boolean;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Загрузка данных корзины из localStorage
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  // Обновление данных корзины в localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCheckboxChange = (itemId: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updatedCartItems);
  };

  const handlePaymentClick = () => {
    const selectedItems = cartItems.filter((item) => item.checked);
    console.log('Selected Items:', selectedItems);
  };

  return (
    <div className="container custom-scrollbar custom-cursor">
      <h1>Cart</h1>
      <div className="row">
        {cartItems.map((item) => (
          <div className="col-md-4" key={item.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">Price: ${item.price}</p>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item.id}
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <label className="form-check-label">Select</label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handlePaymentClick}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default CartPage;
