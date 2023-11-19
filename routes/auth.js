const { Router } = require('express');
const { users } = require('../models');
const { calculateSHA256Hash, generateJsonWebToken } = require('../utils/crypto');
const { tokenExpirationTime } = require('../config');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await users.getByEmail(email);

    if(!user || await calculateSHA256Hash(password) != user.password) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = generateJsonWebToken(user.email);

    return res.status(200).json({
        message: 'Login successful',
        token,
        expires: new Date(Date.now() + tokenExpirationTime).toString(),
        user: {
            name: user.name,
            surnames: user.surnames,
            email: user.email,
            type: user.type
        }
    });
});

router.post('/signup', async (req, res) => {
    const { name, surnames, email, password, type } = req.body;

    if(!name || !surnames || !email || !password || !type) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    const user = await users.getByEmail(email);

    if(user) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    try {
        await users.registerUser(
            name, 
            surnames, 
            email, 
            await calculateSHA256Hash(password), 
            type);
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
