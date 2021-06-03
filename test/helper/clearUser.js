const {User} = require("../../models");


function clearUser(){
    if (process.env.NODE_ENV === 'test'){
        return User.destroy({where: {}})
    }
}



module.exports = clearUser