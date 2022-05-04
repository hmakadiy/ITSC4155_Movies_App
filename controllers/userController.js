const model = require('../models/user');
const Showtime = require('../models/showtime');
const rsvpModel = require('../models/rsvp');
const user = require('../models/user');

exports.signup = (req, res)=>{
    return res.render('./user/signup');
};

exports.create = (req, res, next)=>{
        
        let user = new model(req.body);//create a new story document
        if(user.email)
            user.email = user.email.toLowerCase();
        user.save()//insert the document to the database
        .then(user=> res.redirect('/users/login'))
        .catch(err=>{
            if(err.name === 'ValidationError' ) {
                req.flash('error', err.message);  
                return res.redirect('/users/signup');
            }

            if(err.code === 11000) {
                req.flash('error', 'Email has already been used');  
                return res.redirect('/users/signup');
            }
            
            next(err);
        }); 
    
    
    
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');

}

exports.login = (req, res, next)=>{
        let email = req.body.email;
        if(email)
            email = email.toLowerCase();
        let password = req.body.password;
        model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('Wrong email address');
                req.flash('error', 'Wrong email address');  
                res.redirect('/users/login');
                } else {
                user.comparePassword(password)
                .then(result=>{
                    if(result) {
                        req.session.user = user._id;
                        req.session.name = user.firstName + ' ' + user.lastName;
                        req.flash('success', 'Successfully logged in!');
                        res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong password');      
                    res.redirect('/users/login');
                }
                });     
            }     
        })
        .catch(err => next(err));
    
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    
    Promise.all([model.findById(id), Showtime.find({author: id}), rsvpModel.find({user: id}).populate('showtime')])
    .then(results=>{
        const [user, showtimes, rsvps] = results;
        console.log(rsvps);
        res.render('./user/profile', {user, showtimes, rsvps});
    })
    .catch(err=>next(err));

};

// exports.profile = (req, res, next)=>{
//     let id = req.session.user;
//     Promise.all([model.findById(id), Event.find({author: id})])
//     .then(results=>{
//         const [user, events] = results;
//         res.render('./user/profile', {user, events});
//     })
//     .catch(err=>next(err));

// };


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };


 exports.theme = (req, res, next)=>{
    let id = req.session.user;
    console.log(user.isDark);
    model.findOne({ user: id, user:req.session.user }).then(user={
        if(user){
        user.findByIdAndUpdate(user._id, {user:req.body.user}, {useFindAndModify: false, runValidators: true})
            .then(user=>{
                req.flash('success', 'Successfully updated theme');
                res.redirect('/users/profile');
            })
            .catch(err=>{
                console.log(err);
                if(err.name === 'validationError') {
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        }
    })
        
 }