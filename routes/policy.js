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
        const policy = await policies.getByVehicleId(vehicleId);
        
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

module.exports = router;