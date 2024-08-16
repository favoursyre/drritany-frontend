"use client"
///Admin Header component

///Libraries -->
import styles from "./header.module.scss"
import Image from 'next/image';
import { companyName, extractMainPageTitle, routeStyle } from "@/config/utils"
import { useEffect, useState, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { MenuOutlined, AccountCircleOutlined } from "@mui/icons-material";
import { IAdmin } from "@/config/interfaces";
import { useAdminSideBarStore } from "@/config/store";

///Commencing the code 

/**
 * @title Admin Header Component
 * @returns The Admin Header component
 */
const AdminHeader = () => {
    const routerPath = usePathname()
    const [linkId, setLinkId] = useState<number>(0)
    const [admin, setAdmin] = useState<IAdmin>()
    const [profileOption, setProfileOption] = useState<boolean>(false)
    const setAdminSideBar = useAdminSideBarStore(state => state.setAdminSideBar);
    const adminSideBar = useAdminSideBarStore(state => state.status);
    const [title, setTitle] = useState<string>("")

    useEffect(() => {
        setTitle(() => extractMainPageTitle(document.title))
    }, [])

    ///This function is triggered when menu button is clicked
    const viewMenu = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        setAdminSideBar(!adminSideBar)
    }

    return (
        <main className={`${styles.header} ${adminSideBar ? styles.activeBar : ""} ${routeStyle(routerPath, styles)}`}>
                <div className={styles.menu_title}>
                    <button className={`${styles.menu} ${adminSideBar ? styles.activeMenu : ""}`} onClick={(e) => viewMenu(e)}>
                        <MenuOutlined className={styles.icon} />
                    </button>
                    <span className={styles.title}>{title}</span>
                </div>
                <div className={styles.profileSection}>
                    <button className={styles.profile}>
                        {admin ? (
                            <Image
                                className={styles.img}
                                src={admin.image.src}
                                alt=""
                                width={admin.image.width}
                                height={admin.image.height}
                            />
                        ) : (
                            <AccountCircleOutlined className={styles.icon} />
                        )}
                        <span className={`${profileOption ? styles.activeArrow : styles.inactiveArrow}`}>{">"}</span>
                    </button>
                    <div className={styles.profileOptions}></div>
                </div>
            </main>
    );
};
  
export default AdminHeader;