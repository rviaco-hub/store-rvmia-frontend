import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../store/cart.store";
import { orderService } from "../../services/order.service";
import { paymentService } from "../../services/payment.service";
import "./Checkout.scss";

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { clear } = useCartStore();

  const [loading, setLoading] = useState(false);

  // const handleCheckout = async () => {
  //   try {
  //     setLoading(true);

  //     const order = await orderService.createOrder([]);
  //     console.log("order",order);
      

  //     const wompi = await paymentService.createWompi(
  //       order.data._id
  //     );
  //     console.log("wompi", wompi);
      

  //     const checkout = new window.WidgetCheckout({
  //       currency: "COP",
  //       amountInCents: wompi.amountInCents,
  //       reference: wompi.reference,
  //       publicKey: wompi.publicKey,
  //       redirectUrl: wompi.redirectUrl
  //     });

  //     checkout.open(async (result: any) => {
  //       const transaction =
  //         result?.transaction;

  //       if (
  //         transaction?.id &&
  //         transaction?.status ===
  //           "APPROVED"
  //       ) {
  //         await paymentService.confirmWompi(
  //           transaction.id,
  //           wompi.reference
  //         );

  //         clear();
  //         navigate("/orders");
  //       }
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleCheckout = async () => {
  try {
    setLoading(true);

    // 1. VERIFICAR SESIÓN
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // 2. OBTENER CARRO
    const cart = useCartStore.getState().items;

    if (!cart.length) {
      alert("Carrito vacío");
      return;
    }

    // // 3. 🚨 MODO PRUEBA (NO BACKEND ORDER REAL)
    // console.log("SIMULANDO PAGO...");

    // alert("🧪 SIMULACIÓN DE PAGO ACTIVADA");

    // setTimeout(() => {
    //   alert("✅ Pago simulado aprobado");

    //   useCartStore.getState().clear();

    //   navigate("/orders");
    // }, 1200);

    // return;


    const order = await orderService.createOrder([]);

    const wompi = await paymentService.createWompi(
      order.data._id
    );

    const checkout = new window.WidgetCheckout({
      currency: "COP",
      amountInCents: wompi.amountInCents,
      reference: wompi.reference,
      publicKey: wompi.publicKey,
      redirectUrl: wompi.redirectUrl
    });

    checkout.open(async (result: any) => {
      const transaction = result?.transaction;

      if (
        transaction?.id &&
        transaction?.status === "APPROVED"
      ) {
        await paymentService.confirmWompi(
          transaction.id,
          wompi.reference
        );

        clear();
        navigate("/orders");
      }
    });

  } finally {
    setLoading(false);
  }
};

  return (
  <div className="checkout-page">
    <div className="checkout-card">
      <h2>Finalizar compra</h2>

      <p>
        Completa tu pago seguro con Wompi.
      </p>

      <div className="checkout-total">
        <span>Total</span>
        <strong>Pagar ahora</strong>
      </div>

      <button
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading
          ? "Procesando..."
          : "Pagar con Wompi"}
      </button>
    </div>
  </div>
);
}