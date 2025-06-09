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
  getOrderById(id: string): Array<IOrder>,
  getOrderByAccountId(userId: string): Array<IOrder>,
  deleteOrder(id: string): IOrder,
  updateOrder(id: string, order: IOrder): IOrder
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

//Interface for loading modal store
export interface ILoadingModalStore {
  modal: boolean;
  setLoadingModal: (status: boolean) => void
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

//Interface for import product modal store
export interface IImportProductModalStore {
  modal: boolean;
  setImportProductModal: (status: boolean) => void
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

//Interface for product discount modal
export interface ICartItemDiscountModalStore {
  modal: boolean,
  cartItem: ICartItemDiscount,
  setCartItemDiscountModal: (status: boolean) => void
  setCartItemDiscount: (cartItem: ICartItemDiscount) => void
}

/**
 * @notice The interface for client info
 */
export interface IClientInfo {
  _id?: string,
  ipData?: {
    ip?: string,
    city?: string,
    region?: string,
    country?: string
  },
  groupTest?: string,
  countryInfo?: ICountry
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
 * @param _id - The id of the product (also SKU)
 * @param addedBy - The account id who added the product
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
    addedToCart?: number,
    addedToWishlist?: number,
    stock?: number, //This is the total stock available for the product
    rating?: number,
    description?: string,
    extraDescription?: string,
    specification?: ISpecification,
    addDelivery?: boolean,
    sampleOrders?: number,
    url?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?: number
}

//Declaring the interface cart item discount
export interface ICartItemDiscount {
  img: IImage,
  oldPrice: number,
  discountedPrice: number,
  newPrice: number,
  newXtraDiscount: number
}

///Declaring the interface for cart term
export interface ICartItem {
    readonly _id: string,
    readonly image: IImage,
    readonly name?: string,
    readonly unitPrice: number,
    readonly unitWeight: number,
    readonly unitHiddenDeliveryFee: number,
    readonly discountPercent: number,
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
    subTotalHiddenDeliveryFee: number,
    subTotalDiscount: number
} 

///Declaring the interface for the cart
export interface ICart {
  overallTotalPrice?: number,
  tax?: number,
  grossTotalPrice: number,
  totalDiscount: number,
  totalWeight: number,
  totalHiddenDeliveryFee: number,
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
    stateTitle?: string,
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

///Declaring the interface for the testimonial
export interface IProductReview {
  _id?: string,
  productId?: string,
  userId?: string,
  specs?: { 
    color?: string,
    size?: string
  },
  name?: string,
  image?: IImage,
  review?: string,
  rating?: number,
  country?: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}

///Declaring the interface for product review mongoose schema static
export interface IProductReviewModel extends Model<IProductReview> {
  createProductReview(productReview: IProductReview): Array<IProductReview>,
  updateProductReview(id: string, productReview: IProductReview): IProductReview,
  getAllProductReviews(): Array<IProductReview>,
  getProductReviewById(id: string): Array<IProductReview>
  getProductReviewByProductId(productId: string): Array<IProductReview>
  deleteProductReview(id: string): IProductReview
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

///This is the interface for return policy modal
export interface IReturnPolicyModalStore {
  modal: boolean;
  setReturnPolicyModal: (status: boolean) => void
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
  userId: string, //This is the default assigned chrome id
  readonly fullName: string,
  readonly email: string,
  readonly phoneNumbers: Array<string | undefined>,
  readonly country: string,
  readonly state: string,
  readonly municipality?: string,
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
  readonly txId: string,
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
  accountId?: string,
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
    amount?: number ///This refer to the amount in dollar equivalent to the country's own currency
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
  ID: string,
  IP: string,
  City: string,
  Region: string,
  Country: string,
  Query: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

//This is the interface for event research
export interface IEventResearch {
  ID: string,
  EventName: string,
  Data: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

//This is the interface for product view research
export interface IProductViewResearch {
  ID: string,
  IP: string,
  City: string,
  Region: string,
  Country: string,
  Product_Name: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

//This is the interface for traffic research
export interface ITrafficResearch {
  ID: string,
  IP: string,
  City: string,
  Region: string,
  Country: string,
  Page_Title: string,
  Page_URL: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

//This is the interface for button research
export interface IButtonResearch {
  ID: string,
  IP: string,
  City: string,
  Region: string,
  Country: string,
  Button_Name: string,
  Button_Info: string,
  Page_Title: string,
  Page_URL: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

//This is the interface for wishlist research
export interface IWishlistResearch {
  ID: string,
  IP: string,
  City: string,
  Region: string,
  Country: string,
  Product_Name: string,
  Action: string,
  Date: string,
  Time: string,
  OS: ClientOS,
  Device: ClientDevice
}

///This is the interface for params
export interface IParams {
  params: {
    id?: string
  }
}

///Declaring the interface for order sheet
export interface IOrderSheet {
  UserId?: string,
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
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

//Interface for cached data
export interface ICacheData {
  value: any;
  timestamp: number; // Timestamp when the data was set
  expirationTime: number; // Expiration time in seconds
}

//The enum for payment status
export enum PaymentStatus {
  PENDING = "Pending",
  SUCCESS = "Successful",
  REFUND = "Refunded",
  FAILED = "Failed"
}

//The enum for the various platforms
export enum MarketPlatforms {
  ALIEXPRESS = "AliExpress",
  TAOBAO = "Taobao",
  _1688 = "1688",
  AMAZON = "Amazon",
  CJDROPSHIP = "CJDropshipping"
}

///The interface for market platforms
export interface IMarketPlatform {
  name: string,
  url: string,
  content?: string
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

//The enum for meta events
export enum MetaStandardEvent {
  AddToCart = "AddToCart",
  AddToWishlist = "AddToWishlist",
  AddPaymentInfo = "AddPaymentInfo",
  Purchase = "Purchase",
  PageView = "PageView",
  ViewContent = "ViewContent",
  InitiateCheckout = "InitiateCheckout",
  Search = "Search",
  CompleteRegistration = "CompleteRegistration"
}

//The enum for meta action source
export enum MetaActionSource {
  app = "app",
  chat = "chat",
  email = "email",
  other = "other",
  phone_call = "phone_call",
  physical_store = "physical_store",
  system_generated = "system_generated",
  website = "website",
}

//Meta event parameters
export interface IMetaWebEvent {
  data: Array<{
      event_name: MetaStandardEvent | string,
      event_time: number,
      event_id: string,
      action_source: MetaActionSource,
      user_data?: {
          client_user_agent: string,
          client_ip_address: string,
          external_id: string, //A unique id for the user and should be returned using SHA256
          fbc: string, //This is click id
          fbp: string, //This is browser id
          fn?: string, //This is first name and should be returned using SHA256
          ln?: string, //This is last name and should be returned using SHA256
          ge?: string, //This is gender (m/f) and should be returned using SHA256
          db?: string, //This is date of birth (YYYYMMDD) and should be returned using SHA256
          em?: Array<string>, //This is email and should be returned using SHA256
          ph?: Array<string>, //This is phone number and should be returned using SHA256
          ct?: string, //This is city in lowercase and should be returned using SHA256
          st?: string, //This is state in lowercase 2-letter-code and should be returned using SHA256
          country?: string, //This is country in lowercase 2-letter-code and should be returned using SHA256
          zp?: string, //This is zip code in 5digits and should be returned using SHA256
      },
      custom_data?: {
          content_name: string, //Name of the product or page
          content_category?: string,
          content_ids?: Array<string>,
          content_type?: "product" | "product_group",
          contents?: Array<Object>,
          currency?: string, //"USD",
          value?: number, //142.52
          num_items?: string, //Only used with initiated checkout event 
          order_id?: string,
      },
      attribution_data?: {
        attribution_share: string
      },
      original_event_data?: {
          event_name?: string,
          event_time?: number
      }
  }>
}