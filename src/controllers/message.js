module.exports = [
    "msgRepository",
    (msgRepository) => {
        return{
            newMessage: async (req,res,next) =>{
                try{
                    const opt = {
                        text: req.body,
                        author: req.author,
                        room: req.room,
                        isPinned: req.isPinned
                    };

                    const result = await msgRepository.newMessage(opt);

                    res.json(result);
                }catch(error){
                    next(error);
                }
            },

            getMessage: async (req,res,next) => {
                try{
                    const query = {
                        _id:req.oID
                    };

                    const opt = {
                        query
                    };

                    const message = await msgRepository.getMessage(opt);

                    res.json(message);
                }catch(error){
                    next(error);
                }
            },

            getMessage: async (req,res,next) => {
                const query = {
                    _id:req.oID
                };

                res.json(message);
            },
            
            editMessage: async (req,res,next) => {
                const query = {
                    _id:req.oID
                };

                const update = {
                    text:req.text
                };

                const opt = {
                    query,update
                };

                const ret = await msgRepository.editMessage(opt);
                res.json(ret);
            },

            deleteMessage: async(req,res,next) => {

                const query = {
                    _id:req.oID
                };

                const opt = {
                    query
                };

                const ret = await msgRepository.deleteMessage(opt);
                res.json(ret);
            }




        };
    },
];

