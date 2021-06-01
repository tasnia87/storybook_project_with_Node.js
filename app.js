const path=require('path')
const express = require('express')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const methodOverride=require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const db = require('./config/db')

require('./config/passport')(passport)

dotenv.config({ path: './config/config.env' })


db()
const app = express()

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const morgan = require('morgan')
const hbs=require('express-handlebars')

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//logging
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

//handlebars heelpers
const { formatDate, truncate, stripTags,editIcon } = require('./helpers/hbs')


//handlebars
app.engine('.hbs', hbs({
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon
    },
    defaultLayout: 'main', extname:'.hbs' }))
app.set('view engine', '.hbs')

    // session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))



//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

//static 
app.use(express.static(path.join(__dirname, 'public')))

//rouutes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
const port = process.env.PORT || 3000
app.listen(port, console.log(`server running in ${process.env.NODE_ENV} in mode ${port}`))





