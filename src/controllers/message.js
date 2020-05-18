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
                    }

                    const opt = {
                        query
                    }

                    const message = await msgRepository.getMessage(opt);

                    res.json(message)
                }catch(error){
                    next(error);
                }
            },
            
            editMessage: async (req,res,next) => {

            },




        };
    },
];

