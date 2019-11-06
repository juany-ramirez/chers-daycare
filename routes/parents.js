const express =  require('express');
const router = express.Router();
const Parent = require('../models/Parent');

router.get('/', (req, res) => {
    Parent.find().then((parents) => {
        res.send({success:true, data:parents});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.get('/:id', (req, res) => {
    Parent.findById(req.params.id).then((parent) => {
        res.send({success:true, data:parent});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.post('/', (req, res) => {
    const parent = new Parent({
        user_id: req.body.user_id,
        kids: req.body.kids,
        notifications: req.body.notifications,
        payments: req.body.payments
    });
    parent.save().then((parent) => {
        res.send({success:true, data:parent});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.delete('/:id', (req, res) => {
    Parent.deleteOne({_id: req.params.id}).then((parent) => {
        res.send({success:true, data:parent});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.put('/:id', (req, res) => {
    Parent.updateOne({_id: req.params.id}, 
        { $set: 
            {
                user_id: req.body.user_id,
                kids: req.body.kids,
                notifications: req.body.notifications,
                payments: req.body.payments
            }
    }).then((parent) => {
        res.send({success:true, data:parent});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

module.exports  = router;