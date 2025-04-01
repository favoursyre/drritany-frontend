///This file is for everything email

///Libraries -->
import nodemailer from "nodemailer"
import { IOrder, IInquiry, IAdmin } from "./interfaces"
import { companyName, SUPPORT_EMAIL, SUPPORT_PASSWORD, domainName } from "./utils"
import { html } from "cheerio/dist/commonjs/static";

///Commencing the code


/**
 * @notice This sends an email, works with gmail account for now
 * @param senderEmail The email address of the sender
 * @param senderPassword The password for the email address of the sender
 * @param recipientEmail The recipient's email address
 * @param subject The subject of the email to be sent
 * @param body The body message of the email to be sent
 * @returns The status of the sent email, whether successful or not
 */
export const sendEmail = async (
    senderName: string,
    senderEmail: string, 
    senderPassword: string, 
    recipientEmail: string, 
    subject: string,
    body: string | undefined,
    template: string | undefined,
    context: Object | undefined
    ): Promise<string | void> => {
        let transporter = nodemailer.createTransport({
          // host: 'smtp.privateemail.com', // Replace with your SMTP host
          port: 465, // Replace with your SMTP port
          secure: true, // Set to true if using a secure connection (e.g., port 465)
          host: "smtp.hostinger.com",
            auth: {
              user: senderEmail,
              pass: senderPassword
            },
            tls: {
              ciphers:'SSLv3'
          }
          });


        // point to the template folder
        // const handlebarOptions: NodemailerExpressHandlebarsOptions = {
        //   extName: '.hbs',
        //   viewEngine: {
        //       partialsDir: path.resolve('./src/utils/emails/'),
        //       defaultLayout: false,
        //   },
        //   viewPath: path.resolve('./src/utils/emails/'),
        // };
        console.log("Credentials: ", SUPPORT_EMAIL, SUPPORT_PASSWORD)
        // // use a template file with nodemailer
        // transporter.use('compile', hbs(handlebarOptions))

          let mailOptions = {
            from: `${senderName} Support <${senderEmail}>`,
            to: recipientEmail,
            subject: subject,
            text: body,
            html: template,
            context: context
          };
          
          await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                  reject(error)
                return error.message
              } else {
                console.log('Email sent: ' + info.response);
                  resolve(info)
                return info.response
              }
            });
          })
}


/**
 * @notice This sends a subnewsletter email to a customer
 * @param recipientEmail The recipient's email address
 * @param recipientName The name of the recipient
 * @param subject The subject of the email to be sent
 * @param body The body message of the email to be sent
 * @returns The status of the sent email, whether successful or not
 */
