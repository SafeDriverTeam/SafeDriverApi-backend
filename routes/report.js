const { Router } = require('express');
const { reports } = require('../models');

const router = Router();

router.get('/getByAdjuster/:adjusterId', async (req, res) => {
    const { adjusterId } = req.params;

    if (!adjusterId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    
    try {
        const reportList = await reports.getByAdjusterId(adjusterId);

        if(!reportList) {
            return res.status(404).json({
                message: 'Report not found'
            });
        }

        return res.status(200).json(
            {reportList});

    } catch(error) {
        return res.status(500).json({
            message: 'Unable to get report'});
    }
});

router.get('/getByReportId/:reportId', async (req, res) => {
    const { reportId } = req.params;

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
    const { declaration, date, place, judgment, policyId,involved, vehiclesInvolved, userId } = req.body;
    if(!declaration || !date || !place || !judgment || !policyId || !involved || !vehiclesInvolved || !userId) {
        return res.status(400).json({
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

router.get('/getByUserId/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    try {
        const report = await reports.getByUserId(userId);

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


module.exports = router;