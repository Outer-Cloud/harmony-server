module.exports = [
    "msgRepository",
    (msgRepository) => {
        return{
            newMessage: async (req,res,next) =>{
                    const query = {
                        text: req.body.text,
                        author: req.body.author,
                        room: req.body.room,
                        isPinned: req.body.isPinned
                    };

                    const opt = {
                        query,
                    };

                    const result = await msgRepository.create(opt);

                    res.json(result);
                
            },

            getMessage: async (req,res,next) => {
                try{
                    const query = {
                        _id:req.body.ID
                    };

                    const opt = {
                        query
                    };

                    const message = await msgRepository.get(opt);

                    res.json(message);
                }catch(error){
                    next(error);
                }
            },

            
            editMessage: async (req,res,next) => {
                const query = {
                    _id:req.body.ID
                };

                const update = {
                    text:req.body.text
                };

                const opt = {
                    query,update
                };

                const ret = await msgRepository.update(opt);
                res.json(ret);
            },

            deleteMessage: async(req,res,next) => {

                const query = {
                    _id:req.body.ID
                };

                const opt = {
                    query
                };

                const ret = await msgRepository.delete(opt);
                res.json(ret);
            }




        };
    },
];

