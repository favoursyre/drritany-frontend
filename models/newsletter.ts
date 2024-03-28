///This handles the schema for subscribers of newsletter

///Libraries -->
import { Schema, model, Types, models } from "mongoose";
import { INews, INewsModel } from "@/config/interfaces";

///Commencing the app

///This is the schema for the newsletter subscribers database
const newsSchema = new Schema<INews, INewsModel>(
  {
    subscriber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
  },
  { timestamps: true }
);

/**
 * @notice Static create newsletter subscriber
 * @param subscriber The email address of the subscriber
 * @returns The created subscriber
 */
newsSchema.statics.createSubscriber = async function (newsletter: INews) {

  //Creating the account
  const { subscriber } = newsletter
  //console.log("Email server: ", emailAddress)
  const exist = await this.find({ subscriber: subscriber })
  
  //Checking if an account exist with the given email
  if (exist.length === 0) {
    //Checking if an account exist with the given referrer id given its not 0
    const newsletter_ = await this.create(newsletter);
    return newsletter_;
  } else {
    throw new Error("This email is already subscribed")
  }
};

/**
 * @notice Static get all subscribers
 * @returns All subscribers
 */
newsSchema.statics.getAllSubscriber = async function () {
  const subscriber = await this.find({}).sort({ createdAt: -1 });
  return subscriber;
};

/**
 * @notice Static delete subscriber
 * @param id The id of the subscriber to be deleted
 * @returns The deleted subscriber
 */
newsSchema.statics.deleteSubscriber = async function (id: string) {
    //Validation of args
  if (!Types.ObjectId.isValid(id)) {
    throw Error("Id is invalid");
  }

  //This deletes the quote from the database
  const delete_ = await this.findOneAndDelete({ _id: id });
  return delete_;
}

export const News: INewsModel = (models.News || model<INews, INewsModel>("News", newsSchema)) as INewsModel;
