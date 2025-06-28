
// Payment utility functions

export const getPaymentRedirectUrls = () => {
  // Use window.location.origin to get the correct base URL (domain + port)
  const baseUrl = window.location.origin;
  
  return {
    successUrl: `${baseUrl}/payment/callback/esewa/success`,
    failureUrl: `${baseUrl}/payment/callback/esewa/failure`,
    khaltiSuccessUrl: `${baseUrl}/payment/callback/khalti/success`,
    khaltiFailureUrl: `${baseUrl}/payment/callback/khalti/failure`,
  };
};

// Extract payment data from URL parameters
export const extractPaymentParams = (searchParams: URLSearchParams) => {
  return {
    // eSewa params
    esewaData: searchParams.get('data'),
    
    // Khalti params
    khaltiPidx: searchParams.get('pidx'),
    khaltiAmount: searchParams.get('amount'),
    khaltiPurchaseOrderId: searchParams.get('purchase_order_id'),
    khaltiTransactionId: searchParams.get('transaction_id'),
  };
};

// Determine payment gateway from URL path
export const getPaymentGateway = (pathname: string): 'esewa' | 'khalti' | 'cod' | null => {
  if (pathname.includes('/esewa/')) return 'esewa';
  if (pathname.includes('/khalti/')) return 'khalti';
  return 'cod'; // Default for direct access
};

// Check if payment parameters are valid
export const validatePaymentParams = (gateway: string, params: any): boolean => {
  switch (gateway) {
    case 'esewa':
      return !!params.esewaData;
    case 'khalti':
      return !!(params.khaltiPidx && params.khaltiAmount && params.khaltiPurchaseOrderId && params.khaltiTransactionId);
    default:
      return true;
  }
};
