"use client"
///Admin Login component

///Libraries -->
import styles from "./login.module.scss"
import Image from 'next/image';
import { getItem, notify, setItem } from "@/config/clientUtils";
import { adminName, logo,  backend } from "@/config/utils"
import { MouseEvent, useEffect, useState } from "react";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IAdmin } from "@/config/interfaces"
import Loading from "@/components/loadingCircle/Circle";
import validator from "validator";
import { useRouter } from "next/navigation";

///Commencing the code 
  
/**
 * @title Admin login Component
 * @returns The Admin login component
 */
const AdminLogin = () => {
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [admin, setAdmin] = useState<IAdmin | undefined>(getItem(adminName))
    const [isLoading, setIsLoading] = useState<boolean>()
    const router = useRouter()

    useEffect(() => {
        if (admin) {
            notify("info", "Redirecting you to your account")
            router.push(`/admin/${admin._id}/products`)
        }
    })

    ///This function is trigerred when the remember me box is checked
    const checkRememberMe = () => {
        setRememberMe(!rememberMe);
      };

    //This function executes when login form is submitted
    const handleLogin = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();

        console.log("logging in")

        ///Validating the required args
        if (!emailAddress) {
            notify("error", "Email address is required")
            return
        } else if (!validator.isEmail(emailAddress)) {
            notify("error", "Email address is not valid")
            return
        } else if (!password) {
            notify("error", "Password is required")
            return
        }

        setIsLoading(() => true)
        //setLoginModal(() => !loginModal)
        //Send the account to the backend
        try {
            const admin_ = { emailAddress, password }
            //console.log("Account client: ", account)
            const res = await fetch(`${backend}/admin?action=login`, 
            {
                method: 'POST',
                body: JSON.stringify(admin_),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );

            console.log("Res: ", res.ok)
            const data = await res.json();
            if (res.ok) {
                notify("success", `${data.message}`)
                console.log('Data: ', data.admin)
                //window.location.reload()
                //const id = data.account[0]._id
                // if (rememberMe) {
                //     console.log("Admin: ", data.admin)
                //     setItem(adminName, data.admin) 
                // }

                console.log("Admin: ", data.admin)
                setItem(adminName, data.admin[0]) 

                router.push(`/admin/${data.admin[0]._id}/products`)
                notify("info", "Redirecting to your dashboard")
                //setLoginModal(() => false)
                //setLoginLoading(() => false)
                //removeItem(requestTimeKey)
            } else {
                throw new Error(`${data.message}`)
            }
            
        } catch (error: any) {
            console.log("Error: ", error)
            notify("error", `${error.message}`)
            //setLoginLoading(() => false)
           // setLoginModal(() => false)
        } 
        setIsLoading(false)
    };

    return (
        <main className={`${styles.main}`}>
            <div className={styles.gradientOverlay}></div>
            <Image 
                className={styles.background}
                src={"https://drive.google.com/uc?export=download&id=1uy_xi_k3Nq1FLkSGP1FF9zr3P6cPf7xu"}
                alt=""
                width={1224}
                height={816}
            />
            <div className={styles.logo}>
                <Image
                    className={styles.img}
                    src={logo.src}
                    alt={logo.alt!}
                    width={logo.width}
                    height={logo.height}
                />
            </div>
            <div className={styles.container}>
                <h2><strong>Admin Panel</strong></h2>
                <span>
                    Log in to continue
                </span>
                <form>
                    <div className={styles.emailId}>
                        <EmailIcon className={styles.emailIcon} />
                        <input
                            placeholder="Email ID"
                            type="email"
                            onChange={(e) => setEmailAddress(e.target.value)}
                            value={emailAddress}
                        />
                    </div>
                    <div className={styles.password}>
                        <LockIcon className={styles.lockIcon} />
                        <input
                            placeholder="Password"
                            type={visible ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        {visible ? (
                            <VisibilityIcon className={styles.visibleIcon} onClick={() => setVisible(!visible)} />
                        ) : (
                            <VisibilityOffIcon className={styles.visibleIcon} onClick={() => setVisible(!visible)} />
                        )}
                    </div>
                    <div className={styles.remember}>
                        <input 
                            type="checkbox" 
                            id="myCheckbox" 
                            checked={rememberMe}
                            onChange={checkRememberMe}
                        />
                        <label htmlFor="myCheckbox">Remember me</label>
                    </div>
                    <button onClick={(e) => handleLogin(e)}>
                        {isLoading ? (
                            <Loading width="20px" height="20px" />
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                </form>
                {/* <div className={styles.brief}>
                    <button className={styles.brief1} onClick={(e) => loginPageModal(e, true, "reset")}>Forgot password?</button>
                    <div className={styles.brief2}>
                        <span>Don&apos;t have an account?</span>
                        <button onClick={() => router.push(`/register/${id}`)}>Register</button>
                    </div>
                    <div className={styles.brief3}>
                        <button  onClick={(e) => checkAndSaveTime(e)}>{requestCountdown === 0 ? `Didn't get an email verification link?` : `Request a verification link in ${requestCountdown}secs`}</button>
                    </div>
                    
                </div> */}
            </div>
        </main>
    );
};
  
export default AdminLogin;