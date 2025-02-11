// import React from 'react';
// import { Transaction } from '../../types/transaction';
// import { createPaymentForm } from '../../utils/payment/createPaymentForm';
// import { PAYFAST_CONFIG } from '../../utils/payment/payfast';
// import { FaCreditCard } from 'react-icons/fa';

// interface PayFastFormProps {
//   transaction: Transaction;
//   userEmail: string;
// }

// export default function PayFastForm({ transaction, userEmail }: PayFastFormProps) {
//   const { formUrl, formData } = createPaymentForm(PAYFAST_CONFIG, transaction, userEmail);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = formUrl;
//     form.target = '_blank';

//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== undefined) {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = value;
//         form.appendChild(input);
//       }
//     });

//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       <button
//         type="submit"
//         className="w-full bg-blue-500 text-white py-4 px-8 rounded-xl font-medium 
//           hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//       >
//         <FaCreditCard />
//         <span>Pay R {transaction.price.toFixed(2)}</span>
//       </button>
//     </form>
//   );
// }