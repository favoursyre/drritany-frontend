"use client"
///Footer component

///Libraries -->
import { getDevice, getItem, notify, visitSocialLink, getOS, setItem } from '@/config/clientUtils';
import styles from "./footer.module.scss"
import { routeStyle, backend, companyName, logo, getCurrentDate, getCurrentTime, extractBaseTitle, storeButtonInfo, userIdName, productFilterName, clientInfoName } from '@/config/utils'
import { IClientInfo, INews, IProductFilter, IButtonResearch } from "@/config/interfaces";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent, MouseEvent } from "react";
import validator from "validator";
import { useClientInfoStore } from '@/config/store';
import Image from 'next/image';
import tiktok from "../../public/images/tiktok.svg"
import { useModalBackgroundStore, useLoadingModalStore } from '@/config/store';
import { LinkedIn, X, WhatsApp, Instagram, Facebook, MailOutline, Place, Business } from '@mui/icons-material';
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
    //const clientInfo = useClientInfoStore(state => state.info)
    const _clientInfo = getItem(clientInfoName)
    const [clientInfo, setClientInfo] = useState<IClientInfo | undefined>(_clientInfo!)
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const setLoadingModal = useLoadingModalStore(state => state.setLoadingModal);

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

      ///This function is trigerred when a link in the footer is clicked
      const viewFooterNav = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nav: string) => {
        e.preventDefault()

        //Setting loading modal
        setModalBackground(true)
        setLoadingModal(true)

        //Storing this info in button research
        const info: IButtonResearch = {
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
            Button_Name: "viewFooterNav()",
            Button_Info: `Clicked ${nav} in footer`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }

        storeButtonInfo(info)

        if (nav === "products") {

            const filterSettings: IProductFilter = {
                filterId: 0,
                category: "All"
            }
            setItem(productFilterName, filterSettings)
        }

        router.push(`/${nav}`)
      }

      //This function is trigerred when a social link is clicked
      const _visitSocialLink = async (e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>, social: string) => {
        e.preventDefault()

        //Setting on loading modal
        setModalBackground(true)
        setLoadingModal(true)

        //Arranging button research info
        const info: IButtonResearch = {
            ID: clientInfo?._id!,
            IP: clientInfo?.ipData?.ip!,
            City: clientInfo?.ipData?.city!,
            Region: clientInfo?.ipData?.region!,
            Country: clientInfo?.ipData?.country!,
            Button_Name: "visitSocialLink()",
            Button_Info: `Clicked ${social} in footer`,
            Page_Title: extractBaseTitle(document.title),
            Page_URL: routerPath,
            Date: getCurrentDate(),
            Time: getCurrentTime(),
            OS: getOS(),
            Device: getDevice()
        }

        await visitSocialLink(social, info)

        //Setting off loading modal
        setModalBackground(false)
        setLoadingModal(false)
      }

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

        setModalBackground(true)
        setLoadingModal(true)
        
        try {
            const subscriber = email
            const newsletter: INews = { subscriber }
            console.log("Sending email: ", subscriber)
            const res = await fetch(`${backend}/news/`, {
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

        setModalBackground(false)
        setLoadingModal(false)
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
                            src={logo.src}
                            alt={logo.alt!}
                            width={logo.width}
                            height={logo.height}
                        />
                        <span>{companyName}</span>
                    </div>
                    <span className={styles.brief}>
                        We are committed to providing high-quality, effective products that support your well-being and everyday routine.
                    </span>
                    <div className={styles.socials}>
                        <span className={styles.text}>Connect with us at</span>
                        <div className={styles.social_medias}>
                            <MailOutline className={styles.mail} onClick={(e) => _visitSocialLink(e, "mail")} />
                            <Facebook className={styles.facebook} onClick={(e) => _visitSocialLink(e, "facebook")} />
                            <Instagram className={styles.instagram} onClick={(e) => _visitSocialLink(e, "instagram")} />
                            {/* <WhatsApp className={styles.whatsapp} onClick={(e) => _visitSocialLink(e, "whatsapp")} /> */}
                            <X className={styles.x} onClick={(e) => _visitSocialLink(e, "x")} />
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
                    <div className={styles.addr}>
                        <Business className={styles.icon} />
                        <span>1111B S Governors Ave, STE 28549, Dover, Delaware. 19904.</span>
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
                            <span>Submit</span>
                        </button>
                    </form>
                </div>
           </div>
           <hr className={styles.footer_slash}/>
           <div className={styles.lower_footer}>
            <div className={styles.footer_menu}>
                <button onClick={(e) => viewFooterNav(e, "about")}><span>About Us</span></button>
                <button onClick={(e) => viewFooterNav(e, "products")}><span>Products</span></button>
                <button onClick={(e) => viewFooterNav(e, "faqs")}><span>FAQs</span></button>
                <button onClick={(e) => viewFooterNav(e, "terms")}><span>Terms of Use</span></button>
            </div>
            {/* <span className={styles.address}>541 Montgomery Street, San Francisco, CA 94111, United States.</span> */}
            <span className={styles.copyright}>Copyright &copy; {new Date().getFullYear()} {companyName} Inc., All rights reserved</span>
           </div>
        </footer>
        </>
    );
};
  
export default Footer;