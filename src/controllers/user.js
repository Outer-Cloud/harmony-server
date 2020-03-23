module.exports = ['userRepository', (userRepository) => {
   
    return {
        save: async (req, res, next) => {
            try {
                const newUser = await userRepository.save({
                    user: {
                        ...req.body
                    }
                });
                res.status(201).send(newUser);
            } catch (error) {
         
            }
        },

        update: async (req, res, next) => {
            try {
                const user = await userRepository.update({
                    id: req.token.id,
                    updates: {
                        ...req.body
                    }
                });
                res.send(user);
            } catch (error) {
      
            }
        },

        delete: async (req, res, next) => {
            try {
                const user = await userRepository.remove({ 
                    id: req.token.id
                });
                res.send(user);
            } catch (error) {
         
            }
        },

        get: async (req, res, next) => {
            try {
                const user = await userRepository.get({
                    id: req.token.id
                });
                res.send(user);
            } catch (error) {

            }
        },

        addRelationship: async (req, res, next) =>{

        },

        removeRelationship: async (req, res, next) =>{

        }
    }
}];