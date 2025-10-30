// Test send notifications functionality
async function testSendNotifications() {
  console.log('🧪 Testing Send Notifications Functionality...\n');

  try {
    // Test 1: Check if backend is running
    console.log('📋 Step 1: Checking Backend Status');
    try {
      const healthResponse = await fetch('http://localhost:5000');
      if (healthResponse.ok) {
        console.log('✅ Backend is running');
      } else {
        console.log('❌ Backend not responding properly');
        return;
      }
    } catch (error) {
      console.log('❌ Backend not running on localhost:5000');
      console.log('Trying IP address...');
      try {
        const ipResponse = await fetch('http://192.168.1.7:5000');
        if (ipResponse.ok) {
          console.log('✅ Backend is running on IP address');
        } else {
          console.log('❌ Backend not accessible');
          return;
        }
      } catch (ipError) {
        console.log('❌ Cannot reach backend on either localhost or IP');
        return;
      }
    }

    // Test 2: Send a test notification
    console.log('\n📋 Step 2: Testing Send Notification API');

    const testNotification = {
      title: 'Test Notification from API',
      message:
        'This is a test notification to verify the send notifications functionality is working properly.',
      targetRole: 'all', // Send to all users
    };

    console.log(
      '📝 Sending notification:',
      JSON.stringify(testNotification, null, 2),
    );

    const notificationResponse = await fetch(
      'http://localhost:5000/api/admin/send-notification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testNotification),
      },
    );

    console.log('📡 Response Status:', notificationResponse.status);
    console.log('📡 Response Status Text:', notificationResponse.statusText);

    const responseText = await notificationResponse.text();
    console.log('📄 Raw Response:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('📊 Parsed Response:', JSON.stringify(responseJson, null, 2));

      if (responseJson.success) {
        console.log('✅ Notification sent successfully!');
        console.log(
          `📧 Recipients: ${
            responseJson.notification?.recipientCount || 'Unknown'
          }`,
        );
        console.log(
          `📝 Notification ID: ${responseJson.notification?.id || 'Unknown'}`,
        );
      } else {
        console.log('❌ Notification failed:', responseJson.message);
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response:', parseError.message);
    }

    // Test 3: Try with specific role
    console.log('\n📋 Step 3: Testing Notification to Specific Role');

    const roleNotification = {
      title: 'Student-Only Test Notification',
      message: 'This notification should only go to students.',
      targetRole: 'student',
    };

    const roleResponse = await fetch(
      'http://localhost:5000/api/admin/send-notification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleNotification),
      },
    );

    const roleResponseText = await roleResponse.text();
    console.log('📊 Role-specific response:', roleResponseText);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSendNotifications();
