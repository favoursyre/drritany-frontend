///This handles the schema for the details of the various products offered by the company

///Libraries -->
import {Schema, model, Types, models } from "mongoose";
import { ISpecification, IProduct, IProductModel, IImage } from "@/config/interfaces";

///Commencing the app

///This is the schema for the product database
const productSchema = new Schema<IProduct, IProductModel>(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    miniCategory: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{
      name: {
        type: String,
        trim: true,
      },
      src: {
        type: String,
        required: true,
        trim: true,
      },
      width: {
        type: Number,
        required: true,
        //trim: true,
      },
      height: {
        type: Number,
        required: true,
        //trim: true,
      }
    }],
    videos: [{
      name: {
        type: String,
        trim: true,
      },
      src: {
        type: String,
        required: true,
        trim: true,
      },
      width: {
        type: Number,
        required: true,
        //trim: true,
      },
      height: {
        type: Number,
        required: true,
        //trim: true,
      }
    }],
    price: {
      type: Number,
      required: true,
    },
    extraDiscount: {
      type: Boolean,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    freeOption: {
      type: Boolean,
      required: true,
    },
    orders: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    specification: {
        brand: {
            type: String,
            required: true,
            trim: true
        },
        itemForm: {
            type: String,
            required: true,
            trim: true
        },
        itemCount: {
            type: Number,
            required: true,
        },
        userAgeRange: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
          type: String,
          required: true,
          trim: true
        },
        benefits: [{
          type: String,
          required: true,
          trim: true
        }],
        prescription: [{
            type: String,
            required: true,
            trim: true
        }],
        ingredients: [{
            type: String,
            trim: true
        }],
        productOrigin: {
            type: String,
            required: true,
            trim: true
        },
        size: {
          length: {
            type: Number,
          },
          breadth: {
            type: Number
          },
          height: {
            type: Number,
          }
        },
        weight: {
            type: Number,
            required: true,
        }
    }
  },
  { timestamps: true }
);

// PRE MIDDLEWARE
// productSchema.pre('save', function (this: typeof productSchema, next: any) {
//     this.specification.sku = this._id;
//     console.log("Next in product schema: ", typeof next())
//     next();
// });

/**
 * @notice Static create ingredient method
 * @returns All the available products
 * @param category The category the product belongs to
 * @param subCategory The sub category the product belongs to
 * @param name The name of the product
 * @param images A list of all image paths of the product. Note, images[0] is the main image
 * @param videos A list of all video paths for the product
 * @param price The price of the product
 * @param orders The number of orders made for the product
 * @param description The detailed description of the product
 * @param specification The detailed specifications of the product
 * @returns The created product including it's id
 */
productSchema.statics.createProduct = async function (product: IProduct) {
  //let slashedPrice: number = (price * 100) / (100 - discount)
  
  //Creating the database
  const product_ = await this.create({ ...product });
  return product_;
};

/**
 * @notice Static update ingredient method
 * @param req The params that were passed in during the client request
 * @param res The response of the query by client request
 * @returns The updated data
 */
productSchema.statics.updateProduct = async function (id: string, product: IProduct) {
  //This updates the value in the database
  const update = await this.findOneAndUpdate(
    { _id: id },
    { ...product }
  );
  return update;
};

/**
 * @notice Static delete method
 * @param id The _id of the product
 * @returns The deleted data
 */
productSchema.statics.deleteProduct = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  //This deletes the ingredient from the database
  const delete_ = await this.findOneAndDelete({ _id: id });
  return delete_;
};

/**
 * @notice Static get all product
 * @returns All the available products
 */
productSchema.statics.getProductByLatest = async function () {
    const products = await this.find({}).sort({ createdAt: -1 });
    return products;
  };

/**
 * @notice Static get product by id
 * @returns The product with the given id
 */
productSchema.statics.getProductById = async function (id: string) {
    //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }
  const product = await this.find({ _id: id })
  return product;
}

/**
 * @notice Static get ingredient by the category method
 * @param category The product category
 * @returns The products within the defined category
 */
productSchema.statics.getProductByCategory = async function (category: string) {
  const products = await this.find({ category: category }).sort({
    createdAt: -1,
  });
  return products;
};

/**
 * @notice Static get products by price method
 * @param order The order by which it should be fetched (1 and -1 for ascending and descending order respectively)
 * @returns The products defined by the order of the price
 */
productSchema.statics.getProductByPrice = async function (_order: any) {
  const products = await this.find({}).sort({ price: _order, createdAt: -1 });
  return products;
};

/**
 * @notice Static get products by order method
 * @param order The order by which it should be fetched (1 and -1 for ascending and descending order respectively)
 * @returns The products defined by the order of the number of orders
 */
 productSchema.statics.getProductByOrder = async function () {
  const products = await this.find({}).sort({ orders: -1, createdAt: -1 });
  return products;
};

/**
 * @notice Static get products by search method
 * @param keyword Keyword to be searched
 * @returns The products with the found keyword
 */
productSchema.statics.getProductBySearch = async function (query: string) {
  const regex = RegExp(query, "i")
  const products = this.find({
    $or: [
      { category: regex },
      { subCategory: regex },
      { name: regex },
      { description: regex },
      { "specification.brand": regex}
    ]
  })
  return products
}

export const Product: IProductModel = (models.Product || model<IProduct, IProductModel>("Product", productSchema)) as unknown as IProductModel;