export const sendSubnewsletterEmail = async (recipientEmail: string): Promise<any> => {
  const template: string = `
  <html lang="en">
    <head>
      <title></title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
  
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Inter');
        
        html {
          padding: 0px;
          overflow-x: hidden;
          /* border: 2px solid yellow; */
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          font-family: 'Inter';
          background-color: blue;
        }
  
        body {
          /* align-items: center; */
          position: absolute;
          /* border: 2px solid blue; */
          width: 95%;
          height: 95%;
          background-color: blue;
        }
  
        main {
          /* align-items: center; */
          position: relative;
          border: 2px solid blue;
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 95%;
          height: 100%;
          padding: 1% 2.5%;
          background-color: blue;
        }
  
        .logo {
          position: relative;
          border: 2px solid blue;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 95%;
          height: 7%;
          margin-bottom: 20px;
          top: 5%;
        }
  
        .logo img {
          position: relative;
          object-fit: contain;
          /* border: 2px solid blue; */
          width: 7%;
          height: 60%;
        }
  
        .message {
          border: 2px solid red;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 5%;
          height: 30%;
          top: 10%;
          font-size: 14px;
          line-height: 22px;
        }
  
        #body {
          border: 2px solid blue;
          position: relative;
          display: flex;
          flex-direction: column;
        }
  
      /* This is for mobile */
      @media (min-width: 550px) and (max-width: 1024px) {
        .logo img {
          width: 15%;
        }
      }
  
        /* This is for mobile */
        @media (min-width: 0px) and (max-width: 550px) {
  
          .logo {
            margin-bottom: 0px;
          }
  
          .logo img {
              /* border: 1px solid red; */
              width: 25%;
          }
  
          .brief {
            font-size: 18px;
            flex-direction: column;
          }
  
          .message {
            top: 20%;
            height: 40%;
          }
  
          #body {
            top: 5%;
          }
        }
  
        /* This is for mobile */
        @media (min-width: 0px) and (max-width: 300px) {
  
          .message {
            height: 50%;
          }
  
          #body {
            top: 5%;
          }
        }
      </style>
    </head>
  
    <body>
      <main>
        <header class="logo">
          <img 
              src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
              alt="test"
          />
        </header>
        <div class="message">
          <span id="body">
            Hey,
          <br />
          <br />
              Thank you for subscribing to our newsletter! We are delighted to have you on board. Rest assured, you will be the first to receive updates whenever a new product is listed. Stay tuned for exciting news and offers! 
          <br />
          <br />
          Best regards, <br />
          Dr Ritany Customer Care
          </span>
        </div>
      </main>
      <script>
        
      </script>
    </body>
  </html>
  `
  const body = `
Hey,
  
Thank you for subscribing to our newsletter! 
We are delighted to have you on board. Rest assured, you will be among the first to receive our latest news, promotions and exclusive offers right in your inbox. We're excited to have you as part of our community.
  
If you ever have any questions, concerns or suggestions, feel free to reply to this email. We value your feedback immensely.

Warmest regards, 

Customer Support Team
${companyName} Inc.
  `
  const status = await sendEmail(`${companyName}`, SUPPORT_EMAIL, SUPPORT_PASSWORD, recipientEmail, `Successful Newsletter Subscription`, body, undefined, undefined)
  return status
}

/**
 * @notice This sends a successful inquiry email to a customer
 * @param recipientEmail The recipient's email address
 * @param recipientName The name of the recipient
 * @param subject The subject of the email to be sent
 * @param body The body message of the email to be sent
 * @returns The status of the sent email, whether successful or not
 */
 export const sendInquiryEmail = (inquiry: IInquiry): any => {
  const template: string = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style type="text/css">
    @import url('https://fonts.googleapis.com/css?family=Inter');
      html {
        padding: 0px;
        overflow-x: hidden;
        /* border: 2px solid yellow; */
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        font-family: 'Inter';
      }

      body {
        /* align-items: center; */
        position: absolute;
        /* border: 2px solid blue; */
        width: 95%;
        height: 95%;
      }

      main {
        /* align-items: center; */
        position: relative;
        border: 2px solid blue;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 95%;
        height: 100%;
        padding: 1% 2.5%;
      }

      .logo {
        position: relative;
        border: 2px solid blue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 95%;
        height: 7%;
        margin-bottom: 20px;
        top: 5%;
      }

      .logo img {
        position: relative;
        object-fit: contain;
        /* border: 2px solid blue; */
        width: 7%;
        height: 60%;
      }

      .message {
        border: 2px solid blue;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 5%;
        top: 10%;
        font-size: 16px;
        line-height: 22px;
      }

      #salute {

      }

      #body {
        border: 2px solid blue;
        position: relative;
        display: flex;
        flex-direction: column;
        top: 15%;
      }

    /* This is for mobile */
    @media (min-width: 550px) and (max-width: 1024px) {
      .logo img {
        width: 15%;
      }
    }

      /* This is for mobile */
      @media (min-width: 0px) and (max-width: 550px) {

        .logo {
          margin-bottom: 0px;
        }

        .logo img {
            /* border: 1px solid red; */
            width: 25%;
        }

        .brief {
          font-size: 18px;
          flex-direction: column;
        }

        .message {
          font-size: 16px;
        }

        #body {
          top: 5%;
        }
      }
    </style>
  </head>

  <body>
    <main>
      <header class="logo">
        <img 
            src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
            alt="test"
        />
      </header>
      <div class="message">
        <span id="salute">Dear,</span>
        <span id="body">
            Thank you for reaching out to us. We have received your message and our team will respond to you promptly. 
        <br />
        <br />
        Best regards, <br />
        Dr Ritany Customer Care
        </span>
      </div>
    </main>
    <script>
      
    </script>
  </body>
