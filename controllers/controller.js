const db = require('../models/db.js');
const User = require('../models/UserModel.js');

const controller = {

    getFavicon: function (req, res) {
        res.status(204);
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `home.hbs` with all contacts
            current stored in the database.
    */
    getIndex: function(req, res) {
        
        var projection = 'name number';

        db.findMany(User,{}, projection, function(result) {
            var allContacts = [];

            if (result != null){
                for (var i = 0; i < result.length; i++){
                    var contact = {
                        name: result[i].name,
                        number: result[i].number
                    };

                    allContacts.push(contact);
                }
                
                res.render('home', allContacts);
            }
            else {
                res.render('home'); // This is to load the page initially   
            }
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getCheckNumber`. This function checks if a
            specific number is stored in the database. If the number is
            stored in the database, it returns an object containing the
            number, otherwise, it returns an empty string.
    */
    getCheckNumber: function(req, res) {
        
        var number = req.query.number;

        db.findOne(User, {number: number}, 'number', function (result) {
            res.send(result);
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getAdd`. This function adds the contact sent
            by the client to the database, then appends the new contact to the
            list of contacts in `home.hbs`.
    */
    getAdd: function(req, res) {
        
        var contact = {
            name: req.query.name,
            number: req.query.number
        }


        db.insertOne(User, contact, function(flag) {
            if (flag) {
                res.render('partials/card', {name: contact.name, number: contact.number}, function (err, html) {
                    if (!err) res.send(html);
                });
            }
        });
    },

    /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getDelete`. This function deletes the contact
            from the database, then removes the contact to the list of
            contacts in `home.hbs`.
    */
    getDelete: function (req, res) {
        
        var number = req.query.number;

        db.deleteOne(User, {number : number}, function(flag) {
            if (flag)
                console.log("Removed");
        });
    }

}

module.exports = controller;
