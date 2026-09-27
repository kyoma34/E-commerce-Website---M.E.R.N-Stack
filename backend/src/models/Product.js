import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    description: {
        type : String,
    },
    price: {
        type : Number,
        required : true
    },
    image: {
        type : String,
    },
    category: {
        type : String,
    },
    stock: {
        type : Number,
    },
    state: {
        type : String,
        required : true
    },
},
{timestamps: true}
);

const Product = mongoose.model('Product', productSchema);

export default Product;