</html>
  `

  const body = `
Dear ${inquiry.fullName},

Thank you for reaching out to us. We have received your inquiry and appreciate the time you took to contact us. Your questions are important to us and we want to assure you that we are working on providing you with a comprehensive response.

Our team is reviewing your inquiry and we will get back to you as soon as possible. Please expect to hear from us within the next 24 hours with the information you require.

If you have any further questions or concerns in the meantime, please do not hesitate to contact us. We appreciate your patience and look forward to assisting you.

Warmest regards, 

Customer Support Team
${companyName} Inc.
  `
  
  const status = sendEmail(`${companyName}`, SUPPORT_EMAIL, SUPPORT_PASSWORD, inquiry.emailAddress, ` Acknowledgment of your Inquiry`, body, undefined, undefined)
  return status
}

/**
 * @notice This sends an email for successful order to a customer
 * @param order The details of the order
 * @param body The body message of the email to be sent
 * @returns The status of the sent email, whether successful or not
 */
export const sendOrderEmail = (order: IOrder): any => {
    const template: string = `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <title></title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
  
      <style type="text/css">
      @import url('https://fonts.googleapis.com/css?family=Inter');
        html {
          padding: 0px;
          overflow-x: hidden;
          /* border: 2px solid yellow; */
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          font-family: 'Inter';
        }
  
        body {
          /* align-items: center; */
          position: absolute;
          /* border: 2px solid blue; */
          width: 95%;
          height: 95%;
        }
  
        main {
          /* align-items: center; */
          position: relative;
          border: 2px solid blue;
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 95%;
          height: 100%;
          padding: 1% 2.5%;
        }
  
        .logo {
          position: relative;
          border: 2px solid blue;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 95%;
          height: 7%;
          margin-bottom: 20px;
          top: 5%;
        }
  
        .logo img {
          position: relative;
          object-fit: contain;
          /* border: 2px solid blue; */
          width: 7%;
          height: 60%;
        }
  
        .message {
          border: 2px solid blue;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5%;
          top: 10%;
          font-size: 16px;
          line-height: 22px;
        }
  
        #salute {
  
        }
  
        #body {
          border: 2px solid blue;
          position: relative;
          display: flex;
          flex-direction: column;
          top: 15%;
        }
  
      /* This is for mobile */
      @media (min-width: 550px) and (max-width: 1024px) {
        .logo img {
          width: 15%;
        }
      }
  
        /* This is for mobile */
        @media (min-width: 0px) and (max-width: 550px) {
  
          .logo {
            margin-bottom: 0px;
          }
  
          .logo img {
              /* border: 1px solid red; */
              width: 25%;
          }
  
          .brief {
            font-size: 18px;
            flex-direction: column;
          }
  
          .message {
            font-size: 16px;
          }
  
          #body {
            top: 5%;
          }
        }
      </style>
    </head>
  
    <body>
      <main>
        <header class="logo">
          <img 
              src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
              alt="test"
          />
        </header>
        <div class="message">
          <span id="salute">Dear,</span>
          <span id="body">
              Thank you for reaching out to us. We have received your message and our team will respond to you promptly. 
          <br />
          <br />
          Best regards, <br />
          Dr Ritany Customer Care
          </span>
        </div>
      </main>
      <script>
        
      </script>
    </body>
  </html>
    `
  //const total = round((order.productSpec.totalPrice - order.productSpec.totalDiscount + order.productSpec.deliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")

    const body = `
Dear ${order.customerSpec.fullName},

