export const getCheckoutUrl=async(userId:string)=>{

    try{
     const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: "pri_01jw3d3kfdrrdasmrj38858m3j",
            userId
          })
        });

        if (!response.ok) throw new Error('Failed to create checkout');
        
        const { data } = await response.json();
        const checkoutUrl = data?.checkout?.url;
        
        if (!checkoutUrl) throw new Error('Missing checkout URL');

        // 2. استخراج txnId بطريقة آمنة
        const urlObj = new URL(checkoutUrl);
        const txnId = urlObj.searchParams.get('_ptxn');
        
        if (!txnId) throw new Error('Transaction ID not found');
        return txnId
    }catch(err){
        console.log(err)

    }
}