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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
                        {/* <div className={styles.whatsapp_social}>
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
                        </div> */}
                        <div className={styles.email_social}>
                            <button type="button" onClick={() => router.push(`mailto:${companyEmail}`)}>
                                <MailOutlineIcon className={styles.icon} />
                            </button>
                            <div className={styles.texts}>
                                <span className={styles.text1}>Contact us at</span>
                                <span className={styles.text2}><a href={`mailto:${companyEmail}`}>{companyEmail}</a></span>
                            </div>
                        </div>
                        <div className={styles.social_medias}>
                            <FacebookIcon className={styles.facebook} onClick={(e) => visitSocialLink(e, "facebook")}/>
                            <InstagramIcon className={styles.instagram} onClick={(e) => visitSocialLink(e, "instagram")} />
                            <WhatsAppIcon className={styles.whatsapp} onClick={(e) => visitSocialLink(e, "whatsapp")} />
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
                        <MailOutlineIcon className={styles.mailIcon}/>
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
                <button onClick={() => router.push('/about/#faqs')}><span>FAQ</span></button>
                <button onClick={() => router.push('/terms')}><span>Terms of Use</span></button>
            </div>
            <span className={styles.address}>541 Montgomery Street, San Francisco, CA 94111, United States.</span>
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