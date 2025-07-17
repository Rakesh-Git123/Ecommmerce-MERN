import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

//  Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;
    const image = req.file.path;
    const uploadResponse = await cloudinary.uploader.upload(image);
    const newProduct = new Product({
      name,
      description,
      price,
      image: uploadResponse.secure_url,
      category,
      countInStock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    console.error("Create Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch Products Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Pagination
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const count = await Product.countDocuments();
    const total = Math.ceil(count / limit);
    const products = await Product.find().skip(skip).limit(limit);
    res.status(200).json({ products, total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category = "", search = "", sort } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
    if (category.trim()) {
      query.category = category;
    }

    let sortOption = {};
    if (sort === "lowToHigh") {
      sortOption.price = 1;
    } else if (sort === "highToLow") {
      sortOption.price = -1;
    }

    const products = await Product.find(query).sort(sortOption);
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Fetch Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a product
export const updateProductStock = async (req, res) => {
  try {
    const { action } = req.body; // action: "increment" or "decrement"

    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (action === "increment") {
      product.countInStock += 1;
    } else if (action === "decrement") {
      if (product.countInStock > 0) {
        product.countInStock -= 1;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Stock cannot go below 0" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: "Stock updated",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Update Product Stock Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
