const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// const userRoute = require('./routes/user')
// const cartRoute = require('./routes/cart')
// const orderRoute = require('./routes/order')
// const productRoute = require('./routes/product')
const authRoute = require('./routes/auth')


dotenv.config()

mongoose.connect(process.env.MONGO_DB)
        .then(() => console.log("DB connect successfully"))
        .catch((err) => console.log(err))

app.listen(process.env.PORT ,() => {
    console.log('backend is running');
} )

app.use(express.json());
// app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
// app.use('/api/cart', cartRoute);
// app.use('/api/order', orderRoute);
// app.use('/api/product', productRoute);
