const {Router} = require('express');
const {imagesReports} = require('../models');

const router = Router();

router.get('/getByReportId/:reportId', async(req, res)=>{
    const{reportId}=req.params;

    if(!reportId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        const images = await imagesReports.getByReportId(reportId);

        if(!images){
            return res.status(404).json({
                message: 'Images not found'
            });
        }

        return res.status(200).json(images);
    }catch(error){
        return res.status(500).json({
            message: 'Unable to get images'
        });
    }
})

router.post('/createImageReport', async(req, res)=>{
    const{image, reportId}=req.body;

    if(!image || !reportId){
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try{
        await imagesReports.createImageReport(image, reportId);
        return res.status(201).json({
            message: 'Image created successfully'
        });
    }catch(error){
        return res.status(500).json({
            message: 'Unable to create image'
        });
    }
})

module.exports = router;