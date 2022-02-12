const express = require('express');
const router = express();

router.get('/promocion/:dia', async (req, res) => {
    const { dia } = req.params
    res.status(200).json(dia)
})

module.exports = router;