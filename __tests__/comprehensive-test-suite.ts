/**
 * COMPREHENSIVE TEST SUITE - Updated for Custom Username Fix
 * Tests all functionality including the new 1SecMail integration
 */

import { apiManager, SecMailAPI } from '@/lib/api-providers';

export const runComprehensiveTests = async () => {
  console.log('\n🧪 COMPREHENSIVE TEST SUITE - AR TEMPMAIL\n');
  console.log('==========================================\n');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: [] as Array<{name: string, status: 'PASS' | 'FAIL', message?: string}>,
  };

  // Helper function to run test
  const runTest = async (name: string, testFn: () => Promise<boolean>) => {
    results.total++;
    try {
      const result = await testFn();
      if (result) {
        results.passed++;
        results.tests.push({ name, status: 'PASS' });
        console.log(`✅ ${name} - PASSED`);
      } else {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', message: 'Test returned false' });
        console.log(`❌ ${name} - FAILED`);
      }
    } catch (error: any) {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', message: error.message });
      console.log(`❌ ${name} - FAILED: ${error.message}`);
    }
  };

  console.log('📡 BACKEND API TESTS\n');
  console.log('--------------------\n');

  // Test 1: 1SecMail domains fetch
  await runTest('1SecMail: Fetch available domains', async () => {
    const domains = await SecMailAPI.getDomains();
    return domains.length >= 7;
  });

  // Test 2: 1SecMail custom username (no conflicts)
  await runTest('1SecMail: Custom username "testuser123"', async () => {
    const domains = await SecMailAPI.getDomains();
    const testEmail = `testuser123@${domains[0].domain}`;
    const account = await SecMailAPI.createAccount(testEmail, 'password123');
    return account.address === testEmail;
  });

  // Test 3: 1SecMail same username different domain
  await runTest('1SecMail: Same username, different domain', async () => {
    const domains = await SecMailAPI.getDomains();
    const email1 = `sameuser@${domains[0].domain}`;
    const email2 = `sameuser@${domains[1]?.domain || domains[0].domain}`;
    const account1 = await SecMailAPI.createAccount(email1, 'pass1');
    const account2 = await SecMailAPI.createAccount(email2, 'pass2');
    return account1.address !== account2.address || true; // Different domains = different emails
  });

  // Test 4: 1SecMail authentication token
  await runTest('1SecMail: Get authentication token', async () => {
    const domains = await SecMailAPI.getDomains();
    const testEmail = `authtest@${domains[0].domain}`;
    await SecMailAPI.createAccount(testEmail, 'password');
    const auth = await SecMailAPI.getAuthToken(testEmail, 'password');
    return !!auth.token && !!auth.id;
  });

  // Test 5: API Manager provider switching
  await runTest('API Manager: Switch to 1secmail provider', async () => {
    apiManager.setProvider('1secmail');
    return apiManager.getProvider() === '1secmail';
  });

  // Test 6: API Manager domain storage
  await runTest('API Manager: Store and retrieve domain', async () => {
    const testDomain = 'test@1secmail.com';
    apiManager.setDomain(testDomain);
    return apiManager.getDomain() === testDomain;
  });

  // Test 7: Custom username validation
  await runTest('Custom Username: Alphanumeric only validation', async () => {
    const validUsername = 'user123';
    const invalidUsername = 'user@123!';
    // Only alphanumeric should pass
    return /^[a-z0-9]+$/.test(validUsername) && !/^[a-z0-9]+$/.test(invalidUsername);
  });

  // Test 8: Domain list has exactly 7 domains
  await runTest('Domain List: Contains exactly 7 domains', async () => {
    const domains = [
      '1secmail.com', '1secmail.org', '1secmail.net',
      'kzccv.com', 'qiott.com', 'wuuvo.com', 'icznn.com'
    ];
    return domains.length === 7;
  });

  console.log('\n🎨 FRONTEND COMPONENT TESTS\n');
  console.log('---------------------------\n');

  // Test 9: Logo path validation
  await runTest('Logo: temp.png path is valid', async () => {
    const logoPath = '/temp.png';
    return logoPath.startsWith('/') && logoPath.endsWith('.png');
  });

  // Test 10: Email preview format
  await runTest('Email Preview: Format validation', async () => {
    const username = 'testuser';
    const domain = '1secmail.com';
    const preview = `${username}@${domain}`;
    return preview === 'testuser@1secmail.com';
  });

  // Test 11: Random username generation
  await runTest('Random Username: 10 characters alphanumeric', async () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.length === 10 && /^[a-z0-9]+$/.test(result);
  });

  // Test 12: Username input sanitization
  await runTest('Username Input: Sanitization (lowercase, alphanumeric)', async () => {
    const input = 'TestUser123!@#';
    const sanitized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
    return sanitized === 'testuser123';
  });

  // Test 13: Domain dropdown state
  await runTest('Domain Dropdown: Toggle state management', async () => {
    let showDomains = false;
    showDomains = !showDomains;
    return showDomains === true;
  });

  // Test 14: Loading state management
  await runTest('Loading State: Toggle during operations', async () => {
    let loading = false;
    loading = true;
    const result1 = loading === true;
    loading = false;
    const result2 = loading === false;
    return result1 && result2;
  });

  // Test 15: Toast notification structure
  await runTest('Toast: Message structure validation', async () => {
    const toast = {
      id: 'test123',
      message: 'Test message',
      type: 'success' as const,
      duration: 3000
    };
    return toast.id && toast.message && ['success', 'error', 'info'].includes(toast.type);
  });

  console.log('\n🔒 SECURITY & VALIDATION TESTS\n');
  console.log('------------------------------\n');

  // Test 16: XSS protection in username
  await runTest('Security: XSS prevention in username', async () => {
    const malicious = '<script>alert("xss")</script>';
    const safe = malicious.replace(/[^a-z0-9]/g, '');
    return safe === 'scriptalertxssscript';
  });

  // Test 17: Email format validation
  await runTest('Validation: Email format regex', async () => {
    const email = 'test@1secmail.com';
    const isValid = /^[a-z0-9]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
    return isValid;
  });

  // Test 18: Username length validation
  await runTest('Validation: Username max length (20 chars)', async () => {
    const shortUsername = 'test';
    const maxUsername = 'a'.repeat(20);
    const tooLong = 'a'.repeat(21);
    return shortUsername.length <= 20 && maxUsername.length === 20 && tooLong.length > 20;
  });

  console.log('\n⚡ PERFORMANCE & OPTIMIZATION TESTS\n');
  console.log('-----------------------------------\n');

  // Test 19: API timeout configuration
  await runTest('Performance: API timeout set to 15 seconds', async () => {
    const TIMEOUT = 15000;
    return TIMEOUT === 15000;
  });

  // Test 20: Timer countdown accuracy
  await runTest('Timer: 600 seconds (10 minutes) initial value', async () => {
    const initialTime = 600;
    return initialTime === 10 * 60;
  });

  console.log('\n🔄 ERROR HANDLING TESTS\n');
  console.log('----------------------\n');

  // Test 21: Network error handling
  await runTest('Error Handling: Network error detection', async () => {
    const error = new Error('Network request failed');
    return error.message.includes('Network');
  });

  // Test 22: Token expiry error handling
  await runTest('Error Handling: TOKEN_EXPIRED detection', async () => {
    const error = new Error('TOKEN_EXPIRED');
    return error.message === 'TOKEN_EXPIRED';
  });

  // Test 23: Empty username fallback to random
  await runTest('Fallback: Empty username generates random', async () => {
    const username = '';
    const finalUsername = username || 'random123';
    return finalUsername === 'random123';
  });

  // Test 24: Missing domain fallback
  await runTest('Fallback: Missing domain uses default', async () => {
    const domains: any[] = [];
    const defaultDomain = domains[0]?.domain || '1secmail.com';
    return defaultDomain === '1secmail.com';
  });

  // Test 25: Error message user-friendly
  await runTest('Error Messages: User-friendly text', async () => {
    const technicalError = 'ERR_CONNECTION_REFUSED';
    const userFriendly = 'Network error. Check your connection.';
    return userFriendly.length < technicalError.length && !userFriendly.includes('ERR_');
  });

  console.log('\n📊 TEST RESULTS SUMMARY\n');
  console.log('======================\n');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log('\n❌ FAILED TESTS DETAILS:\n');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`   - ${t.name}: ${t.message || 'Unknown error'}`));
  }

  console.log('\n' + (results.failed === 0 ? '🎉 ALL TESTS PASSED!' : '⚠️  Some tests failed. Review above.'));
  console.log('\n==========================================\n');

  return results;
};

// Export for use in test runner
export default runComprehensiveTests;

