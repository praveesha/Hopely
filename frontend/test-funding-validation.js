// Test the new funding validation by trying to exceed the remaining amount

async function testFundingValidation() {
  console.log('🧪 Testing funding validation...');
  
  // First, get current status of a shortage
  const shortageId = '72419e83-a425-43af-8d8d-bef68f4b8d0b'; // Paracetamol shortage
  
  console.log('\n📊 Getting current funding status...');
  const progressResponse = await fetch(`http://localhost:3001/api/donations/by-shortage/${shortageId}`);
  const progressResult = await progressResponse.json();
  
  if (!progressResult.success) {
    console.error('❌ Failed to get progress:', progressResult);
    return;
  }
  
  const { total_donated } = progressResult.data;
  const target = 50000; // LKR 50,000 target
  const remaining = Math.max(0, target - total_donated);
  
  console.log(`💰 Current status:`);
  console.log(`  Target: LKR ${target.toLocaleString()}`);
  console.log(`  Donated: LKR ${total_donated.toLocaleString()}`);
  console.log(`  Remaining: LKR ${remaining.toLocaleString()}`);
  console.log(`  Progress: ${((total_donated / target) * 100).toFixed(1)}%`);
  
  // Test scenarios
  const testCases = [
    {
      name: "Valid donation within limit",
      amount: Math.min(5000, remaining),
      shouldSucceed: remaining > 0
    },
    {
      name: "Exact remaining amount",
      amount: remaining,
      shouldSucceed: remaining > 0
    },
    {
      name: "Exceeds remaining by small amount",
      amount: remaining + 1000,
      shouldSucceed: false
    },
    {
      name: "Exceeds remaining by large amount",
      amount: remaining + 50000,
      shouldSucceed: false
    }
  ];
  
  for (const testCase of testCases) {
    if (testCase.amount <= 0) continue; // Skip invalid amounts
    
    console.log(`\n🔬 Test: ${testCase.name}`);
    console.log(`   Amount: LKR ${testCase.amount.toLocaleString()}`);
    
    const donationData = {
      order_id: `TEST_VALIDATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shortage_id: shortageId,
      hospital_id: 'CGH_001',
      donor_name: 'Validation Test',
      donor_email: 'test@validation.com',
      donor_phone: '+94777000000',
      donor_address: 'Test Address',
      donor_city: 'Colombo',
      amount: testCase.amount,
      medicine_name: 'Paracetamol 500mg',
      hospital_name: 'Colombo General Hospital',
      note: `Testing validation: ${testCase.name}`,
      merchant_id: '1231841'
    };
    
    try {
      const createResponse = await fetch('http://localhost:3001/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      
      const result = await createResponse.json();
      
      if (testCase.shouldSucceed) {
        if (result.success) {
          console.log(`   ✅ SUCCESS: ${result.message || 'Donation created'}`);
          if (result.funding_info?.was_capped) {
            console.log(`   📏 Amount capped to: LKR ${result.validated_amount.toLocaleString()}`);
          }
        } else {
          console.log(`   ❌ UNEXPECTED FAILURE: ${result.error}`);
        }
      } else {
        if (result.success) {
          console.log(`   ❌ UNEXPECTED SUCCESS: Should have been rejected`);
        } else {
          console.log(`   ✅ CORRECTLY REJECTED: ${result.error}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }
}

testFundingValidation().catch(console.error);
