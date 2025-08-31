// Test script to create a test donation
const createTestDonation = async () => {
  const testDonation = {
    order_id: `TEST_ORDER_${Date.now()}`,
    shortage_id: "72419e83-a425-43af-8d8d-bef68f4b8d0b", // Use the shortage ID from our test shortage
    hospital_id: "CGH_001",
    donor_name: "John Doe",
    donor_email: "john@example.com",
    donor_phone: "+94771234567",
    donor_address: "123 Test Street",
    donor_city: "Colombo",
    amount: 10000, // LKR 10,000
    medicine_name: "Paracetamol 500mg",
    hospital_name: "Colombo General Hospital",
    note: "Test donation for progress tracking",
    merchant_id: "1231841"
  };

  try {
    // 1. Create donation record
    const response = await fetch('http://localhost:3001/api/donations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDonation),
    });

    const result = await response.json();
    console.log('Test donation created:', result);
    
    if (result.success) {
      console.log('✅ Donation record created with ID:', result.donation_id);
      
      // 2. Simulate payment completion by updating the donation to 'completed' status
      // In real scenario, this would be done by PayHere webhook
      const updatePayload = {
        merchant_id: testDonation.merchant_id,
        order_id: testDonation.order_id,
        payhere_amount: testDonation.amount.toString(),
        payhere_currency: 'LKR',
        status_code: '2', // Success status
        payment_id: `PH_${Date.now()}`,
        method: 'VISA',
        md5sig: 'test_signature' // This would normally be verified
      };
      
      // Create form data as PayHere sends form-encoded data
      const formData = new FormData();
      Object.entries(updatePayload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      console.log('🔄 Simulating payment completion...');
      const webhookResponse = await fetch('http://localhost:3001/api/payments/notify', {
        method: 'POST',
        body: formData
      });
      
      const webhookResult = await webhookResponse.text();
      console.log('Webhook response:', webhookResult);
      
      // 3. Check donation progress after completion
      console.log('📊 Checking updated donation progress...');
      const progressResponse = await fetch(`http://localhost:3001/api/donations/by-shortage/${testDonation.shortage_id}`);
      const progressData = await progressResponse.json();
      console.log('Updated progress:', progressData);
      
      if (progressData.success && progressData.data.total_donated > 0) {
        console.log('🎉 SUCCESS! Progress tracking is working!');
        console.log(`💰 Total donated: LKR ${progressData.data.total_donated.toLocaleString()}`);
        console.log(`🏥 Estimated funding: LKR 50,000`);
        console.log(`📈 Progress: ${((progressData.data.total_donated / 50000) * 100).toFixed(1)}%`);
      } else {
        console.log('❌ Progress not updated properly');
      }
      
    } else {
      console.log('❌ Failed to create donation:', result.error);
    }
  } catch (error) {
    console.error('Error creating test donation:', error);
  }
};

// Run the test
createTestDonation();
