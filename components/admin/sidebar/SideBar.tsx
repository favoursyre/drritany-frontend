"use client"
///Side Bar component

///Libraries -->
import styles from "./sideBar.module.scss"
import Image from 'next/image';
import { adminName, logo, routeStyle } from "@/config/utils"
import { getItem, notify } from "@/config/clientUtils";
import { useEffect, useState, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SpaceDashboardOutlined, Inventory, AccountCircleOutlined, GroupsOutlined, ListAltOutlined, NotificationsOutlined, LogoutOutlined, SettingsOutlined, Label } from "@mui/icons-material";
import { useAdminSideBarStore } from "@/config/store";
import { IAdmin } from "@/config/interfaces";

///Commencing the code 
  
/**
 * @title Side Bar Component
 * @returns The Side Bar component
 */
const AdminSideBar = () => {
    const routerPath = usePathname()
    const router = useRouter()
    const [adminUser, setAdminUser] = useState<IAdmin | null>(getItem(adminName))
    const [linkId, setLinkId] = useState<number>(0)
    const adminSideBar = useAdminSideBarStore(state => state.status);

    //This function is triggered when a side bar button is clicked
    const clickButton = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, label: string) => {
        e.preventDefault()

        if (label === "inventory") {
            router.push(`/admin/${adminUser?._id}/products`)
        } else {
            notify("info", "Still under construction")
        }
    }

    return (
        <main className={`${styles.main} ${adminSideBar ? styles.activeBar : ""} ${routeStyle(routerPath, styles)}`}>
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
                <button className={linkId === 0 ? styles.activeBtn : ""}><SpaceDashboardOutlined className={styles.icon} /></button>
                <button><NotificationsOutlined className={styles.icon} /></button>
                <button onClick={(e) => clickButton(e, "inventory")}>
                    <Inventory className={styles.icon} />
                </button>
                <button><ListAltOutlined className={styles.icon} /></button>
                <button><GroupsOutlined className={styles.icon} /></button>
                {/* <button><AccountCircleOutlined className={styles.icon} /></button>
                <button><SettingsOutlined className={styles.icon} /></button>
                <button><LogoutOutlined className={styles.icon} /></button> */}
            </div>
        </main>
    );
};
  
export default AdminSideBar;