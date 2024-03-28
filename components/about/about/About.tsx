"use client"
///About component

///Libraries -->
import styles from "./about.module.scss"
import Image from 'next/image';

///Commencing the code 
  
/**
 * @title About Component
 * @returns The About component
 */
const About = () => {

    return (
        <main className={`${styles.main}`}>
            <div className={styles.image}>
                <Image 
                    className={styles.img}
                    src="https://drive.google.com/uc?export=download&id=1F0YJtpb6r1Fsh31sOEw1JSLaRC23KHkF"
                    alt=""
                    width={674}
                    height={505}
                />
            </div>
            <h2><strong>About Us</strong></h2>
            <span>
                Welcome to Dr Ritany, where we believe that feeling your best starts from the inside out. We are a team of health and wellness enthusiasts who are passionate about helping people achieve optimal health through natural and effective products.
            </span>
        </main>
    );
};
  
export default About;