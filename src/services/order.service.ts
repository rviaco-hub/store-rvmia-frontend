import api from "./api";

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export const orderService = {
  // Usado por Checkout
  createOrder: async (items: OrderItemPayload[]) => {
    const res = await api.post("/orders", { items });
    return res.data;
  },

  // Usado por historial de órdenes
  getMyOrders: async () => {
    const res = await api.get("/orders/my");
    return res.data;
  }
};
