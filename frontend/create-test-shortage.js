// Test script to create a shortage with funding information
const createTestShortage = async () => {
  const testShortage = {
    medicineName: "Paracetamol 500mg",
    genericName: "Acetaminophen", 
    urgencyLevel: "HIGH",
    quantityNeeded: 5000,
    unit: "tablets",
    description: "Urgent shortage of paracetamol tablets for fever management",
    estimatedFunding: 50000, // LKR 50,000
    costPerUnit: 10, // LKR 10 per tablet
    fundingNote: "Based on supplier quote - LKR 10 per tablet × 5000 tablets"
  };

  try {
    const response = await fetch('http://localhost:3001/api/shortages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testShortage),
    });

    const result = await response.json();
    console.log('Test shortage created:', result);
    
    if (result.success) {
      console.log('✅ Successfully created test shortage with funding information!');
      console.log('Shortage ID:', result.data.id);
    } else {
      console.log('❌ Failed to create shortage:', result.message);
    }
  } catch (error) {
    console.error('Error creating test shortage:', error);
  }
};

// Run the test
createTestShortage();
