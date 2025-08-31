// This script helps you manage pending donations and progress tracking

async function checkPendingDonations() {
  try {
    const response = await fetch('http://localhost:3001/api/donations/complete');
    const data = await response.json();
    
    if (data.success) {
      console.log(`📊 Found ${data.pending_count} pending donations:`);
      
      if (data.pending_count > 0) {
        data.pending_donations.forEach((donation, index) => {
          console.log(`${index + 1}. Order: ${donation.order_id}`);
          console.log(`   Amount: LKR ${donation.amount.toLocaleString()}`);
          console.log(`   Donor: ${donation.donor_name}`);
          console.log(`   Date: ${new Date(donation.created_at).toLocaleString()}`);
          console.log('');
        });
        
        const totalPending = data.pending_donations.reduce((sum, d) => sum + d.amount, 0);
        console.log(`💰 Total pending amount: LKR ${totalPending.toLocaleString()}`);
      } else {
        console.log('✅ No pending donations found!');
      }
    }
  } catch (error) {
    console.error('❌ Error checking pending donations:', error.message);
  }
}

async function completeAllPendingDonations() {
  try {
    const response = await fetch('http://localhost:3001/api/donations/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_pending' })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Completed ${data.modified_count} pending donations`);
      console.log('🎉 Progress bars should now be updated!');
    } else {
      console.error('❌ Failed to complete donations:', data.error);
    }
  } catch (error) {
    console.error('❌ Error completing donations:', error.message);
  }
}

// Usage examples:
console.log('🔍 Checking for pending donations...');
checkPendingDonations().then(() => {
  console.log('\n' + '='.repeat(50));
  console.log('💡 To complete all pending donations, run:');
  console.log('   completeAllPendingDonations()');
  console.log('💡 Or use curl command:');
  console.log('   curl -X POST "http://localhost:3001/api/donations/complete" \\');
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"action": "complete_pending"}\'');
});
