///This would contain all interfaces that will be used

///Libraries -->
import { Model } from 'mongoose';
import { NextResponse } from "next/server";

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
  _id?: string,
  driveId?: string,
  name?: string,
  src: string,
  alt?: string,
  width?: number,
  height?: number,
  type?: string //"image" | "video"
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
  processOrder(order: IOrder): IOrder,
  getOrders(): Array<IOrder>,
  getOrderById(id: string): Array<IOrder>
}  

///Declaring the interface for specification 
export interface ISpecification {
    brand?: string,
    itemForm?: string,
    itemCount?: number,
    userAgeRange?: string,
    gender?: string,
    power?: number, //Power is in Watts
    horsePower?: number,
    seaters?: number,
    engineType?: string,
    transmissionType?: string,
    voltage?: number,
    benefits?: Array<string>,
    prescription?: Array<string>,
    ingredients?: Array<string>,
    colors?: Array<string | IImage>,
    romStorage?: number,
    ramStorage?: number,
    manufactureYear?: number,
    batteryCapacity?: number,
    sizes?: Array<string | { size: string, percent: number}>,
    productOrigin?: string,
    productLocation?: string,
    modelNumber?: string,
    weight?: number,
    dimension?: {
      length?: number,
      width?: number,
      height?: number
    }
}

///Declaring the interface for inquiry mongoose schema static
export interface IInquiryModel extends Model<IInquiry> {
  createInquiry(inquiry: IInquiry): Array<IInquiry>,
  getAllInquiries(): Array<IInquiry>,
  getInquiryById(id: string): Array<IInquiry>
  deleteInquiry(id: string): IInquiry//
}

///Declaring the interface for admin mongoose schema static
export interface IAdminModel extends Model<IAdmin> {
  createAdmin(admin: IAdmin): IAdmin,
  getAllAdmins(): Array<IAdmin>,
  getAdminById(id: string): Array<IAdmin>,
  loginAdmin(emailAddress: string, password: string): Array<IAdmin>,
  deleteAdmin(id: string): IInquiry//
}

/**
 * @notice The interface for newsletter subscribers mongoose schema static
 */
export interface INewsModel extends Model<INews> {
  createSubscriber(subscriber: INews): INews,
  getAllSubscriber(): Array<INews>,
  deleteSubscriber(id: string): INews
}  

//Interface for modal store
export interface IModalBackgroundStore {
  modal: boolean;
  setModalBackground: (status: boolean) => void
}

//Interface for admin side bar store
export interface IAdminSideBarStore {
  status: boolean;
  setAdminSideBar: (status: boolean) => void
}

//Interface for contact modal store
export interface IContactModalStore {
  modal: boolean;
  setContactModal: (status: boolean) => void
}

//Interface for confirmation modal store
export interface IConfirmationModalStore {
  modal: boolean;
  choice: boolean,
  setConfirmationModal: (status: boolean) => void,
  setConfirmationChoice: (status: boolean) => void
}

//Interface for order form modal store
export interface IOrderFormModalStore {
  modal: boolean;
  setOrderFormModal: (status: boolean) => void
}

//Interface for order modal store
export interface IOrderModalStore {
  modal: boolean;
  setOrderModal: (status: boolean) => void
}

//Interface for discount modal store
export interface IDiscountModalStore {
  modal: boolean,
  product: {
    data: IProduct,
    poppedUp: boolean
  },
  setDiscountModal: (status: boolean) => void
  setDiscountProduct: (product: {
    data: IProduct,
    poppedUp: boolean
  }) => void
}

/**
 * @notice The interface for client info
 */
export interface IClientInfo {
  ip?: string,
  groupTest?: string,
  country?: ICountry
}

/**This is the interface for product category/filter settings
 * 
 * category
 */
export interface IProductFilter {
  filterId?: number,
  category?: ICategory | string
}

//This is the interface for slide titles
export interface ISlideTitle {
  barTitleId?: number,
  slideTitleId?: number
}

