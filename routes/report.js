const { Router } = require('express');
const { reports, policies, users, vehicles } = require('../models');
const { verifyJsonWebToken } = require('../utils/crypto');
const router = Router();

router.get('/getByAdjuster/:adjusterId', async (req, res) => {
    const { adjusterId } = req.params;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'adjuster') {
        return res.status(401).json('Unauthorized user');
    }

    if (!adjusterId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        const reportList = await reports.getByAdjusterId(adjusterId);

        
        if (reportList.length > 0) {
            const enhancedReportList = await Promise.all(reportList.map(async (report) => {
                const policy = await policies.getByPolicyId(report.policyId);
                const vehicle = await vehicles.getByVehicleId(policy.vehicleId);
                const user = await users.getByUserId(policy.userId);

                return {
                    report,
                    policy,
                    vehicle,
                    user: {
                        name: user.name,
                        surnames: user.surnames
                    }
                };
            }));

            return res.status(200).json({ reportList: enhancedReportList });
        }
        return res.status(200).json({ reportList });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to get report'
        });
    }
});

router.get('/getByReportId/:reportId', async (req, res) => {
    const { reportId } = req.params;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'adjuster') {
        return res.status(401).json({
            message: 'Unauthorized user'
        });
    }

    if (!reportId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        const report = await reports.getByReportId(reportId);

        if(!report) {
            return res.status(404).json({
                message: 'Report not found'
            });
        }

        return res.status(200).json(report);
    } catch(error) {
        return res.status(500).json({
            message: 'Unable to get report'});
    }
});


router.post('/createReport', async (req, res) => {
    const { declaration, date, place, judgment, policyId,involved, vehiclesInvolved, userId, driverId } = req.body;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'driver') {
        return res.status(401).json('Unauthorized user');
    }
    if(!declaration || !date || !place || !judgment || !policyId || !involved || !vehiclesInvolved || !userId || !driverId) {
        return res.status(405).json({
            message: 'Missing required fields'
        });
    }

    try {
        const report = await reports.createReport(
            declaration,
            date,
            place,
            judgment,
            policyId,
            involved,
            vehiclesInvolved,
            userId,
            driverId
        );

        if(!report) {   
            return res.status(500).json({
                message: 'Unable to create report'
            });
        }

        return res.status(201).json({
            message: 'Report created successfully',
            reportId: report.reportId
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Unable to create report'
        });
    }
});


router.put('/setAdjuster', async (req, res) => {
    const { reportId, adjusterId } = req.body;

    if(!reportId || !adjusterId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        await reports.setAdjuster(reportId, adjusterId);

        if (!reports) {
            return res.status(500).json({
                message: 'Unable to set adjuster'
            });
        }

        return res.status(200).json({
            message: 'Adjuster set successfully'
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Unable to set adjuster'
        });
    }

});

router.put('/updateReportJudgment', async (req, res) => {
    const { reportId, judgment } = req.body;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'adjuster') {
        return res.status(401).json({
            message: 'Unauthorized user'
        });
    }

    if(!reportId || !judgment) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        await reports.updateReportJudgment(reportId, judgment);

        if (!reports) {
            return res.status(500).json({
                message: 'Unable to update report'
            });
        }

        return res.status(200).json({
            message: 'Report updated successfully'
        });


    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Unable to update report'
        });
    }
});

router.get('/getByDriverId/:driverId', async (req, res) => {
    const { driverId } = req.params;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const decoded = await verifyJsonWebToken(token);
        
    if (!decoded || decoded.type != 'driver') {
        return res.status(401).json('Unauthorized user');
    }
    if (!driverId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        const report = await reports.getByDriverId(driverId);

        if(!report) {
            return res.status(404).json({
                message: 'Report not found'
            });
        }

        return res.status(201).json(report);
    } catch(error) {
        return res.status(500).json({
            message: 'Unable to get report'});
    }
});


module.exports = router;