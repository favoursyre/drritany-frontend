"use client"
///Contact Modal component

///Libraries -->
import styles from "./contactModal.module.scss"
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent } from "react";
import Loading from "@/components/loadingCircle/Circle";
import { Place, Close, Business } from "@mui/icons-material";
import Image from "next/image";
import { capitalizeFirstLetter, backend } from "@/config/utils";
import { notify } from "@/config/clientUtils";
import validator from "validator";
import { IInquiry } from "@/config/interfaces";

///Commencing the code 

/**
 * @title Contact Modal Component
 * @returns The Contact Modal component
 */
const ContactModal = () => {
    const setContactModal = useContactModalStore(state => state.setContactModal);
    const setModalBackground = useModalBackgroundStore(state => state.setModalBackground);
    const contactModal = useContactModalStore(state => state.modal);
    const [fullName, setFullName] = useState<string | undefined>("") 
    const [subject, setSubject] = useState<string | undefined>("")
    const [emailAddress, setEmailAddress] = useState<string | undefined>("")
    const [message, setMessage] = useState<string | undefined>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | FormEvent<HTMLFormElement>): void => {
        e.preventDefault()

        setContactModal(false)
        setModalBackground(false)
        //console.log("modal closed")
    }

    ///This sends the message from contact-us
  const sendInquiry = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): Promise<void> => {
    e.preventDefault()

    //Validating args
    if (!fullName) {
      notify("error", "Name is required")
      return
    } else if (!subject) {
        notify("error", "Subject is required")
        return
    } else if (!emailAddress) {
        notify("error", "Email address is required")
        return
    } else if (!validator.isEmail(emailAddress)) {
        notify("error", "Email address is not valid")
        return
    } else if (!message) {
        notify("error", "Message is required")
        return
    }

    setIsLoading(() => true)

    //Send the order to the backend
    try {
      //console.log('Clicked')
      const inquiry: IInquiry = { fullName, emailAddress, subject, message }
      console.log("Order: ", inquiry)
      const res = await fetch(`${backend}/inquiry/`, {
          method: 'POST',
          body: JSON.stringify(inquiry),
          headers: {
          'Content-Type': 'application/json',
          },
      });
      
      const data = await res.json();
      console.log("Data: ", data);

      if (res.ok) {
        notify("success", `Your message was sent successfully`)
        closeModal(e)
        typeof window !== 'undefined' && window.location ? window.location.reload() : null
      } else {
        throw Error(`${data.message}`)
      }
    
    } catch (error: any) {
        console.log("error: ", error)
        notify("error", `${error.message}`)
    }

    setIsLoading(() => false)
  }

  return (
    <div className={styles.main} style={{ display: contactModal ? "flex" : "none"}}>
          <div className={styles.image}>
            <Image
              className={styles.img}
              src="https://drive.google.com/uc?export=download&id=1wPg8X3MF-Kymuu5g5pNe6FRcMZp9ie61"
              alt=""
              width={2048}
              height={1341}
            />
            <div className={styles.addr}>
                <Business className={styles.icon} />
                <span>1111B S Governors Ave, STE 28549, Dover, Delaware. 19904</span>
            </div>
          </div>
          <div className={styles.form}>
            <header>
              <button onClick={(e) => closeModal(e)}>
                <Close />
              </button>
            </header>
            <div className={styles.brief}>
              <span id={styles.brief_1}>
                <strong>We&apos;d love to help</strong>
              </span>
              <span id={styles.brief_2}>Reach out and we&apos;ll get in touch within 24 hours</span>
            </div>
            <form>
              <div className={styles.div_1}>
                <div className={styles.div_11}>
                  <input
                    placeholder="Name"
                    type="text"
                    onChange={(e) => setFullName(() => capitalizeFirstLetter(e.target.value))}
                    value={fullName}
                  />
                </div>
                <div className={styles.div_12}>
                  <input
                    placeholder="Email Address"
                    type="email"
                    onChange={(e) => setEmailAddress(() => e.target.value)}
                    value={emailAddress}
                  />
                </div>
              </div>
              <div className={styles.div_2}>
                <input
                  placeholder="Subject"
                  type="text"
                  onChange={(e) => setSubject(() => capitalizeFirstLetter(e.target.value))}
                  value={subject}
                />
              </div>
              <div className={styles.div_3}>
                <textarea
                  placeholder="Message"
                  onChange={(e) => setMessage(() => e.target.value)}
                  value={message}
                ></textarea>
              </div>
              <button onClick={(e) => sendInquiry(e)}>
                {isLoading ? (
                  <Loading width="20px" height="20px" />
                ) : (
                  <span>SEND</span>
                )}
              </button>
            </form>
          </div>
        </div>
  );
};

export default ContactModal;