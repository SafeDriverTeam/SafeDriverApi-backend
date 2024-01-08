const {Router} = require('express');
const {policies} = require('../models');
const { verifyJsonWebToken } = require('../utils/crypto');

const router = Router();

router.get('/getPolicyByVehicleId/:vehicleId', async(req, res)=>{
    const{vehicleId}= req.params;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);      
    if (!decoded || decoded.type != 'driver') {
        return res.status(401).json('Unauthorized user');
    }
    if(!vehicleId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const policy = await policies.getPolicyByVehicleId(vehicleId);
        
        if(!policy){
            return res.status(404).json({
                message: 'Policy not found'
            });
        }
        return res.status(200).json(policy)
    }catch(error){
        return res.status(500).json({
            message: 'Unable to get Policy'
        });
    }
})



router.get('/getById/:policyId', async(req, res)=>{
    const{policyId}=req.params;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);      
    if (!decoded || decoded.type != 'driver') {
        return res.status(401).json('Unauthorized user');
    }
    if(!policyId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const policy = await policies.getByPolicyID(policyId);

        if(!policy){
            return res.status(404).json({
                message: 'Policy not found'
            });
        }
        return res.status(200).json(policy);
    }catch(error){
        return res.status(500).json({
            message: 'Unable to get Policy'
        });
    }
})

router.post('/createPolicy', async(req, res)=>{
    const{acquisitionDate, amount, expirationDate, vehicleId, userId, typePolicy}=req.body;
    if(!acquisitionDate || !amount || !expirationDate || !vehicleId || !userId || !typePolicy){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const policy = await policies.createPolicy(
            acquisitionDate,
            amount,
            expirationDate,
            vehicleId,
            userId,
            typePolicy
        );

        if(!policy){
            return res.status(500).json({
                message: 'Unable to create policy'
            });
        }
        return res.status(201).json({
            message: 'Policy created successfully',
            policyId: policy.policyId
        });
    }catch(error){
        return res.status(500).json({
            message: 'Unable to create policy'
        });
    }
})


router.get('/getPoliciesByUserId/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    try {
        const userPolicies = await policies.getByUserId(userId);

        if (!userPolicies) {
            return res.status(404).json({
                message: 'Policies not found'
            });
        }
        return res.status(200).json(userPolicies);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to get Policies'
        });
    }
});

module.exports = router;