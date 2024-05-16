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
  name?: string,
  src: string,
  alt?: string,
  width?: number,
  height?: number,
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
  getOrderById(id: string): Array<IOrder>
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

//Interface for modal store
export interface IModalBackgroundStore {
  modal: boolean;
  setModalBackground: (status: boolean) => void
}

//Interface for contact modal store
export interface IContactModalStore {
  modal: boolean;
  setContactModal: (status: boolean) => void
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
    name: string,
    freeOption: boolean,
    poppedUp: boolean
  },
  setDiscountModal: (status: boolean) => void
  setDiscountProduct: (product: {
    name: string,
    freeOption: boolean,
    poppedUp: boolean
  }) => void
}

/**
 * @notice The interface for client info
 */
export interface IClientInfo {
  groupTest?: string,
  country?: ICountry
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
    _id: string,
    category?: String,
    subCategory?: string,
    name?: string,
    images: Array<IImage>,
    videos?: Array<string>,
    price?: number,
    slashedPrice?: number,
    discount: number,
    orders?: number,
    freeOption?: boolean,
    rating?: number,
    description?: String,
    specification?: ISpecification
    createdAt: string,
    updatedAt: string,
    __v: number
}

///Declaring the interface for cart term
export interface ICartItem {
    readonly _id: string,
    readonly image: IImage,
    readonly name?: string,
    readonly unitPrice: number,
    quantity: number,
    freeOption: boolean,
    subTotalPrice: number,
    subTotalDiscount: number
} 

///Declaring the interface for the cart
export interface ICart {
  totalPrice: number,
  totalDiscount: number,
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
      }>
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
  createProduct(product: IProduct): IProduct,
  updateProduct(id: string, product: IProduct): IProduct,
  deleteProduct(id: string): IProduct,
  getProductByLatest(): Array<IProduct>,
  getProductById(id: string): IProduct,
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