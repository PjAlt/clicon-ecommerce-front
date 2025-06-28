
/**
 * Get the correct redirect URLs for payment gateways
 * Uses window.location.origin to ensure correct domain and port
 */
export const getPaymentRedirectUrls = () => {
  const baseUrl = window.location.origin;
  
  return {
    esewa: {
      success_url: `${baseUrl}/payment/callback/esewa/success`,
      failure_url: `${baseUrl}/payment/callback/esewa/failure`
    },
    khalti: {
      return_url: `${baseUrl}/payment/callback/khalti/success`,
      website_url: baseUrl
    }
  };
};

/**
 * Generate eSewa payment form data with correct redirect URLs
 */
export const generateEsewaFormData = (
  amount: number,
  productDeliveryCharge: number = 0,
  productServiceCharge: number = 0,
  productCode: string,
  merchantCode: string
) => {
  const urls = getPaymentRedirectUrls();
  
  return {
    amt: amount,
    pdc: productDeliveryCharge,
    psc: productServiceCharge,
    txAmt: amount + productDeliveryCharge + productServiceCharge,
    tAmt: amount + productDeliveryCharge + productServiceCharge,
    pid: productCode,
    scd: merchantCode,
    su: urls.esewa.success_url,
    fu: urls.esewa.failure_url
  };
};

/**
 * Generate Khalti payment config with correct redirect URLs
 */
export const generateKhaltiConfig = (
  amount: number,
  productName: string,
  productIdentity: string,
  publicKey: string
) => {
  const urls = getPaymentRedirectUrls();
  
  return {
    publicKey: publicKey,
    productIdentity: productIdentity,
    productName: productName,
    productUrl: urls.khalti.website_url,
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    eventHandler: {
      onSuccess(payload: any) {
        console.log('Khalti payment success:', payload);
        // The success will be handled by the callback URL
        window.location.href = `${urls.khalti.return_url}?pidx=${payload.pidx}&amount=${amount}&purchase_order_id=${payload.purchase_order_id}&transaction_id=${payload.transaction_id}`;
      },
      onError(error: any) {
        console.log('Khalti payment error:', error);
        window.location.href = `${urls.khalti.website_url}/payment/khalti-failure`;
      },
      onClose() {
        console.log('Khalti widget closed');
      }
    }
  };
};
