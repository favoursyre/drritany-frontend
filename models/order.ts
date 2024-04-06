///This handles the schema for product order details

///Libraries -->
//import "dotenv/config";
import { Schema, model, Types, models } from "mongoose";
import { ICart, ICustomerSpec, IOrder, IOrderModel, ICartItem } from "@/config/interfaces";
import { Product } from "./product";
//import { sendEmail } from "../utils/utils";

///Commencing the app
const ADMINS = [process.env.ADMIN_EMAIL1!, process.env.ADMIN_EMAIL2!]

///This is the schema for the order database
const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    customerSpec: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true
      },
      phoneNumbers: [{
        type: String,
        required: true,
        trim: true
      }],
      country: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      deliveryAddress: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
    },
    productSpec: {
        totalPrice: {
          type: Number,
          required: true,
          trim: true
        },
        cart: {
          type: Array<ICartItem>,
          required: true,
        }
    },
  },
  { timestamps: true }
);

/**
 * @notice Static process order method
 * @param customerSpec The infos of the customer making the order
 * @param productSpec The infos of the product been ordered
 * @returns All FAQs
 */
orderSchema.statics.processOrder = async function (
  customerSpec: ICustomerSpec,
  productSpec: ICart
) {

  //Create a new order
  const order = await this.create({
    customerSpec, productSpec
  });

  return order;
};

/**
 * @notice Static get all orders method
 * @returns All orders
 */
orderSchema.statics.getOrders = async function () {
  const order = await this.find({}).sort({ createdAt: -1 });
  return order;
};

/**
 * @notice Static get order by Id method
 * @param Id of the order to be queried
 * @returns Order with the given id
 */
orderSchema.statics.getOrderById = async function (id: string) {
    //Validation of args
    if (!Types.ObjectId.isValid(id)) {
      throw Error("Id is invalid");
    }
    const order = await this.find({ _id: id })
    return order;
}

export const Order: IOrderModel = (models.Order || model<IOrder, IOrderModel>("Order", orderSchema)) as unknown as IOrderModel;