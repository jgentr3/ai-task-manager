/**
 * API Test Script
 * Tests all authentication and task endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  email: `test${Date.now()}@example.com`, // Unique email each run
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

let accessToken = '';
let taskId = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  log(title, 'magenta');
  console.log('='.repeat(60));
};

const logSuccess = (message) => log(`✓ ${message}`, 'green');
const logError = (message) => log(`✗ ${message}`, 'red');
const logInfo = (message) => log(`ℹ ${message}`, 'blue');
const logWarning = (message) => log(`⚠ ${message}`, 'yellow');

// Test 1: Health Check
async function testHealthCheck() {
  logSection('TEST 1: Health Check');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logSuccess('Server is running');
    logInfo(`Response: ${JSON.stringify(response.data, null, 2)}`);
    return true;
  } catch (error) {
    logError('Server is not responding');
    logError(error.message);
    return false;
  }
}

// Test 2: Register User
async function testRegister() {
  logSection('TEST 2: Register New User');
  try {
    logInfo(`Email: ${TEST_USER.email}`);
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);

    if (response.data.success) {
      accessToken = response.data.data.accessToken;
      logSuccess('User registered successfully');
      logInfo(`User ID: ${response.data.data.user.id}`);
      logInfo(`Email: ${response.data.data.user.email}`);
      logInfo(`Token: ${accessToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    logError('Registration failed');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
      if (error.response.data.errors) {
        error.response.data.errors.forEach(err => {
          logError(`  - ${err.field}: ${err.message}`);
        });
      }
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 3: Login
async function testLogin() {
  logSection('TEST 3: Login');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (response.data.success) {
      accessToken = response.data.data.accessToken;
      logSuccess('Login successful');
      logInfo(`User: ${response.data.data.user.email}`);
      logInfo(`New Token: ${accessToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    logError('Login failed');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 4: Get Current User
async function testGetCurrentUser() {
  logSection('TEST 4: Get Current User Profile');
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Profile retrieved successfully');
      logInfo(`User: ${JSON.stringify(response.data.data.user, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to get user profile');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 5: Create Task
async function testCreateTask() {
  logSection('TEST 5: Create Task');
  const taskData = {
    title: 'Test Task',
    description: 'This is a test task created by the API test script',
    status: 'pending',
    priority: 'high',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  };

  try {
    const response = await axios.post(`${BASE_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      taskId = response.data.data.task.id;
      logSuccess('Task created successfully');
      logInfo(`Task ID: ${taskId}`);
      logInfo(`Task: ${JSON.stringify(response.data.data.task, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to create task');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
      if (error.response.data.errors) {
        error.response.data.errors.forEach(err => {
          logError(`  - ${err.field}: ${err.message}`);
        });
      }
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 6: Get All Tasks
async function testGetAllTasks() {
  logSection('TEST 6: Get All Tasks');
  try {
    const response = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Tasks retrieved successfully');
      logInfo(`Total tasks: ${response.data.data.count}`);
      logInfo(`Tasks: ${JSON.stringify(response.data.data.tasks, null, 2)}`);
      logInfo(`Stats: ${JSON.stringify(response.data.data.stats, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to get tasks');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 7: Get Task by ID
async function testGetTaskById() {
  logSection('TEST 7: Get Task by ID');
  try {
    const response = await axios.get(`${BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Task retrieved successfully');
      logInfo(`Task: ${JSON.stringify(response.data.data.task, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to get task');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 8: Update Task
async function testUpdateTask() {
  logSection('TEST 8: Update Task');
  const updates = {
    title: 'Updated Test Task',
    description: 'This task has been updated',
    status: 'in-progress',
    priority: 'medium'
  };

  try {
    const response = await axios.put(`${BASE_URL}/tasks/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Task updated successfully');
      logInfo(`Updated Task: ${JSON.stringify(response.data.data.task, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to update task');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 9: Update Task Status
async function testUpdateTaskStatus() {
  logSection('TEST 9: Update Task Status');
  try {
    const response = await axios.patch(`${BASE_URL}/tasks/${taskId}/status`,
      { status: 'completed' },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (response.data.success) {
      logSuccess('Task status updated successfully');
      logInfo(`Updated Task: ${JSON.stringify(response.data.data.task, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to update task status');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 10: Get Task Statistics
async function testGetTaskStats() {
  logSection('TEST 10: Get Task Statistics');
  try {
    const response = await axios.get(`${BASE_URL}/tasks/stats/summary`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Statistics retrieved successfully');
      logInfo(`Stats: ${JSON.stringify(response.data.data, null, 2)}`);
      return true;
    }
  } catch (error) {
    logError('Failed to get statistics');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 11: Delete Task
async function testDeleteTask() {
  logSection('TEST 11: Delete Task');
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.success) {
      logSuccess('Task deleted successfully');
      logInfo(`Message: ${response.data.message}`);
      return true;
    }
  } catch (error) {
    logError('Failed to delete task');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Test 12: Filter Tasks
async function testFilterTasks() {
  logSection('TEST 12: Filter Tasks');

  // First, create some test tasks
  logInfo('Creating test tasks for filtering...');
  const testTasks = [
    { title: 'High Priority Task', priority: 'high', status: 'pending' },
    { title: 'Medium Priority Task', priority: 'medium', status: 'in-progress' },
    { title: 'Low Priority Task', priority: 'low', status: 'completed' }
  ];

  for (const task of testTasks) {
    await axios.post(`${BASE_URL}/tasks`, task, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  try {
    // Test status filter
    const statusResponse = await axios.get(`${BASE_URL}/tasks?status=pending`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess(`Status filter (pending): ${statusResponse.data.data.count} tasks`);

    // Test priority filter
    const priorityResponse = await axios.get(`${BASE_URL}/tasks?priority=high`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logSuccess(`Priority filter (high): ${priorityResponse.data.data.count} tasks`);

    return true;
  } catch (error) {
    logError('Failed to filter tasks');
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Message: ${error.response.data.message}`);
    } else {
      logError(error.message);
    }
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════╗', 'blue');
  log('║         TASK MANAGER API - COMPREHENSIVE TESTS          ║', 'blue');
  log('╚══════════════════════════════════════════════════════════╝', 'blue');
  console.log('\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Register User', fn: testRegister },
    { name: 'Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Create Task', fn: testCreateTask },
    { name: 'Get All Tasks', fn: testGetAllTasks },
    { name: 'Get Task by ID', fn: testGetTaskById },
    { name: 'Update Task', fn: testUpdateTask },
    { name: 'Update Task Status', fn: testUpdateTaskStatus },
    { name: 'Get Task Statistics', fn: testGetTaskStats },
    { name: 'Delete Task', fn: testDeleteTask },
    { name: 'Filter Tasks', fn: testFilterTasks }
  ];

  for (const test of tests) {
    results.total++;
    const success = await test.fn();
    if (success) {
      results.passed++;
    } else {
      results.failed++;
      logWarning(`Stopping tests due to failure in: ${test.name}`);
      break; // Stop on first failure
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }

  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`,
    results.failed > 0 ? 'yellow' : 'green');

  console.log('\n');

  if (results.failed === 0) {
    log('✓ ALL TESTS PASSED! 🎉', 'green');
  } else {
    log('✗ SOME TESTS FAILED', 'red');
  }

  console.log('\n');
}

// Run tests
runAllTests().catch(error => {
  logError('Unexpected error during test execution:');
  console.error(error);
  process.exit(1);
});
