"use client"
///Layout component

///Libraries -->
import styles from "./layout.module.scss"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Image from "next/image";
import AdminSideBar from "@/components/admin/sidebar/SideBar"
import AdminHeader from "../header/Header";
import { getItem, notify } from "@/config/clientUtils";
import { IAdmin } from "@/config/interfaces";
import { adminName } from "@/config/utils";

///Commencing the code 
/**
 * @title Layout Component
 * @returns The Layout component
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [admin, setAdmin] = useState<IAdmin | null>(getItem(adminName))

    useEffect(() => {
        //getClientInfo(clientInfo, setClientInfo)
        //console.log('OS: ', navigator)
        if (!admin) {
          notify("info", "User not detected, redirecting you to login")
          router.push(`/admin/login`)
        }
        //console.log("Test: ", test)
    });
    
  return (
    <main className={styles.main}>
      <AdminHeader />
      <AdminSideBar />
      <Image 
            className={styles.background}
            src={"https://drive.google.com/uc?export=download&id=1G9YYqLAIMY7SIq0cZ6o_kyR6IkrmTCNO"}
            alt=""
            width={1440}
            height={1462}
        />
      <div className={styles.body}>{children}</div>
    </main>
  );
};

export default AdminLayout;