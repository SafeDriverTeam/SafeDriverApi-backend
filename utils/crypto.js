const crypto = require("crypto");
const config = require("../config");
const jwt = require("jsonwebtoken");

async function calculateSHA256Hash(text) {
    const hashString = crypto.createHash("sha256");
    hashString.update(`${text}`);
    return hashString.digest("hex");
};

function generateJsonWebToken(userEmail, userType) {
    const payload = {
        email: userEmail,
        type: userType
    };
    return jwt.sign(payload, config.webTokenSecret, { expiresIn:  config.tokenExpirationTime });
}

async function verifyJsonWebToken(token) {
    try {
        let decodedToken;
        jwt.verify(token, config.webTokenSecret, function(err, decoded) {
            if (err) {
                decodedToken = null;
            }
            decodedToken = decoded;
        });
        return decodedToken;
    } catch (error) {
        return null;
    }
}

function getAuthTokenFromHeader(req) {
    let accessToken = req.headers['authorization'] || req.headers['x-access-token']; 
    if(!accessToken) {
        return null;
    }
    if(accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.slice(7, accessToken.lenght);
    }
    return accessToken;
}

module.exports = {
    calculateSHA256Hash,
    generateJsonWebToken,
    verifyJsonWebToken,
    getAuthTokenFromHeader
};
