// import md5 from 'md5';

// export function generateSignature(data: Record<string, string>, passphrase: string): string {
//   // Build the query string in the specified order (not sorted alphabetically)
//   let queryString = '';

//   // The required order should match Payfast's API documentation
//   const keysOrder = [
//     'merchant_id', 'merchant_key', 'm_payment_id', 'amount', 'item_name', 'email_address', 
//     'name_first', 'name_last', 'return_url', 'cancel_url', 'notify_url' // Other fields as necessary
//   ];

//   // Loop through keys in the specified order and add them to the query string if they are non-empty
//   keysOrder.forEach(key => {
//     if (data[key] && data[key] !== '') {
//       queryString += `${key}=${encodeURIComponent(String(data[key])).replace(/%20/g, '+')}&`;
//     }
//   });

//   // Remove the trailing '&' from queryString
//   queryString = queryString.slice(0, -1);

//   // Add the passphrase to the end of the string
//   const stringToHash = `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;

//   // Generate and return the MD5 hash (ensure it's uppercase)
//   return md5(stringToHash).toUpperCase();
// }
