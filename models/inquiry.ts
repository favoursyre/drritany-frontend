//This handles the schema for the inquiry

//Libraries -->
import {Schema, model, Types, models } from "mongoose";
import { IInquiry, IInquiryModel } from "@/config/interfaces";

//Commencing the app

//This is the schema for the inquiry database
const inquirySchema = new Schema<IInquiry, IInquiryModel>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
  },
  { timestamps: true }
);

/**
 * @notice Static create and send inquiry
 * @param inquiry The details as required by IInquiry
 * @returns The created inquiry
 */
inquirySchema.statics.createInquiry = async function ( inquiry: IInquiry ) {

  //Adding the inquiry to the database before sending it to the admin
  const inquiry_ = await this.create(inquiry);

  //A function should be created that sends the inquiry to the admin

  return inquiry_;
};

/**
 * @notice Static get all inquiries
 * @returns All inquiries
 */
inquirySchema.statics.getAllInquiries = async function () {
  const inquiry = await this.find({}).sort({ createdAt: -1 });
  return inquiry;
};

/**
 * @notice Static get inquiry
 * @returns The inquiry
 */
inquirySchema.statics.getInquiryById = async function (id: string) {
  //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  const inquiry = await this.find({ _id: id })

  if (!inquiry) {
    throw new Error("Inquiry not found");
  } else {
    return inquiry;
  }
};

/**
 * @notice Static delete inquiry
 * @param id The id of the inquiry to be deleted
 * @returns The deleted inquiry
 */
inquirySchema.statics.deleteInquiry = async function (id: string) {
  //Validation of args
if (!Types.ObjectId.isValid(id)) {
  throw Error("Id is invalid");
}

//This deletes the quote from the database
const delete_ = await this.findOneAndDelete({ _id: id });
return delete_;
}

export const Inquiry: IInquiryModel = (models.Inquiry || model<IInquiry, IInquiryModel>("Inquiry", inquirySchema)) as IInquiryModel;
