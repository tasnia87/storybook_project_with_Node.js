const path=require('path')
const express = require('express')
const dotenv = require('dotenv')
const db = require('./config/db')
const passport = require('passport')
const session = require('express-session')

require('./config/passport')(passport)

dotenv.config({ path: './config/config.env' })


db()
const app = express()
const morgan = require('morgan')
const hbs=require('express-handlebars')

if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}
//handlebars
app.engine('.hbs', hbs({ defaultLayout: 'main', extname:'.hbs' }))
app.set('view engine', '.hbs')

    // session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static 
app.use(express.static(path.join(__dirname, 'public')))

//rouutes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
const port = process.env.PORT || 5000
app.listen(port, console.log(`server running in ${process.env.NODE_ENV} in mode ${port}`))





