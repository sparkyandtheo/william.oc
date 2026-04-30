const sql = require('mssql');

const config = {
    user: 'ts',
    password: '@HODd00r5',
    server: '192.168.1.15', // hod-edge IP
    database: 'HOD', // Assuming the DSN 'HOD' maps to a database named 'HOD' or similar
    options: {
        encrypt: false, // Set to true for Azure or if encryption is required
        trustServerCertificate: true, // For self-signed certificates
    }
};

async function testConnection() {
    try {
        console.log('Attempting to connect to HOD database...');
        let pool = await sql.connect(config);
        console.log('Connected successfully!');
        
        // Try to find tables that might contain images
        console.log('Querying for tables that might contain image data...');
        let result = await pool.request().query(`
            SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE DATA_TYPE IN ('image', 'varbinary')
        `);
        
        console.log('Found potential image columns:');
        console.table(result.recordset);
        
        await pool.close();
    } catch (err) {
        console.error('Database connection failed:', err.message);
        if (err.message.includes('getaddrinfo')) {
            console.log('Check server address/IP.');
        }
    }
}

testConnection();
