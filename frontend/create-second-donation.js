// Quick test to create another donation and see progress update
const createAnotherTestDonation = async () => {
  const orderId = `TEST_ORDER_${Date.now()}`;
  
  // 1. Create donation
  const donationData = {
    order_id: orderId,
    shortage_id: "72419e83-a425-43af-8d8d-bef68f4b8d0b",
    hospital_id: "CGH_001", 
    donor_name: "Jane Smith",
    donor_email: "jane@example.com",
    donor_phone: "+94779876543",
    donor_address: "456 Another Street",
    donor_city: "Colombo",
    amount: 10000, // Another LKR 10,000
    medicine_name: "Paracetamol 500mg",
    hospital_name: "Colombo General Hospital",
    note: "Second test donation",
    merchant_id: "1231841"
  };

  // Create donation
  const createResponse = await fetch('http://localhost:3001/api/donations/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData)
  });
  
  const createResult = await createResponse.json();
  console.log('✅ Second donation created:', createResult.donation_id);

  // Complete the donation via webhook
  const completionResponse = await fetch('http://localhost:3001/api/payments/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      merchant_id: '1231841',
      order_id: orderId,
      payhere_amount: '10000',
      payhere_currency: 'LKR', 
      status_code: '2',
      md5sig: 'BYPASS_FOR_TEST',
      payment_id: `PH_TEST_${Date.now()}`,
      method: 'VISA'
    })
  });
  
  console.log('✅ Donation completed via webhook');

  // Check updated progress
  const progressResponse = await fetch('http://localhost:3001/api/donations/by-shortage/72419e83-a425-43af-8d8d-bef68f4b8d0b');
  const progressData = await progressResponse.json();
  
  console.log('📊 Updated Progress:');
  console.log(`💰 Total donated: LKR ${progressData.data.total_donated.toLocaleString()}`);
  console.log(`👥 Total donations: ${progressData.data.donation_count}`);
  console.log(`🎯 Target funding: LKR 50,000`);
  console.log(`📈 Progress: ${((progressData.data.total_donated / 50000) * 100).toFixed(1)}%`);
};

createAnotherTestDonation();
