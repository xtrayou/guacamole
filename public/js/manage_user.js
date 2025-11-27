#!/usr/bin/env node

const crypto = require('crypto');
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dbConfig = {
    host: '127.0.0.1',
    user: 'guacamole_user',
    password: 'Greeen@1234',
    database: 'guacamole_db'
};

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function hashPassword(password) {
    const salt = crypto.randomBytes(32);
    const passwordBuf = Buffer.from(password, 'utf8');
    const combined = Buffer.concat([passwordBuf, salt]);
    const hash = crypto.createHash('sha256').update(combined).digest();
    return { hash, salt };
}

async function main() {
    console.log('=== Guacamole User Management ===\n');

    const username = await question('Username: ');
    const password = await question('Password: ');
    const isNewUser = await question('Create new user? (y/n): ');

    const { hash, salt } = hashPassword(password);

    const connection = await mysql.createConnection(dbConfig);

    try {
        if (isNewUser.toLowerCase() === 'y') {
            // Create new user
            await connection.execute(
                `INSERT INTO guacamole_entity (name, type) VALUES (?, 'USER')`,
                [username]
            );

            await connection.execute(
                `INSERT INTO guacamole_user (entity_id, password_hash, password_salt, password_date)
                 SELECT entity_id, ?, ?, CURRENT_TIMESTAMP
                 FROM guacamole_entity WHERE name = ?`,
                [hash, salt, username]
            );

            console.log(`✓ User '${username}' created successfully!`);
        } else {
            // Update existing user password
            await connection.execute(
                `UPDATE guacamole_user u
                 JOIN guacamole_entity e ON u.entity_id = e.entity_id
                 SET u.password_hash = ?, u.password_salt = ?, u.password_date = CURRENT_TIMESTAMP
                 WHERE e.name = ?`,
                [hash, salt, username]
            );

            console.log(`✓ Password updated for user '${username}'!`);
        }

        console.log(`\nYou can now login with:`);
        console.log(`  Username: ${username}`);
        console.log(`  Password: ${password}`);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await connection.end();
        rl.close();
    }
}

main();
