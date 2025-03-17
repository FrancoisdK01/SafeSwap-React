//using base component PaymentStatus

import PaymentStatus from "../components/PaymentStatus";

const PaymentCancel = () => {
  return (
    <PaymentStatus
      title="Payment Canceled"
      message="Your payment was canceled. No funds were deducted."
      bgColor="bg-red-500"
      textColor="text-red-600"
    />
  );
};

export default PaymentCancel;
