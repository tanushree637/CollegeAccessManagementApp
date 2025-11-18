// Test dashboard API and user creation with real email
async function testFullWorkflow() {
  console.log('🧪 Testing Full User Creation and Dashboard Workflow...\n');

  try {
    // Test 1: Check dashboard before user creation
    console.log('📋 Step 1: Testing Dashboard API');
    const dashboardResponse = await fetch(
      'http://10.176.117.53:5000/api/admin/dashboard',
    );
    console.log('Dashboard Status:', dashboardResponse.status);

    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log(
        '✅ Dashboard working - Total Users:',
        dashboardData.stats?.totalUsers || 'Unknown',
      );
    } else {
      console.log('❌ Dashboard Error:', dashboardResponse.statusText);
      const errorText = await dashboardResponse.text();
      console.log('Error details:', errorText);
    }

    // Test 2: Create a user with your actual email
    console.log('\n📋 Step 2: Creating User with Real Email');
    const testUser = {
      fullName: 'Test User Real Email',
      email: 'tanushreesrivastav7@gmail.com', // Your email
      role: 'student',
    };

    const createResponse = await fetch(
      'http://localhost:5000/api/admin/create-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      },
    );

    console.log('Create User Status:', createResponse.status);

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ User Created Successfully');
      console.log('Email Sent:', createData.emailSent);
      console.log('Total Users:', createData.totalUsers);
      console.log('User Details:', createData.user);
    } else {
      console.log('❌ User Creation Failed');
      const errorText = await createResponse.text();
      console.log('Error details:', errorText);
    }

    // Test 3: Check dashboard after user creation
    console.log('\n📋 Step 3: Testing Dashboard After User Creation');
    const dashboardResponse2 = await fetch(
      'http://localhost:5000/api/admin/dashboard',
    );

    if (dashboardResponse2.ok) {
      const dashboardData2 = await dashboardResponse2.json();
      console.log(
        '✅ Dashboard after creation - Total Users:',
        dashboardData2.stats?.totalUsers || 'Unknown',
      );
    } else {
      console.log('❌ Dashboard still failing after user creation');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullWorkflow();
