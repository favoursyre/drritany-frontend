///This would contain all interfaces that will be used

///Libraries -->
import { Model } from 'mongoose';

///Commencing the code
///IFAQ
export interface IFAQState {
    _id?: string,
    question?: string,
    answer?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

///This declares the interface for image
export interface IImage {
  name?: string,
  src?: string,
  width?: number,
  height?: number
}

///IQuote
export interface IQuoteState {
    _id?: string,
    quote?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

/**
 * @notice The interface for Order mongoose schema static
 */
export interface IOrderModel extends Model<IOrder> {
  processOrder(customerSpec: ICustomerSpec, productSpec: ICart): IOrder,
  getOrders(): Array<IOrder>,
  getOrderById(id: string): IOrder
}  

///Declaring the interface for specification 
export interface ISpecification {
    brand?: String,
    itemForm?: String,
    itemCount?: number,
    userAgeRange?: String,
    gender?: String,
    benefits?: Array<String>,
    prescription?: Array<String>,
    ingredients?: Array<String>,
    productOrigin?: String,
    weight?: number
}

///Declaring the interface for inquiry mongoose schema static
export interface IInquiryModel extends Model<IInquiry> {
  createInquiry(inquiry: IInquiry): Array<IInquiry>,
  getAllInquiries(): Array<IInquiry>,
  getInquiryById(id: string): Array<IInquiry>
  deleteInquiry(id: string): IInquiry//
}

/**
 * @notice The interface for newsletter subscribers mongoose schema static
 */
export interface INewsModel extends Model<INews> {
  createSubscriber(subscriber: INews): INews,
  getAllSubscriber(): Array<INews>,
  deleteSubscriber(id: string): INews
}  

/**
 * @notice The interface for product mongoose schema api
 */
 export interface IProduct {
    _id: string,
    category?: String,
    subCategory?: string,
    name?: string,
    images: Array<string>,
    videos?: Array<string>,
    price?: number,
    slashedPrice?: number,
    orders?: number,
    description?: String,
    specification?: ISpecification
    createdAt: string,
    updatedAt: string,
    __v: number
}

///Declaring the interface for cart term
export interface ICartItem {
    readonly _id: string,
    readonly image: string,
    readonly name?: string,
    readonly unitPrice: number,
    quantity: number
    subTotalPrice: number
} 

///Declaring the interface for the cart
export interface ICart {
  totalPrice: number,
  cart: Array<ICartItem>
}

///Declaring the inteface for the country
export interface ICountry {
    name: string;
    dial_code: string;
    code: string;
    flag: string;
}

/**
 * @notice The interface for contact mongoose schema
 * @param phoneNumber The phone number of the company
 * @param emailAddress The email address of the company
 */
 export interface IContact {
    phoneNumber?: string,
    emailAddress?: string
  }

///Declaring the inteface for the testimonial
 export interface ITestimony {
    _id: string,
    name?: string,
    image?: IImage,
    profession?: string,
    testimony?: string
    createdAt: string,
    updatedAt: string,
    __v: number
  }

/**
 * @notice The interface for client info
 * @param country The country of the client
 */
export interface IClientInfo {
  country: string,
  countryCode: string,
  currency: string,
  currencySymbol: string,
  exchangeRate: number,
  groupTest: string
}

///Declaring the interface for inquiry
export interface IInquiry {
  _id?: string,
  firstName: string,
  lastName: string,
  emailAddress: string, 
  message: string
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

/**
 * @notice The interface for newsletter subscribers mongoose schema
 * @param subscriber The email address of the subscriber
 */
 export interface INews {
  _id?: string,
  subscriber: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

///Declaring the interface for customer order
export interface ICustomerSpec {
  readonly fullName: string,
  readonly email: string,
  readonly phoneNumbers: Array<string | undefined>,
  readonly country: string,
  readonly state: string,
  readonly deliveryAddress: string,
  readonly postalCode: string
}

/**
 * @notice The interface for order mongoose schema
 * @param question The question 
 * @param answer The answer to the question
 */
export interface IOrder {
  _id?: string,
  customerSpec: ICustomerSpec,
  productSpec: ICart,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

/**
 * @notice The interface for product mongoose schema static
 */
export interface IProductModel extends Model<IProduct> {
  createProduct(
      category: String,
      subCategory: String,
      name: String,
      images: Array<String>,
      videos: Array<String>,
      price: number,
      orders: number,
      description: String,
      specification: ISpecification
    ): Object,
  updateProduct(id: String, body: IProduct): Object,
  deleteProduct(id: String): Object,
  getProductByLatest(): Array<Object>,
  getProductById(id: String): Object,
  getProductByCategory(category: String): Array<Object>,
  getProductByPrice(_order: any): Array<Object>,
  getProductByOrder(): Array<Object>,
  getProductBySearch(query: string): Array<Object>
} 


