//This handles the schema for the Product Review

//Libraries -->
import {Schema, model, Types, models } from "mongoose";
import { IProductReview, IProductReviewModel } from "@/config/interfaces";

//Commencing the app

//This is the schema for the Product Review database
const productReviewSchema = new Schema<IProductReview, IProductReviewModel>(
  {
    productId: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      required: true,
      trim: true
    },
    specs: { 
      color: {
        type: String,
        trim: true
      },
      size: {
        type: String,
        trim: true
      },
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      name: {
        type: String,
        trim: true,
      },
      driveId: {
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
      },
      type: {
        type: String,
        trim: true,
        required: true
      }
    },
    review: {
      type: String,
      trim: true,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      //trim: true,
    },
    country: {
      type: String,
      trim: true,
      required: true
    },
    createdAt: {
      type: String
    },
  },
  { timestamps: true }
);

/**
 * @notice Static create and send product review
 * @param inquiry The details as required by IProductReview
 * @returns The created product review
 */
productReviewSchema.statics.createProductReview = async function ( productReview: IProductReview ) {

  //Adding the product Review to the database before sending it to the admin
  const productReview_ = await this.create(productReview);

  //A function should be created that sends the inquiry to the admin

  return productReview_;
};

/**
 * @notice Static get all product Reviews
 * @returns All product Reviews
 */
productReviewSchema.statics.getAllProductReviews = async function () {
  const productReviews = await this.find({}).sort({ createdAt: -1 });
  return productReviews;
};

/**
 * @notice Static get product Review
 * @returns The product Review
 */
productReviewSchema.statics.getProductReviewById = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  const productReview = await this.find({ _id: id })

  if (!productReview) {
    throw new Error("Product Review not found");
  } else {
    return productReview;
  }
};

/**
 * @notice Static get product Review by Product Id
 * @returns The product Review
 */
productReviewSchema.statics.getProductReviewByProductId = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  const productReview = await this.find({ productId: id })

  if (!productReview) {
    throw new Error("Product Review not found");
  } else {
    return productReview;
  }
};

/**
 * @notice Static update productReview method
 * @returns The updated data
 */
productReviewSchema.statics.updateProduct = async function (id: string, productReview: IProductReview) {
  //This updates the value in the database
  const update = await this.findOneAndUpdate(
    { _id: id },
    { ...productReview }
  );
  return update;
};

/**
 * @notice Static delete productReview
 * @param id The id of the productReview to be deleted
 * @returns The deleted productReview
 */
productReviewSchema.statics.deleteProductReview = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  //This deletes the quote from the database
  const delete_ = await this.findOneAndDelete({ _id: id });
  return delete_;
}

export const ProductReview: IProductReviewModel = (models.ProductReview || model<IProductReview, IProductReviewModel>("ProductReview", productReviewSchema)) as unknown as IProductReviewModel;
