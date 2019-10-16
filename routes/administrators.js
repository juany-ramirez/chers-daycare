const express =  require('express');
const router = express.Router();
const Administrator = require('../models/Administrator');

router.get('/', (req, res) => {
    Administrator.find().then((administrators) => {
        res.send({success:true, data:administrators});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.get('/:id', (req, res) => {
    Administrator.findById(req.params.id).then((administrator) => {
        res.send({success:true, data:administrator});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.post('/', (req, res) => {
    const administrator = new Administrator({
        user_id: req.body.user_id,
        courses: req.body.courses,
        posted_publications: req.body.posted_publications
    });
    administrator.save().then((administrator) => {
        res.send({success:true, data:administrator});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.delete('/:id', (req, res) => {
    Administrator.remove({_id: req.params.id}).then((administrator) => {
        res.send({success:true, data:administrator});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.put('/:id', (req, res) => {
    Administrator.updateOne({_id: req.params.id}, 
        { $set: 
            {
                user_id: req.body.user_id,
                courses: req.body.courses,
                posted_publications: req.body.posted_publications
            }
    }).then((administrator) => {
        res.send({success:true, data:administrator});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

module.exports  = router;