const crypto = require('crypto');

// PayHere configuration
const merchant_id = '1231841';
const merchant_secret = 'MzQ2MzAzNTY0NDQwMTQ0NDI2NTM3MTU0MjMzNzMxMDM3MjQ4NzE4';
const order_id = 'REAL_ORDER_' + Date.now();
const payhere_amount = '15000.00';
const payhere_currency = 'LKR';
const status_code = '2'; // Success

// Calculate signature the same way PayHere does
const merchant_secret_hash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
const local_md5sig_string = merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchant_secret_hash;
const md5sig = crypto.createHash('md5').update(local_md5sig_string).digest('hex').toUpperCase();

console.log('🔐 Signature calculation:');
console.log('  merchant_secret:', merchant_secret);
console.log('  merchant_secret_hash:', merchant_secret_hash);
console.log('  signature_string:', local_md5sig_string);
console.log('  calculated signature:', md5sig);

// Create the donation record first
async function createDonationAndTestWebhook() {
  console.log('\n📝 Step 1: Creating donation record...');
  
  const donationData = {
    order_id,
    shortage_id: '72419e83-a425-43af-8d8d-bef68f4b8d0b', // Using existing shortage
    hospital_id: 'CGH_001',
    donor_name: 'Real Payment Test',
    donor_email: 'realtest@example.com',
    donor_phone: '+94771111111',
    donor_address: '789 Real Street',
    donor_city: 'Colombo',
    amount: parseFloat(payhere_amount),
    medicine_name: 'Paracetamol 500mg',
    hospital_name: 'Colombo General Hospital',
    note: 'Real PayHere webhook test',
    merchant_id
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

    console.log('\n📤 Step 2: Simulating real PayHere webhook...');

    // Simulate real PayHere webhook with proper signature
    const webhookData = new URLSearchParams({
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id: 'SANDBOX_PAYMENT_' + Date.now(),
      method: 'VISA'
    });

    const webhookResponse = await fetch('http://localhost:3001/api/payments/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: webhookData,
    });

    const webhookResult = await webhookResponse.json();
    console.log('✅ Webhook response:', webhookResult);

    console.log('\n📊 Step 3: Checking donation progress...');

    // Check the donation progress
    const progressResponse = await fetch(`http://localhost:3001/api/donations/by-shortage/72419e83-a425-43af-8d8d-bef68f4b8d0b`);
    const progressResult = await progressResponse.json();
    
    if (progressResult.success) {
      const { total_donated, donation_count } = progressResult.data;
      const target = 50000; // LKR 50,000 target
      const progressPercentage = (total_donated / target) * 100;
      
      console.log('✅ Progress updated!');
      console.log(`  💰 Total donated: LKR ${total_donated.toLocaleString()}`);
      console.log(`  📊 Donation count: ${donation_count}`);
      console.log(`  📈 Progress: ${progressPercentage.toFixed(1)}%`);
    } else {
      console.log('❌ Failed to get progress:', progressResult);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDonationAndTestWebhook();
