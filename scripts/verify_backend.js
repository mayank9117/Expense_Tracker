const axios = require('axios');

const API_URL = 'http://localhost:5000/expenses';

async function runVerification() {
    console.log('Starting Backend Verification...');

    try {
        // 1. Get initial expenses
        console.log('\n1. Fetching initial expenses...');
        let res = await axios.get(API_URL);
        console.log(`   Status: ${res.status}`);
        console.log(`   Count: ${res.data.length}`);

        // 2. Add an expense
        console.log('\n2. Adding a new expense...');
        const expense1 = {
            amount: 100,
            category: 'Food',
            description: 'Lunch',
            date: new Date().toISOString()
        };
        res = await axios.post(API_URL, expense1);
        console.log(`   Status: ${res.status}`);
        console.log(`   Created ID: ${res.data._id}`);

        // 3. Add another expense
        console.log('\n3. Adding another expense...');
        const expense2 = {
            amount: 50,
            category: 'Transport',
            description: 'Bus',
            date: new Date().toISOString()
        };
        res = await axios.post(API_URL, expense2);
        console.log(`   Status: ${res.status}`);
        console.log(`   Created ID: ${res.data._id}`);

        // 4. Verify list contains expenses
        console.log('\n4. Verifying expenses list...');
        res = await axios.get(API_URL);
        console.log(`   Status: ${res.status}`);
        console.log(`   Count: ${res.data.length}`);
        if (res.data.length >= 2) console.log('   PASSED: Count is correct');
        else console.log('   FAILED: Count is incorrect');

        // 5. Test Filter
        console.log('\n5. Testing Filter (Category=Food)...');
        res = await axios.get(`${API_URL}?category=Food`);
        console.log(`   Status: ${res.status}`);
        console.log(`   Count: ${res.data.length}`);
        const allFood = res.data.every(e => e.category === 'Food');
        if (allFood && res.data.length > 0) console.log('   PASSED: Filter works');
        else console.log('   FAILED: Filter failed');

        console.log('\nVerification Complete.');
    } catch (error) {
        console.error('Verification Failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

runVerification();
