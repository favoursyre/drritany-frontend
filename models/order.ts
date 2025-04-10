///This handles the schema for product order details

///Libraries -->
//import "dotenv/config";
import { Schema, model, Types, models } from "mongoose";
import { ICart, ICustomerSpec, IOrder, IOrderModel, ICartItem, DeliveryStatus, PaymentStatus } from "@/config/interfaces";
import { Product } from "./product";
import { trim } from "validator";

///Commencing the app
const ADMINS = [process.env.ADMIN_EMAIL1!, process.env.ADMIN_EMAIL2!]

///This is the schema for the order database
const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    accountId: {
      type: String,
      trim: true
    },
    customerSpec: {
      userId: {
        type: String,
        required: true,
        trim: true
      },
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
      municipality: {
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
        overallTotalPrice: {
          type: Number,
          required: true
        },
        tax: {
          type: Number,
          required: true
        },
        grossTotalPrice: {
          type: Number,
          required: true
        },
        totalDiscount: {
          type: Number,
          required: true
        },
        totalWeight: {
          type: Number,
          required: true
        },
        totalHiddenDeliveryFee: {
          type: Number,
          required: true
        },
        deliveryFee: {
          type: Number,
          required: true
        },
        cart: {
          type: Array<ICartItem>,
          required: true,
        }
    },
    deliverySpec: {
      status: {
        type: String,
        enum: DeliveryStatus,
        required: true
      },
      timeline: [{ 
        description: {
          type: String,
          trim: true
        },
        date: {
          type: String,
          trim: true
        },
        time: {
          type: String,
          trim: true
        }
      }] 
    },
    paymentSpec: {
      txId: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      status: {
        type: String,
        enum: PaymentStatus,
        required: true
      },
      exchangeRate: {
        type: Number
      },
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
orderSchema.statics.processOrder = async function ( order: IOrder ) {

  //Create a new order
  const foundOrder = await this.findOne({ "paymentSpec.txId": order.paymentSpec.txId })
  console.log('Found Order: ', foundOrder)

  if (foundOrder) {
    throw new Error('Duplicate found')
    return
  } 

  const order_ = await this.create(order);

  return order_;
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
 * @param id of the order to be queried
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

/**
 * @notice Static get order by Id of the user method
 * @param id of the order to be queried
 * @returns Order with the given user id
 */
orderSchema.statics.getOrderByAccountId = async function (userId: string) {
  //Validation of args
  // if (!Types.ObjectId.isValid(id)) {
  //   throw Error("Id is invalid");
  // }

  const orders = await this.find({}).sort({ createdAt: -1 });
  console.log("Orders server: ", orders.length)

  //const orders_ = []
  const orders_ = orders.filter((order) => order.accountId === userId || order.customerSpec.userId === userId)
  console.log("Orders server 1: ", orders_)

  return orders_;
}

/**
 * @notice Static order method
 * @param id The _id of the order
 * @returns The deleted data
 */
orderSchema.statics.deleteOrder = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  //This deletes the ingredient from the database
  const delete_ = await this.findOneAndDelete({ _id: id });
  return delete_;
};

/**
 * @notice Static update order method
 * @param req The params that were passed in during the client request
 * @param res The response of the query by client request
 * @returns The updated data
 */
orderSchema.statics.updateOrder = async function (id: string, order: IOrder) {
  //This updates the value in the database
  const update = await this.findOneAndUpdate(
    { _id: id },
    { ...order }
  );
  return update;
};

export const Order: IOrderModel = (models.Order || model<IOrder, IOrderModel>("Order", orderSchema)) as unknown as IOrderModel;