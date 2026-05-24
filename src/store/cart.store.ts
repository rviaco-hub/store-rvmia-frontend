import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  quantity: number;
}

interface CartState {
  items: CartItem[];

  addItem: (
    product: Omit<CartItem, "quantity">
  ) => void;

  removeItem: (
    id: string
  ) => void;

  clear: () => void;

  total: () => number;
}

export const useCartStore =
  create<CartState>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (
          product
        ) => {
          const items =
            get().items;

          const existing =
            items.find(
              (i) =>
                i._id ===
                product._id
            );

          if (existing) {
            set({
              items:
                items.map(
                  (i) =>
                    i._id ===
                    product._id
                      ? {
                          ...i,
                          quantity:
                            i.quantity +
                            1
                        }
                      : i
                )
            });
          } else {
            set({
              items: [
                ...items,
                {
                  ...product,
                  quantity: 1
                }
              ]
            });
          }
        },

        removeItem: (
          id
        ) =>
          set({
            items:
              get().items.filter(
                (i) =>
                  i._id !==
                  id
              )
          }),

        clear: () =>
          set({
            items: []
          }),

        total: () =>
          get().items.reduce(
            (
              sum,
              i
            ) =>
              sum +
              i.price *
                i.quantity,
            0
          )
      }),
      {
        name:
          "rvmia-cart"
      }
    )
  );