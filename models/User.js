const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    googleId: {
        type: String,
        required:true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
    
})

module.exports=mongoose.model('User',schema)