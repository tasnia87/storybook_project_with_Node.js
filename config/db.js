const mongoose = require('mongoose')

const connectdb = async() => {
    try {
        const conn = await mongoose.connect(process.env.url, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
            console.log(`database connected:${conn.connection.host}`)
        
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports=connectdb