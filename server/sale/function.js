import Category from "./categoryModel.js"
import Product from "./productsModel.js"
const addProduct = async (req,res)=>{
    try {
        if(req.userRole !== "admin"){
        res.status(401).json({msg:"Unauthorized: Not authorized to perform this operation"})}
        const {name,price,categoryName,quantity} = req.body
        const gymName = req.gymName
        if(!gymName||!name||!price||!category){
          return  res.status(400).json({msg:"Fill in the necessary fields"})
        }
        if(quantity <= 0){
            return res.status(403).json({msg:'Quantity must be greater than or equel to 1'})
        }
        const category= await Category.findOne({name:categoryName})
        if(!category){
          return  res.status(404).json({msg:"The category not found"})
        }
        const product = await Product.create({
            ...req.body,gymName,name,price
        })
        if(!product){
           return res.status(403).json({msg:"Can't creat this product"})
        }
        res.status(201).json({msg:"The product create with successfully ",product})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}
// const getProduct = async (req,res)=>{
//     try {
        
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// }
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        // Check if the user is authorized to perform this operation
        if (req.userRole !== "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
        // Find and delete the product by ID and gymName
        const product = await Product.findOneAndDelete({ _id: id, gymName: req.gymName })
        // Check if the product exists
        if (!product) {
            return res.status(404).json({ msg: 'Product not found or you do not have permission to delete it' })
        }
        // Respond with a success message
        return res.status(200).json({ msg: "Product deleted" })
    } catch (error) {
        // Respond with a generic error message
        return res.status(500).json({ msg: 'Internal Server Error' })
    }
}
const addCategory = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
        }
        const { name, description } = req.body
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).json({ msg: 'The category already exists' })
        }
        const category = await Category.create({ name, description, ...req.body,gymName: req.gymName })
        if (!category) {
            return res.status(400).json({ msg: "Can't create this category" })
        }
        res.status(201).json({ msg: 'Category created successfully', category })
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
};
const updateProducts = async (req, res) => {
    try {
        const name = req.params.productsName;
        // Check if the user is authorized to perform this operation
        if (req.userRole !== "admin") {
           return res.status(401).json({msg:"Unauthorized: Not authorized to perform this operation"})
//             // If the user is not an admin, update the product interaction
//             const interaction = req.body.interaction;
//             // Validate interaction
//             if (!interaction || !['reservation', 'save'].includes(interaction)) {
//                 return res.status(400).json({ msg: 'Invalid interaction type' });
//             }
//             // Find the product by name and gymName
//             const products = await Product.find({ name: name, gymName: req.gymName })
//             // Check if the product exists
//             if (!products||products.length()==0) {
//                 return res.status(404).json({ msg: 'Products with that name not found' })
//             }
//             // Add the interaction to the product
//     if (interaction.reservation) {
//    products.map((product=>{
//      // Check if the user's ID is already in the reservation array
//      if (product.interaction.reservation == req.user._id) {
//         product.interaction.reservation = null
//         // If the user's ID is found, remove it from the reservation array
//     } else {
//         // If the user's ID is not found, add it to the reservation array
//       if(!product.interaction.reservation){
//         product.interaction.reservation = req.user._id
//       }
//     }
//    }))
// } else if (interaction.save) {
//    products.map((product)=>{
//      // Check if the user's ID is already in the save array
//      const index = product.interaction.save.indexOf(req.user._id)
//      if (index !== -1) {
//          // If the user's ID is found, remove it from the save array
//          product.interaction.save.splice(index, 1);
//      } else {
//          // If the user's ID is not found, add it to the save array
//          product.interaction.save.push(req.user._id);
//      }
//    })
// }
// await products.save();
// // Respond with a success message
// return res.status(200).json({ msg: "Product interaction updated" ,products});
//         }
        }
        // If the user is an admin, update the products as usual
        const products = await Product.updateMany({ name: name, gymName: req.gymName }, { ...req.body, gymName: req.gymName })
        // Check if any products were updated
        if (!products || products.nModified === 0) {
            return res.status(404).json({ msg: 'No products with this name found or no updates made' })
        }
        // Respond with a success message
        return res.status(200).json({ msg: "Products with the same name updated" })
    } catch (error) {
        // Respond with a generic error message
        return res.status(500).json({ msg: 'Internal Server Error' })
    }
}
const getCategory = async (req,res)=>{
    try {
        const categoryName = req.params.categoryName
        const category = await Category.findOne({name:categoryName,gymName:req.gymName}).populate({
             path:'products'
        })
        if(!category){
          return  res.status(404).json({msg:"Category not found"})
        }
        res.status(200).json({msg:category})
    } catch (error) {
        res.status(500).json({msg:error})
    } 
}
const updateCategory = async (req, res) => {
    try {
        const oldName = req.params.categoryName;
        const newName = req.body.name;
        // Check if the user is authorized to perform this operation
        if (req.userRole !== "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
        // Check if the new name already exists for another category
        if(oldName!=newName){
            const existingCategory = await Category.findOne({ name: newName, gymName: req.gymName })
        if (existingCategory) {
            return res.status(400).json({ msg: 'Another category with the same name already exists' })
        }
        }
        // Update the category by name and gymName
        const category = await Category.findOneAndUpdate(
            { name: oldName, gymName: req.gymName },
            { name: newName, ...req.body, gymName: req.gymName },
            { new: true } // to return the updated category
        ).populate([
            {path:'products'}
        ]);
        // Check if the category exists
        if (!category) {
            return res.status(404).json({ msg: 'Category not found or you do not have permission to update it' })
        }
        // Respond with the updated category
        return res.status(200).json({ category })
    } catch (error) {
        // Respond with a generic error message
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}
const deleteCategory = async (req, res) => {
    try {
        const name = req.params.categoryName;
        // Check if the user is authorized to perform this operation
        if (req.userRole !== "admin") {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
        }
        // Find the category by name
        const category = await Category.findOne({ name: name ,gymName:req.gymName});
        // Check if the category exists
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        // Check if the category has any associated products
        if (category.products.length !== 0) {
            return res.status(400).json({ msg: 'Category already has products' });
        }
        // Delete the category
        await category.deleteOne();
        // Respond with success message
        return res.status(200).json({ msg: 'Category deleted successfully' });
    } catch (error) {
        // Respond with a generic error message
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({ gymName: req.gymName })
        if (!products || products.length == 0) {
            return res.status(404).json({ msg: 'There are no products' })
        }
        res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal Server Error' })
    }
}

// const getReservationProduct = async (req, res) => {
//     try {
//         const userId = req.userId; 
//         const products = await Product.aggregate([
//             // Match products where the user has made a reservation
//             { $match: { "interaction.reservation": userId } },
//             // Group products by name and retain only distinct names
//             {
//                 $group: {
//                     _id: "$name", // Group by product name
//                     products: { $push: "$$ROOT" } // Push all products with the same name into an array
//                 }
//             },
//             // Optionally, unwind the products array to get individual products
//             { $unwind: "$products" }
//         ]);

//         res.status(200).json({ products });
//     } catch (error) {
//         res.status(500).json({ msg: error });
//     }
// }


// const getRegisteredProducts = async (req,res)=>{
//     try {
//         const userId = req.userId; 
//         const products = await Product.aggregate([
//             // Match products where the user has made a reservation
//             { $match: { "interaction.save": userId } },
//             // Group products by name and retain only distinct names
//             {
//                 $group: {
//                     _id: "$name", // Group by product name
//                     products: { $push: "$$ROOT" } // Push all products with the same name into an array
//                 }
//             },
//             // Optionally, unwind the products array to get individual products
//             { $unwind: "$products" }
//         ]);

//         res.status(200).json({ products });
//     } catch (error) {
//         res.status(500).json({ msg: error });
//     }
// }
export {getCategory,updateCategory,updateProducts,addCategory,addProduct,deleteCategory,deleteProduct,getAllProduct}

