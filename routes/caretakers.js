const express =  require('express');
const router = express.Router();
const Caretaker = require('../models/Caretaker');

router.get('/', (req, res) => {
    Caretaker.find().then((caretakers) => {
        res.send({success:true, data:caretakers});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.get('/:id', (req, res) => {
    Caretaker.findById(req.params.id).then((caretaker) => {
        res.send({success:true, data:caretaker});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.post('/', (req, res) => {
    const caretaker = new Caretaker({
        user_id: req.body.user_id,
        courses: req.body.courses,
        posted_publications: req.body.posted_publications
    });
    caretaker.save().then((caretaker) => {
        res.send({success:true, data:caretaker});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.delete('/:id', (req, res) => {
    Caretaker.deleteOne({_id: req.params.id}).then((caretaker) => {
        res.send({success:true, data:caretaker});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

router.put('/:id', (req, res) => {
    Caretaker.updateOne({_id: req.params.id}, 
        { $set: 
            {
                user_id: req.body.user_id,
                courses: req.body.courses,
                posted_publications: req.body.posted_publications
            }
    }).then((caretaker) => {
        res.send({success:true, data:caretaker});
    }).catch((err) =>
        res.status(422).send({success:false, error:err.message})
    );
});

module.exports  = router;