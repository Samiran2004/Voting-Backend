function getSignup(req,res){
    res.render('signup')
};
const signUp = async(req,res)=>{
    const {name,email,mobile} = req.body;
    console.log(name);
    console.log(email);
    console.log(mobile);
    res.render('home')
}

module.exports = {
    getSignup,
    signUp
}