We are pleased to inform you that your payment for your order was processed successfully. Our team is currently reviewing your order so that it can be fulfilled properly.

You can view your order receipt slip at ${domainName}/order/receipt/${order._id}

If you ever have any questions or would like to edit/cancel your order, feel free to reply to this email. We value your feedback immensely.

If you don't recognise this activity, feel free to reply this email.

Warmest regards, 

Customer Support Team
${companyName} Inc.
    `
    
    const status = sendEmail(`${companyName}`, SUPPORT_EMAIL, SUPPORT_PASSWORD, order.customerSpec.email, `Successful Order`, body, undefined, undefined)
    return status
  }

/**
 * @notice This sends an email for successful admin creation
 * @param admin The details of the admin
 * @param body The body message of the email to be sent
 * @returns The status of the sent email, whether successful or not
 */
export const sendAdminCreationEmail = (admin: IAdmin, password: string): any => {
  const template: string = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style type="text/css">
    @import url('https://fonts.googleapis.com/css?family=Inter');
      html {
        padding: 0px;
        overflow-x: hidden;
        /* border: 2px solid yellow; */
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        font-family: 'Inter';
      }

      body {
        /* align-items: center; */
        position: absolute;
        /* border: 2px solid blue; */
        width: 95%;
        height: 95%;
      }

      main {
        /* align-items: center; */
        position: relative;
        border: 2px solid blue;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 95%;
        height: 100%;
        padding: 1% 2.5%;
      }

      .logo {
        position: relative;
        border: 2px solid blue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 95%;
        height: 7%;
        margin-bottom: 20px;
        top: 5%;
      }

      .logo img {
        position: relative;
        object-fit: contain;
        /* border: 2px solid blue; */
        width: 7%;
        height: 60%;
      }

      .message {
        border: 2px solid blue;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 5%;
        top: 10%;
        font-size: 16px;
        line-height: 22px;
      }

      #salute {

      }

      #body {
        border: 2px solid blue;
        position: relative;
        display: flex;
        flex-direction: column;
        top: 15%;
      }

    /* This is for mobile */
    @media (min-width: 550px) and (max-width: 1024px) {
      .logo img {
        width: 15%;
      }
    }

      /* This is for mobile */
      @media (min-width: 0px) and (max-width: 550px) {

        .logo {
          margin-bottom: 0px;
        }

        .logo img {
            /* border: 1px solid red; */
            width: 25%;
        }

        .brief {
          font-size: 18px;
          flex-direction: column;
        }

        .message {
          font-size: 16px;
        }

        #body {
          top: 5%;
        }
      }
    </style>
  </head>

  <body>
    <main>
      <header class="logo">
        <img 
            src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
            alt="test"
        />
      </header>
      <div class="message">
        <span id="salute">Dear,</span>
        <span id="body">
            Thank you for reaching out to us. We have received your message and our team will respond to you promptly. 
        <br />
        <br />
        Best regards, <br />
        Dr Ritany Customer Care
        </span>
      </div>
    </main>
    <script>
      
    </script>
  </body>
</html>
  `
//const total = round((order.productSpec.totalPrice - order.productSpec.totalDiscount + order.productSpec.deliveryFee) * clientInfo.country.currency.exchangeRate, 1).toLocaleString("en-US")

  const body = `
Dear ${admin.fullName},

We are pleased to inform you that your admin account has been created successfully.

Visit ${domainName}/admin/login to log in to your account
Your login details are;
Email: ${admin.emailAddress}
Password: ${password}

Keep your credentials a secret and don't share it with anyone, welcome on board.

If you ever have any questions, feel free to reply to this email.

If you don't recognise this activity, feel free to reply this email.

Warmest regards, 

Customer Support Team
${companyName} Inc.
  `
  
  const status = sendEmail(`${companyName}`, SUPPORT_EMAIL, SUPPORT_PASSWORD, admin.emailAddress!, `Admin Successfully Created`, body, undefined, undefined)
  return status
}


