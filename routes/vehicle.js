const { Router } = require('express');
const { vehicles } = require('../models');

const router = Router();

router.get('/getVehicleByUserId/:userId', async(req, res)=>{
    const{userId}=req.params;
    if(!userId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const vehicle = await vehicles.getByUserId(userId);

        if(!vehicle){
            return res.status(404).json({
                message: 'Vehicles not found'
            });
        }

        return res.status(200).json(vehicle);
    }catch(error){
        return res.status(500).json({
            message: 'Unable to get vehicle'});
    }
})

router.post('/createVehicle', async (req, res)=>{
    const{brand, model, year, color, plate, userId}=req.body;
    if(!brand || !model || !year || !color || !plate || !userId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const vehicle = await vehicles.createVehicle(
            brand,
            model,
            year,
            color,
            plate,
            userId
        );

        if(!vehicle){
            return res.status(500).json({
                message: 'Unable to create vehicle'
            });
        }
        
        return res.status(201).json({
            message: 'Vehicle created successfully',
            vehicleId: vehicle.vehicleId
        });
    }catch(error){
        return res.status(500).json({
            message: 'Unable to create report'
        });
    }
})



module.exports = router;