import PaymentStatus from "../components/PaymentStatus";

const PaymentSuccess = () => {
  return (
    <PaymentStatus
      title="Payment Successful!"
      message="Your payment has been processed successfully."
      bgColor="bg-blue-500"
      textColor="text-green-600"
    />
  );
};

export default PaymentSuccess;
