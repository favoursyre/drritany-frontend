"use client"
///Admin base component

///Libraries -->
import { useRouter } from "next/navigation";
//import styles from "./login.module.scss"
import { getItem } from "@/config/clientUtils";
import Image from 'next/image';
import { adminName, companyName } from "@/config/utils"
import { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';
import validator from "validator"
import SecurityIcon from '@mui/icons-material/Security';
import { IAdmin } from "@/config/interfaces";
//import Loading from "../loadingCircle/Circle";

///Commencing the code 
  
/**
 * @title About Component
 * @returns The About component
 */
const AdminBase = () => {
    const router = useRouter()
    const [admin, setAdmin] = useState<IAdmin | undefined>(getItem(adminName))
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    useEffect(() => {
        if (admin) {
            router.push("")
        } else {
            router.push("/admin/login")
        }
    })

    return (
        <></>
    );
};
  
export default AdminBase;