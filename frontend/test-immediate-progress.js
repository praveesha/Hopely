async function createTestDonation() {
  console.log('📝 Creating test donation for LKR 50,000...');
  
  const donationData = {
    order_id: 'TEST_IMMEDIATE_' + Date.now(),
    shortage_id: '72419e83-a425-43af-8d8d-bef68f4b8d0b', // Using the Paracetamol shortage
    hospital_id: 'CGH_001',
    donor_name: 'Immediate Progress Test',
    donor_email: 'immediate@test.com',
    donor_phone: '+94777777777',
    donor_address: '999 Test Avenue',
    donor_city: 'Colombo',
    amount: 50000,
    medicine_name: 'Paracetamol 500mg',
    hospital_name: 'Colombo General Hospital',
    note: 'Testing immediate progress bar update',
    merchant_id: '1231841'
  };

  try {
    // Create donation record
    const createResponse = await fetch('http://localhost:3001/api/donations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    });

    const createResult = await createResponse.json();
    console.log('✅ Donation created:', createResult);

    // Immediately check progress (should update even with pending status)
    console.log('\n📊 Checking progress immediately...');
    const progressResponse = await fetch(`http://localhost:3001/api/donations/by-shortage/72419e83-a425-43af-8d8d-bef68f4b8d0b`);
    const progressResult = await progressResponse.json();
    
    if (progressResult.success) {
      const { total_donated, donation_count, status_breakdown } = progressResult.data;
      const target = 50000; // LKR 50,000 target
      const progressPercentage = (total_donated / target) * 100;
      
      console.log('✅ Progress updated immediately!');
      console.log(`  💰 Total donated: LKR ${total_donated.toLocaleString()}`);
      console.log(`  📊 Donation count: ${donation_count}`);
      console.log(`  📈 Progress: ${progressPercentage.toFixed(1)}%`);
      console.log(`  📋 Status breakdown:`, status_breakdown);
    } else {
      console.log('❌ Failed to get progress:', progressResult);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestDonation();
