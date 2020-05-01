module.exports = ['userRepository', (userRepository) => {
   
    return {

        get: async (req, res, next) => {
            try {
                const query = {
                    _id: req.auth.userId
                };

                const opts = {
                    query
                };
                
                const result  = await userRepository.get(opts);

                res.json(result);
            } catch (error) {
                next(error);
            }
        },

        put: async (req, res, next) =>{
            try {
                const query = {
                    _id: req.auth.userId
                };

                const updates = req.body;

                const opt = {
                    query,
                    updates
                }

                const result = await userRepository.update(opt);

                res.json(result);
            } catch (error) {
                next(error);
            }
        },

        delete: async (req, res, next) => {
            try {
                const query = {
                    _id: req.auth.userId
                };

                const opt = {
                    query
                }

                const result = await userRepository.delete(opt);

                res.json(result);
            } catch (error) {
                next(error);
            }
        }
    }
}];