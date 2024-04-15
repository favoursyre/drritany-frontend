"use client"
///Contact Modal component

///Libraries -->
import styles from "./contactModal.module.scss"
import { useModalBackgroundStore, useContactModalStore } from "@/config/store";
import { MouseEvent, useState, FormEvent } from "react";
import Loading from "../loadingCircle/Circle";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { capitalizeFirstLetter, domainName } from "@/config/utils";
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
    const [firstName, setFirstName] = useState<string | undefined>("") 
    const [lastName, setLastName] = useState<string | undefined>("")
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
  const sendInquiry = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    //Validating args
    if (!firstName) {
      notify("error", "First Name is required")
      return
    } else if (!lastName) {
        notify("error", "Last Name is required")
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
      const inquiry: IInquiry = { firstName, lastName, emailAddress, message }
      console.log("Order: ", inquiry)
      const res = await fetch(`${domainName}/api/inquiry/`, {
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
              src="https://drive.google.com/uc?export=download&id=1m-bSqxTBl6C_XoPtRb6RfijDqXY-nKev"
              alt=""
              width={209}
              height={538}
            />
          </div>
          <div className={styles.form}>
            <header>
              <button onClick={(e) => closeModal(e)}>
                <CloseIcon />
              </button>
            </header>
            <div className={styles.brief}>
              <span id={styles.brief_1}>
                <strong>We&apos;d love to help</strong>
              </span>
              <span id={styles.brief_2}>Reach out and we&apos;ll get in touch within 24 hours</span>
            </div>
            <form onSubmit={(e) => sendInquiry(e)}>
              <div className={styles.div_1}>
                <div className={styles.div_11}>
                  <input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setFirstName(() => capitalizeFirstLetter(e.target.value))}
                    value={firstName}
                  />
                </div>
                <div className={styles.div_12}>
                  <input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setLastName(() => capitalizeFirstLetter(e.target.value))}
                    value={lastName}
                  />
                </div>
              </div>
              <div className={styles.div_2}>
                <input
                  placeholder="Email Address"
                  type="email"
                  onChange={(e) => setEmailAddress(() => e.target.value)}
                  value={emailAddress}
                />
              </div>
              <div className={styles.div_3}>
                <textarea
                  placeholder="Message"
                  onChange={(e) => setMessage(() => e.target.value)}
                  value={message}
                ></textarea>
              </div>
              <button>
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