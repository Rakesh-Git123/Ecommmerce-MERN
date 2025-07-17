import Cart from '../models/cart.model.js';

//Add product to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.status(200).json({ success: true, message: "Add to cart successfully", cart });
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get cart for logged-in user
export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.status(200).json({ success: true, cart: cart || [] });
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update quantity of item
export const updateCartItem = async (req, res) => {
    const { productId, action } = req.body; // action: increment or decrement
    const userId = req.user._id;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
  
      if (action === 'increment') {
        item.quantity += 1;
      } else if (action === 'decrement') {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          return res.status(400).json({ success: false, message: 'Quantity cannot be less than 1' });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }
  
      await cart.save();
      res.status(200).json({ success: true, cart });
    } catch (err) {
      console.error("Update cart item error:", err.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Remove cart item error:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
