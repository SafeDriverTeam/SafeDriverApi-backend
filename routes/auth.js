const { Router } = require('express');
const { users } = require('../models');
const { calculateSHA256Hash, generateJsonWebToken, verifyJsonWebToken } = require('../utils/crypto');
const { tokenExpirationTimeN } = require('../config');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await users.getByEmail(email);

    if(!user || await calculateSHA256Hash(password) != user.password) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = generateJsonWebToken(user.email, user.type);

    return res.status(200).json({
        message: 'Login successful',
        token,
        expiration: new Date(Date.now() + tokenExpirationTimeN * 1000),
        user: {
            userId: user.userId,
            name: user.name,
            surnames: user.surnames,
            email: user.email,
            type: user.type
        }
    });
});

router.post('/signup', async (req, res) => {
    const { name, surnames, email, password } = req.body;

    if(!name || !surnames || !email || !password) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    let user = await users.getByEmail(email);

    if(user) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    try {
        user = await users.registerUser(
            name, 
            surnames, 
            email, 
            await calculateSHA256Hash(password), 
            "driver");
        
        console.log(user);
        const token = generateJsonWebToken(user.email, user.type);
        
        return res.status(201).json({
            message: 'User created successfully',
            token,
            expiration: new Date(Date.now() + tokenExpirationTimeN * 1000),
            user: {
                userId: user.userId,
                name: user.name,
                surnames: user.surnames,
                email: user.email,
                type: user.type
            }
        });
    }
    catch(error) {
        return res.status(500).json({
            message: 'Unable to create user'
        });
    }
});

router.post('/registerEmployee', async (req, res) => {
    const { name, surnames, email, password, type } = req.body;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'admin') {
        return res.status(401).json({
            message: 'Unauthorized user'
        });
    }

    if(!name || !surnames || !email || !password || !type) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    if(type != 'executive' && type != 'adjuster') {
        return res.status(400).json({
            message: 'Invalid type'
        });
    }

    try {
        const user = await users.getByEmail(email);
    
        if(user) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        await users.registerUser(
            name, 
            surnames, 
            email, 
            await calculateSHA256Hash(password), 
            type
        );

        return res.status(201).json({
            message: 'User created successfully'
        });
    }
    catch(error) {
        return res.status(500).json({
            message: 'Unable to create user'
        });
    }
});

module.exports = router;