import Product from '../models/Product.js';

export async function getProducts(req, res) {
    try {

        const products = await Product.find().sort({createdAt:-1}); //newest to latest
        res.status(200).json(products);
    }catch(error){
        console.error("Error in getProducts:", error);
        res.status(500).json({message: "Error fetching products"});
    }

}

export async function getProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        else{
            res.status(200).json(product);
        }
    }catch(error){
        console.error("Error in getProduct:", error);
        res.status(500).json({message: "Error fetching product"});
    }

}

export async function createProduct(req, res){
    try{
        const {name, description, price, image, category, stock, state} = req.body;
        const newProduct  = new Product({
            name : name,
            description : description,
            price : price,
            image : image,
            category : category,
            stock : stock,
            state : state
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({message: "Product created successfully", product: savedProduct
        })
    }catch(error){
        console.error("Error in createProduct:", error);
        res.status(500).json({message: "Error creating product"});
    }
}

export async function updateProduct(req, res){
    try{
        const id = req.params.id;
        const {name, description, price, image, category, stock, state} = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name : name,
            description : description,
            price : price,
            image : image,
            category : category,
            stock : stock,
            state : state
        }, {new: true});

        if(!updatedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        else{
            res.status(200).json({message: "Product updated successfully", product: updatedProduct});
        }
    }catch(error){
        console.error("Error in updateProduct:", error);
        res.status(500).json({message: "Error updating product"});
    }
}

export async function deleteProduct(req, res){
    try{
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"});
        }else{
            res.status(200).json({message: "Product deleted successfully"});
        }
    }catch(error){
        console.error("Error in deleteProduct:", error);
        res.status(500).json({message: "Error deleting product"});
    }
    
}