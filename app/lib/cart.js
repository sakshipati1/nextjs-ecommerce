export const CART_STORAGE_KEY = "mumbai-society-cart";

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

function resolveProductId(product) {
  return product?._id || product?.id || product?.title || "";
}

export function getCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") {
    return cart;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  notifyCartUpdated();
  return cart;
}

export function addToCart(product) {
  if (!product) return getCart();

  const cart = getCart();
  const productId = resolveProductId(product);
  const existingItem = cart.find(
    (item) => resolveProductId(item) === productId,
  );

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1, productId });
  }

  return saveCart(cart);
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const nextCart = cart
    .map((item) => {
      if (resolveProductId(item) === productId) {
        return { ...item, quantity: Math.max(0, quantity) };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  return saveCart(nextCart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => resolveProductId(item) !== productId);
  return saveCart(cart);
}

export function clearCart() {
  return saveCart([]);
}
