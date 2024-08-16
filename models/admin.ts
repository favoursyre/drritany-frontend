//This handles the schema for the admin

//Libraries -->
import {Schema, model, Types, models } from "mongoose";
import { IAdmin, IAdminModel } from "@/config/interfaces";
import bcrypt from "bcrypt"

//Commencing the app
const saltRounds = 10;

//This is the schema for the admin database
const adminSchema = new Schema<IAdmin, IAdminModel>(
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
    password: {
      type: String,
      required: true,
      trim: true
    },
    superUser: {
      type: Boolean,
      required: true
    },
    image: {
      name: {
        type: String,
        trim: true,
      },
      src: {
        type: String,
        trim: true,
      },
      width: {
        type: Number,
        //trim: true,
      },
      height: {
        type: Number,
        //trim: true,
      },
    },
  },
  { timestamps: true }
);

/**
 * @notice Static create and send inquiry
 * @param admin The details as required by IAdmin
 * @returns The created admin
 */
adminSchema.statics.createAdmin = async function ( admin: IAdmin ) {
    //Extracting the password and hashing it
    const { password: oldPassword } = admin
    console.log("Admin Received: ", admin)
    const password = await bcrypt.hash(oldPassword!, saltRounds)
    console.log("test 1: ", password)

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            // Handle error
            return;
        }
        
        // Salt generation successful, proceed to hash the password
        bcrypt.hash(oldPassword!, salt, (err, hash) => {
            if (err) {
                // Handle error
                return;
            }
        
        // Hashing successful, 'hash' contains the hashed password
        console.log('Hashed password:', hash);
        });
    });

  //Adding the admin to the database
  const newAdmin = { ...admin, password }
  const admin_ = await this.create(newAdmin);

  return admin_;
};

/**
 * @notice Static login into account
 * @returns The logged in account
 */
adminSchema.statics.loginAdmin = async function (emailAddress: string, password: string) {

    //Checking if an account has the email
    const account: Array<IAdmin> = await this.find({ emailAddress: emailAddress })
  
    if (account.length === 0) {
      throw new Error("Access Denied")
    } else {
  
      ///Checking if the password match
      const { password: password_ } = account[0]
      if (!await bcrypt.compare(password, password_!)) {
        throw new Error("Access Denied")
      } else {
  
        //Checking if the acocunt is verified
        // if (account[0].verification === {}) {
        //   throw new Error("Verify your email to access your account")
        // } else {
        //console.log('veri stat: ', Object.values(account[0].verification))
          return account
      //}
      }
    }
  }

/**
 * @notice Static get all admins
 * @returns All admins
 */
adminSchema.statics.getAllAdmins = async function () {
  const admins = await this.find({}).sort({ createdAt: -1 });
  return admins;
};

/**
 * @notice Static get admin
 * @returns The admin
 */
adminSchema.statics.getAdminByEmail = async function (email: string) {

  const admin = await this.find({ emailAddress: email })

  if (!admin) {
    throw new Error("Admin not found");
  } else {
    return admin;
  }
};

/**
 * @notice Static delete admin
 * @param id The id of the admin to be deleted
 * @returns The deleted admin
 */
adminSchema.statics.deleteAdmin = async function (id: string) {
  //Validation of args
if (!Types.ObjectId.isValid(id)) {
  throw Error("Id is invalid");
}

//This deletes the admin from the database
const admin_ = await this.findOneAndDelete({ _id: id });
return admin_;
}

export const Admin: IAdminModel = (models.Admin || model<IAdmin, IAdminModel>("Admin", adminSchema)) as unknown as IAdminModel;
