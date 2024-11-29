const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

// const orderRoute = require('./routes/order')
const cartRoute = require('./routes/cart')
const productRoute = require('./routes/product')
const authRoute = require('./routes/auth')
const wishlistRoute = require('./routes/wishlist')
const cors = require('cors')



mongoose.connect(process.env.MONGO_DB)
        .then(() => console.log("DB connect successfully"))
        .catch((err) => console.log(err))

app.listen(process.env.PORT ,() => {
    console.log('backend is running on port:',process.env.PORT);
} )

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use('/api/auth', authRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);

// app.use('/api/order', orderRoute);
