const API_BASE_URL = 'http://localhost:3001';
const TEST_USER_ID = 'test-user-123';

// Helper function to make API calls and log results
async function testEndpoint(method, url, body = null, description = '') {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`${method} ${url}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Helper function to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAllTests() {
  console.log('🚀 Starting YouTube Clone API Tests\n');
  console.log('=' * 50);
  
  // Test 1: Health Check
  await testEndpoint('GET', `${API_BASE_URL}/health`, null, 'Health Check');
  
  // Test 2: Get All Videos
  const videosResponse = await testEndpoint('GET', `${API_BASE_URL}/api/videos`, null, 'Get All Videos');
  
  // Get a video ID for testing (assuming we have at least one video)
  let testVideoId = null;
  if (videosResponse && videosResponse.data && videosResponse.data.length > 0) {
    testVideoId = videosResponse.data[0].id;
    console.log(`📝 Using test video ID: ${testVideoId}`);
  }
  
  // Test 3: Search Videos
  await testEndpoint('GET', `${API_BASE_URL}/api/videos?search=react`, null, 'Search Videos (query: "react")');
  
  // Test 4: Get Video by ID (if we have one)
  if (testVideoId) {
    await testEndpoint('GET', `${API_BASE_URL}/api/videos/${testVideoId}`, null, 'Get Video by ID');
  }
  
  // Test 5: Create New Video
  const newVideo = {
    title: 'Test Video - API Testing',
    thumbnailUrl: 'https://picsum.photos/320/180?random=999',
    channelName: 'Test Channel',
    viewCount: '1K',
    duration: '5:30',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  };
  
  const createResponse = await testEndpoint('POST', `${API_BASE_URL}/api/videos`, newVideo, 'Create New Video');
  let createdVideoId = null;
  if (createResponse && createResponse.data) {
    createdVideoId = createResponse.data.id;
  }
  
  // Test 6: Update Video (if we created one)
  if (createdVideoId) {
    const updateData = {
      title: 'Updated Test Video - API Testing',
      viewCount: '2K'
    };
    await testEndpoint('PUT', `${API_BASE_URL}/api/videos/${createdVideoId}`, updateData, 'Update Video');
  }
  
  // Now test Favorites endpoints
  console.log('\n' + '=' * 50);
  console.log('🧪 TESTING FAVORITES ENDPOINTS');
  console.log('=' * 50);
  
  // Use the first available video ID for favorites testing
  const favTestVideoId = testVideoId || createdVideoId;
  
  if (favTestVideoId) {
    // Test 7: Get User's Favorites (should be empty initially)
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}`, null, 'Get User Favorites (empty)');
    
    // Test 8: Get User's Favorite Count
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}/count`, null, 'Get User Favorite Count');
    
    // Test 9: Check if Video is Favorited (should be false)
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}/check`, null, 'Check if Video is Favorited (should be false)');
    
    // Test 10: Add Video to Favorites
    await testEndpoint('POST', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}`, null, 'Add Video to Favorites');
    
    // Test 11: Check if Video is Favorited (should be true now)
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}/check`, null, 'Check if Video is Favorited (should be true)');
    
    // Test 12: Get User's Favorites (should have one now)
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}`, null, 'Get User Favorites (should have one)');
    
    // Test 13: Get User's Favorite Videos with Details
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}/videos`, null, 'Get User Favorite Videos with Details');
    
    // Test 14: Get Updated Favorite Count
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}/count`, null, 'Get Updated Favorite Count');
    
    // Test 15: Toggle Favorite (should remove it)
    await testEndpoint('POST', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}/toggle`, null, 'Toggle Favorite (remove)');
    
    // Test 16: Toggle Favorite Again (should add it back)
    await testEndpoint('POST', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}/toggle`, null, 'Toggle Favorite (add back)');
    
    // Test 17: Remove from Favorites
    await testEndpoint('DELETE', `${API_BASE_URL}/api/favorites/video/${favTestVideoId}/user/${TEST_USER_ID}`, null, 'Remove from Favorites');
    
    // Test 18: Verify Removal
    await testEndpoint('GET', `${API_BASE_URL}/api/favorites/user/${TEST_USER_ID}`, null, 'Verify Favorites Removal');
  }
  
  // Test 19: Delete Created Video (cleanup)
  if (createdVideoId) {
    await testEndpoint('DELETE', `${API_BASE_URL}/api/videos/${createdVideoId}`, null, 'Delete Created Video (cleanup)');
  }
  
  // Test 20: Test 404 Error
  await testEndpoint('GET', `${API_BASE_URL}/api/nonexistent`, null, 'Test 404 Error');
  
  console.log('\n' + '=' * 50);
  console.log('✅ All API tests completed!');
  console.log('=' * 50);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support.');
  console.log('To run tests, you can:');
  console.log('1. Upgrade to Node.js 18+');
  console.log('2. Or install node-fetch: npm install node-fetch');
  console.log('3. Then modify this script to import fetch');
  process.exit(1);
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
}); 