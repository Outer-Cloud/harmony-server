const express = require('express');
const mongo = require('mongodb');

const Message = require('../schemas/message');

const router = new express.Router;

router.post('/',async (req, res) => {

    const newMessage = new Message({
        ...req.body
    });
    try{
        await newMessage.save();
        res.status(200).send(newMessage);
    }catch(error){
        res.status(400).send(error);
    }

})

router.post('/insertMany', async(req,res) => {
    const messages = req.body;
    try {
        const response = await Message.insertMany(messages);
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
    
})

router.get('/get', async (req,res) => {
    const id = req.body.id;
    try {
        const o_ID = await new mongo.ObjectID(id);
        const message = await Message.findById(o_ID);
         if(!message){
             res.status(404).send('Error: message with corresponding ID does not exist');
             return;
         }
        res.status(200).send(message);  
     
    } catch (error) {
        res.status(500).send('Error: ID length not 12');//this error message may not be correct
    }

})

router.delete('/delete', async (req,res) => {
    const id = req.body.id;
    
    try{
        const o_ID = await new mongo.ObjectID(id);
        var message = await Message.findByIdAndRemove(o_ID,{useFindAndModify:false});
        res.status(200).send(message);
    }catch(error){
        res.status(400).send('Error: something went wrong');
    }
})

router.patch('/edit', async (req,res) => {
    const id = req.body.id;
    const updateText = req.body.text;
    try {
        const o_ID = await new mongo.ObjectID(id);
        const message = await Message.findOneAndUpdate({_id:o_ID},{text:updateText},{useFindAndModify:false, new:true});
        if(!message){
            res.status(404).send('Error: message with corresponding ID does not exist');
            return;
        }
        res.status(200).send(message);  

    } catch (error) {
        res.status(500).send('Error: ID length not 12');//this error message may not be correct
    }

})


module.exports = router;
