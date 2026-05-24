import api from "./api";

export const paymentService = {
  createWompi: async (orderId: string) => {
    const res = await api.post("/payments/wompi", {
      orderId
    });

    return res.data.data;
  },

  confirmWompi: async (
    transactionId: string,
    reference: string
  ) => {
    const res = await api.post(
      "/payments/wompi/confirm",
      {
        transactionId,
        reference
      }
    );

    return res.data;
  }
};