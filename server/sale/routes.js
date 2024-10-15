import express from "express"
import { getCategory,updateCategory,updateProducts,deleteCategory,deleteProduct,addCategory,addProduct,getAllProduct } from "./function.js"
const productRouter = express.Router()
productRouter.get('/sale/category/:categoryName',getCategory) // get all product inside this cateogry
productRouter.get('/sale/products',getAllProduct)
productRouter.delete('/sale/category/:categoryName',deleteCategory) //delete category if there no product in this cateogory
productRouter.post('/sale/category',addCategory)
productRouter.patch('/sale/category/:categoryName',updateCategory) //update category
productRouter.patch('/sale/product/:productsName',updateProducts) //update all product that have the same name
productRouter.delete('/sale/product/:id',deleteProduct) //delete one product by there id
productRouter.post('/sale/product',addProduct) // add product in specific category

export default productRouter 