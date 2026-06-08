"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ShoppingCart, ShoppingBag, X, Plus, Minus, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "./useCartStore";

export const CartWidgetSettings = () => {
  const { actions: { setProp }, style } = useNode((node) => ({
    style: node.data.props.style,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Icon Style</label>
        <select 
          value={style || "dark"} 
          onChange={(e) => setProp((p: any) => { p.style = e.target.value; })}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="brand">Brand Color</option>
        </select>
      </div>
    </div>
  );
};

export const CartWidget = ({ style = "dark" }: { style?: "dark"|"light"|"brand" }) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const cartItems = useCartStore(state => state.items);
  const isCartOpen = useCartStore(state => state.isOpen);
  const setIsCartOpen = useCartStore(state => state.setIsOpen);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // In preview/production, this hits the real API. We simulate a wait here.
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Checkout simulation successful. You would be redirected to Stripe here.");
      useCartStore.getState().clearCart();
      setIsCartOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getStyleClasses = () => {
    switch (style) {
      case "light": return "bg-white text-gray-900 border border-gray-200";
      case "brand": return "bg-emerald-600 text-white";
      case "dark": default: return "bg-gray-900 text-white";
    }
  };

  return (
    <>
      <div
        ref={(ref) => { connect(drag(ref as HTMLElement)); }}
        onClick={() => setIsCartOpen(true)}
        className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow ${getStyleClasses()} ${isSelected ? 'outline outline-2 outline-emerald-500 outline-offset-2' : ''}`}
      >
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {totalItems}
          </div>
        )}
      </div>

      {/* Slide-out Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end font-sans">
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart size={20} /> Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingCart size={32} />
                  </div>
                  <p className="font-medium text-gray-500">Your cart is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-lg mt-4">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                        
                        <div className="mt-auto flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <button 
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-col gap-4">
                <div className="flex justify-between items-center font-bold text-lg text-gray-900">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout.</p>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCheckingOut ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
                  {isCheckingOut ? "Processing..." : "Checkout via Stripe"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

CartWidget.craft = {
  displayName: "Cart Widget",
  props: { style: "dark" },
  rules: { canDrag: () => true },
  related: { settings: CartWidgetSettings },
};
