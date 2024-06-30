"use client"
///Footer component

///Libraries -->
import { notify, visitSocialLink } from '@/config/clientUtils';
import styles from "./footer.module.scss"
import { routeStyle, domainName, GoogleSheetDB, orderSheetId, companyEmail, companyName } from '@/config/utils'
import { IContact, INews, IOrderSheet } from "@/config/interfaces";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent, MouseEvent } from "react";
import validator from "validator";
import Image from 'next/image';
import tiktok from "../../public/images/tiktok.svg"
import { LinkedIn, X, WhatsApp, Instagram, Facebook, MailOutline } from '@mui/icons-material';
import Loading from '../loadingCircle/Circle';

///Commencing the code 
  
/**
 * @title Footer Component
 * @returns The Footer component
 */
const Footer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const routerPath = usePathname();
    const [email, setEmail] = useState<string>("")
    const router = useRouter()

      useEffect(() => {
        const interval = setInterval(() => {
          }, 100);
      
          return () => {
            clearInterval(interval);
          };
        
      }, [email]);

      //Tiktok icon
      const TikTokIcon = ({ color = "#78989" }) => {
        return (
          <svg
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="100%"
            height="100%"
          >
            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
          </svg>
        );
      };

      ///This function adds a new subscriber
      const subNewsLetter = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        console.log("sending newsletter")
        //notify("success", "Your subscription was successful")

        ///Validating the args
        if (!email) {
            notify("error", "Email Address is required")
            return
        } else if (!validator.isEmail(email)) {
            notify("error", "Email Address is not valid")
            return
        }

        setIsLoading(() => true)
        
        try {
            const subscriber = email
            const newsletter: INews = { subscriber }
            //console.log("Email: ", subscriber)
            const res = await fetch(`${domainName}/api/news/`, {
                method: 'POST',
                body: JSON.stringify(newsletter),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await res.json();
        
            console.log("Data: ", data);
            if (res.ok) {
                notify("success", "Your subscription was successful")
            } else {
                //console.log("error front: ", data)
                throw new Error(`${data.message}`)
            }
        } catch (error: any) {
            console.log("error front1: ", error)
            notify("error", `${error.message}`)
        }

        setIsLoading(() => false)
      }

    return (
        <>
        <footer className={`${styles.footer} ${routeStyle(routerPath, styles)}`} id="contacts">
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1G9YYqLAIMY7SIq0cZ6o_kyR6IkrmTCNO"}
                alt=""
                width={1440}
                height={1462}
            />
           <div className={styles.upper_footer}>
                <div className={styles.contact_section}>
                    <div className={styles.logo}>
                        <Image
                            className={styles.img}
                            src="https://drive.google.com/uc?export=download&id=1V-QyvBujfHsM0fIimUT3PL2DwjZCWJXG"
                            alt=""
                            width={2500}
                            height={2500}
                        />
                        <span>{companyName}</span>
                    </div>
                    <span className={styles.brief}>
                        We are committed to providing high-quality, effective products that support your well-being and everyday routine.
                    </span>
                    <div className={styles.socials}>
                        <span className={styles.text}>Connect with us at</span>
                        <div className={styles.social_medias}>
                            <MailOutline className={styles.mail} onClick={(e) => visitSocialLink(e, "mail")} />
                            <Facebook className={styles.facebook} onClick={(e) => visitSocialLink(e, "facebook")} />
                            <Instagram className={styles.instagram} onClick={(e) => visitSocialLink(e, "instagram")} />
                            <WhatsApp className={styles.whatsapp} onClick={(e) => visitSocialLink(e, "whatsapp")} />
                            <X className={styles.x} onClick={(e) => visitSocialLink(e, "x")} />
                            {/* <Image 
                                className={styles.tiktok}
                                src={tiktok}
                                alt=''
                                width={32}
                                height={32}
                            /> */}
                            {/* <TikTokIcon className={styles.tiktok} onClick={(e) => visitSocialLink(e, "x")} /> */}
                            {/* <LinkedIn className={styles.linkedin} onClick={(e) => visitSocialLink(e, "linkedin")} /> */}
                            {/* <button className={styles.whatsapp}>
                                
                            </button> */}
                        </div>
                    </div>
                </div>
                <hr className={styles.slash} />
                <div className={styles.newsletter_section}>
                    <div className={styles.texts}>
                        <span className={styles.text1}>Newsletter</span>
                        <span className={styles.text2}>Be the first to know about discounts, new products and special offers. 
                        Join our community today and take the first step towards a happier you!</span>
                    </div>
                    <form className={styles.news_form} onSubmit={(e) => subNewsLetter(e)}>
                        <MailOutline className={styles.mailIcon}/>
                        <input 
                            type="email" 
                            placeholder="example@mail.com" 
                            onChange={(e) => setEmail(() => e.target.value)}
                            value={email}
                        />
                        <button>
                            {isLoading ? (
                                <Loading width='20px' height='20px' />
                            ) : (
                                <span>Submit</span>
                            )}
                        </button>
                    </form>
                </div>
           </div>
           <hr className={styles.footer_slash}/>
           <div className={styles.lower_footer}>
            <div className={styles.footer_menu}>
                <button onClick={() => router.push('/about')}><span>About Us</span></button>
                <button onClick={() => router.push('/#products')}><span>Products</span></button>
                <button onClick={() => router.push('/faqs')}><span>FAQs</span></button>
                <button onClick={() => router.push('/terms')}><span>Terms of Use</span></button>
            </div>
            {/* <span className={styles.address}>541 Montgomery Street, San Francisco, CA 94111, United States.</span> */}
            <span className={styles.copyright}>Copyright &copy; {new Date().getFullYear()} {companyName} Inc., All rights reserved</span>
           </div>
        </footer>
        {/* <footer className={`${styles.mobile_footer} ${routeStyle(routerPath, styles)}`} id="contacts">
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1G9YYqLAIMY7SIq0cZ6o_kyR6IkrmTCNO"}
                alt=""
                width={1440}
                height={1462}
            />
            <div className={styles.newsletter_section}>
                <h3><strong>Newsletter</strong></h3>
                <span className={styles.text2}>Be the first to know about discounts, new products and special offers. 
                    Join our community today and take the first step towards a healthier, happier you!</span>
                <form className={styles.news_form} onSubmit={(e) => subNewsLetter(e)}>
                    <input  
                        type="email" 
                        placeholder="example@mail.com" 
                        onChange={(e) => setEmail(() => e.target.value)}
                        value={email}
                    />
                    <MailOutlineIcon className={styles.mailIcon}/>
                    <button>
                        {isLoading ? (
                            <Loading width='10px' height='10px' />
                        ) : (
                            <span>Submit</span>
                        )}
                    </button>
                </form>
            </div>
            <div className={styles.contact_section}>
                <div className={styles.whatsapp_social}>
                    <button>
                        <img
                            src="https://drive.google.com/uc?export=download&id=19bUJMJNtW8KywhjRaVRQZVxFtJFPjVQ8"
                            alt=""
                        />
                    </button>
                    <div className={styles.texts}>
                        <span className={styles.text1}>Have a question?</span>
                        <span className={styles.text2}>+234-9090982848</span>
                    </div>
                </div>
                <div className={styles.email_social}>
                    <button>
                        <Image
                            src="https://drive.google.com/uc?export=download&id=1xBD5VMMs720V9OkNwxYaStgXqez975Rj"
                            alt=""
                            width={48}
                            height={49}
                        />
                    </button>
                    <div className={styles.texts}>
                        <span className={styles.text1}>Contact us at</span>
                        <span className={styles.text2}>{companyEmail}</span>
                    </div>
                </div>
            </div>
            <div className={styles.lower_footer}>
                <div className={styles.footer_menu}>
                    <button onClick={() => router.push('/about')}><span>About Us</span></button>
                    <button onClick={() => router.push('/#products')}><span>Products</span></button>
                    <button onClick={() => router.push('/about/#faqs')}><span>FAQ</span></button>
                    <button onClick={() => router.push('/terms')}><span>Terms of Use</span></button>
                </div>
                <span className={styles.address}>541 Montgomery Street, San Francisco, CA 94111, United States.</span>
            <span className={styles.copyright}>Copyright &copy; {new Date().getFullYear()} Dr Ritany Inc., All rights reserved</span>
           </div>
        </footer> */}
        </>
    );
};
  
export default Footer;