//Interface for client info store
export interface IClientInfoStore {
  info?: IClientInfo
  setClientInfo: (info: IClientInfo) => void
}

/**
 * @notice The interface for product mongoose schema api
 */
export interface IProduct {
    _id?: string,
    addedBy?: string,
    pricing?: IPricing,
    category?: ICategory,
    name?: string,
    images: Array<IImage>,
    active?: boolean,
    orders?: number,
    rating?: number,
    description?: string,
    extraDescription?: string,
    specification?: ISpecification,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

///Declaring the interface for cart term
export interface ICartItem {
    readonly _id: string,
    readonly image: IImage,
    readonly name?: string,
    readonly unitPrice: number,
    readonly unitWeight: number,
    quantity: number,
    specs?: { 
      color?: string | IImage,
      size?: string | { size: string, percent: number }
    },
    extraDiscount: {
      limit?: number,
      percent?: number
    },
    subTotalWeight: number,
    subTotalPrice: number,
    subTotalDiscount: number
} 

///Declaring the interface for the cart
export interface ICart {
  totalPrice: number,
  totalDiscount: number,
  totalWeight: number,
  deliveryFee: number,
  cart: Array<ICartItem>
}

///Declaring an interface for request parameters 
export interface IResponse extends NextResponse {
  params?: {
    id?: string
  },
  searchParams?: {
    id?: string,
    query?: string
  }
}

//Interface for currency
export interface ICurrency {
  name?: string,
  abbreviation?: string,
  symbol?: string,
  exchangeRate?: number //Unit in USD
}

//Interface for country name
export interface ICountryName {
  common?: string,
  official?: string,
  abbreviation?: string,
  demonym?: string,
  capital?: string | Array<string>
}

//Interface for country location
export interface ICountryLocation {
  continent?: string,
  subContinent?: string,
  geoCordinates?: {
    longitude?: number,
    latitude?: number
  },
  mapLink?: string
}

///Declaring the inteface for the country
export interface ICountry {
    name?: ICountryName,
    states?: Array<{
      name?: string,
      abbreviation?: string,
      counties?: Array<{
        name?: string,
        abbreviation?: string
      }>,
      extraDeliveryPercent: number
    }>,
    location?: ICountryLocation,
    dial_code?: string,
    currency?: ICurrency,
    timezones?: Array<string>,
    languages?: Array<{ 
      name?: string, 
      code?: string 
    }>,
    independence?: {
      date?: string, //DD-MM-YYYY
      age?: number //Age in years
    },
    gdp?: { //Unit in USD
      total?: number,
      perCapital?: number
    },
    delivery?: {
      feePerKg?: number, //USD per Kg
      baseNumber?: number //Base number to multiply the base fee
    },
    priceInflation?: number, //Price inflation percent
    flag?: IImage
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
    _id?: string,
    name?: string,
    image: IImage,
    profession?: string,
    testimony?: string
    createdAt?: string,
    updatedAt?: string,
    __v?: number
  }

///Declaring the interface for inquiry
export interface IInquiry {
  _id?: string,
  fullName: string,
  emailAddress: string,
  subject: string, 
  message: string
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

///Declaring the interface for admin
export interface IAdmin {
  _id?: string,
  fullName?: string,
  emailAddress?: string,
  password?: string, 
  superUser?: boolean,
  image: IImage,
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

//This is the interface for IDelivery
export interface IDelivery {
  status: DeliveryStatus,
  timeline?: Array<{ 
    description?: string,
    date?: string,
    time?: string
  }> 
}

/**
 * @notice The interface for IPayment
 * @param status The status of payment 
 * @param exchangeRate The exchange rate as at the time of order
 */
export interface IPayment {
  status: PaymentStatus,
  readonly exchangeRate: number
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
  deliverySpec: IDelivery,
  paymentSpec: IPayment,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

//The interface for category infos
export interface ICategoryInfo {
  macro: string,
  minis: Array<{ 
    mini: string,
    image?: IImage, 
    micros: Array<{ 
      micro: string, 
      nanos: Array<string> 
    }>
  }>
}

//The interface for category of a product
export interface ICategory {
  macro?: string,
  mini?: string,
  micro?: string,
  nano?: string
}

///The interface for IPricing
export interface IPricing {
  basePrice?: number,
  discount?: number,
  variantPrices?: Array<{
    country?: string,
    percent?: number ///This refer to the percent of inflation
  }>,
  extraDiscount?: {
    limit?: number,
    percent?: number
  },
  inStock?: boolean
}

//The interface for generic info of a product
export interface IProductGeneric {
  name?: string,
  description?: string,
  rating?: number,
  orders?: number
}

/**
 * @notice The interface for product mongoose schema static
 */
export interface IProductModel extends Model<IProduct> {
  createProduct(product: IProduct): IProduct,
  updateProduct(id: string, product: IProduct): IProduct,
  deleteProduct(id: string): IProduct,
  getProductByLatest(): Array<IProduct>,
  getProductById(id: string): Array<IProduct>,
  getProductByCategory(category: string): Array<IProduct>,
  getProductByPrice(_order: any): Array<IProduct>,
  getProductByOrder(): Array<IProduct>,
  getProductBySearch(query: string): Array<IProduct>
} 

///This is the interface for error
export interface IError {
  message?: string,
  cause?: string,
  solution?: string
}

//This is the interface for sheet
export interface ISheetInfo {
  sheetId: string,
  sheetRange: string,
  data: { [key: string]: any }
}

//This is the interface for query research
export interface IQueryResearch {
  IP: string,
  Country: string,
  Query: string,
  Date: string,
  Time: string
}

//This is the interface for product view research
export interface IProductViewResearch {
  IP: string,
  Country: string,
  Product: string,
  Date: string,
  Time: string
}

//This is the interface for traffic research
export interface ITrafficResearch {
  IP: string,
  Country: string,
  Date: string,
  Time: string
}

//This is the interface for wishlist research
export interface IWishlistResearch {
  IP: string,
  Country: string,
  Product: string,
  Action: string,
  Date: string,
  Time: string
}

///This is the interface for params
export interface IParams {
  params: {
    id?: string
  }
}

///Declaring the interface for order sheet
export interface IOrderSheet {
  OrderId?: string,
  CartId?: string,
  FullName?: string,
  EmailAddress?: string,
  PhoneNo1?: string,
  PhoneNo2?: string,
  Country?: string,
  State?: string,
  DeliveryAddress?: string,
  PostalCode?: string,
  ProductName?: string,
  Quantity?: string,
  UnitPrice?: string,
  TotalPrice?: string,
  DeliveryFee?: string,
  OverallTotalPrice?: string,
  DateOrdered?: string,
  TimeOrdered?: string,
  TestGroup?: string,
  LogStatus?: string,
  DeliveryStatus?: string,
  DateDelivered?: string
}


///Type for metadata arg props
export type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

//The enum for OS of client's device
export enum ClientOS {
  MAC_OS = "Mac OS",
  IOS = "iOS",
  ANDROID = "Android",
  WINDOW = "Windows",
  LINUX = "Linux",
  UNKNOWN = "Unknown"
}

//The enum for OS of client's device type
export enum ClientDevice {
  DESKTOP = "Desktop",
  TABLET = "Tablet",
  MOBILE = "Mobile"
}

//The enum for delivery status
export enum DeliveryStatus {
  PENDING = "Pending",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  RETURNED = "Returned",
  EXCEPTION = "Exception",
  CANCELLED = "Cancelled"
}

//The enum for payment status
export enum PaymentStatus {
  PENDING = "Pending",
  SUCCESS = "Successful",
  REFUND = "Refunded",
  FAILED = "Failed"
}

///The interface for a payment status and corresponding text color
export interface IPaymentStatus {
  status: PaymentStatus,
  color: string
}

//The interface for event status
export interface IEventStatus {
  status?: string,
  color?: {
    text?: string,
    background?: string
  }
}