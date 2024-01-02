const {Router} = require('express');
const {policies} = require('../models');

const router = Router();

router.get('/getPolicyByVehicleId/:vehicleId', async(req, res)=>{
    const{vehicleId}= req.params;
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
        console.log(error);
        return res.status(500).json({
            message: 'Unable to get Policy'
        });
    }
})



router.get('/getById/:policyId', async(req, res)=>{
    const{policyId}=req.params;
    if(!policyId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const policy = await policies.getByPolicyId(policyId);

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
        console.log(error);
        return res.status(500).json({
            message: 'Unable to create policy'
        });
    }
})


module.exports = router;