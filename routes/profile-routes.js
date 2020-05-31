const route = require('express').Router()
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const authCheck = (req,res,next)=>{
    if(isEmpty(req.user)){
        //user is not logged in
        res.redirect('/login')
    }else{
        //if logged in
        next()
    }
}
route.get('/',authCheck,(req,res)=>{
    res.render('profile',{user:req.user[0]})
    //res.status(200).send({ message: req.user[0].username });
})
exports = module.exports = {
    route
}