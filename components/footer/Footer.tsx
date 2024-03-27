"use client"
///Footer component

///Libraries -->
import { notify } from '@/config/clientUtils';
import styles from "./footer.module.scss"
import { routeStyle, backend } from '@/config/utils'
import { IContact, INews } from "@/config/interfaces";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from "react";
import validator from "validator";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

///Commencing the code 
  
/**
 * @title Footer Component
 * @returns The Footer component
 */
const Footer = ({ contact_ }: { contact_: IContact }) => {
    const [contact, setContact] = useState(contact_)
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
        
        try {
            const subscriber = email
            const newsletter: INews = { subscriber }
            //console.log("Email: ", subscriber)
            const res = await fetch(`${backend}/newsletter-subsriber/add/`, {
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
                throw Error(`${data}`)
            }
        } catch (error) {
            console.log("error: ", error)
            notify("error", `${error}`)
        }
      }

    return (
        <>
        <footer className={`${styles.footer} ${routeStyle(routerPath, styles)}`} id="contacts">
           <ToastContainer />
           <div className={styles.upper_footer}>
                <div className={styles.contact_section}>
                    <div className={styles.logo}>
                        <img
                            src="https://drive.google.com/uc?export=download&id=1RbUo9BSAyxfNmzVV_dzjC7E4nT9ZtbnV"
                            alt=""
                        />
                    </div>
                    <span className={styles.brief}>
                        We are committed to providing high-quality, effective products that support your health and well-being.
                    </span>
                    <div className={styles.socials}>
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
                                <img
                                    src="https://drive.google.com/uc?export=download&id=1xBD5VMMs720V9OkNwxYaStgXqez975Rj"
                                    alt=""
                                />
                            </button>
                            <div className={styles.texts}>
                                <span className={styles.text1}>Contact us at</span>
                                <span className={styles.text2}>official.drritany@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={styles.slash} />
                <div className={styles.newsletter_section}>
                    <div className={styles.texts}>
                        <span className={styles.text1}>Newsletter</span>
                        <span className={styles.text2}>Be the first to know about discounts, new products and special offers. 
                        Join our community today and take the first step towards a healthier, happier you!</span>
                    </div>
                    <form className={styles.news_form} onSubmit={(e) => subNewsLetter(e)}>
                        <img 
                            className={styles.mailIcon}
                            src="https://drive.google.com/uc?export=download&id=1yadiQBni0UpA4tBxLeKYxDv4rtiIiWxR"
                            alt=""
                        />
                        <input 
                            type="email" 
                            placeholder="example@mail.com" 
                            onChange={(e) => setEmail(() => e.target.value)}
                            value={email}
                        />
                        <button>
                            Submit
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
            <span className={styles.copyright}>Copyright &copy; {new Date().getFullYear()} Dr Ritany Inc., All rights reserved</span>
           </div>
        </footer>
        <footer className={`${styles.mobile_footer} ${routeStyle(routerPath, styles)}`} id="contacts">
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
                    <img
                        src="https://drive.google.com/uc?export=download&id=1yadiQBni0UpA4tBxLeKYxDv4rtiIiWxR"
                        alt=""
                    />
                    <button>
                        Submit
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
                        <img
                            src="https://drive.google.com/uc?export=download&id=1xBD5VMMs720V9OkNwxYaStgXqez975Rj"
                            alt=""
                        />
                    </button>
                    <div className={styles.texts}>
                        <span className={styles.text1}>Contact us at</span>
                        <span className={styles.text2}>official.drritany@gmail.com</span>
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
            <span className={styles.copyright}>Copyright &copy; {new Date().getFullYear()} Dr Ritany Inc., All rights reserved</span>
           </div>
        </footer>
        </>
    );
};
  
export default Footer;