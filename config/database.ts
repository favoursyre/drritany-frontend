//This acts as a database for the web app

///Libraries -->
import { IFAQState, IQuoteState, ITestimony, ICountry } from "./interfaces";

///Commencing the code -->
export const faqs: Array<IFAQState> = [
    {
        question: "Why are natural remedies essential?",
        answer: "Embracing natural health practices is key to nurturing our bodies from the inside out. By incorporating wholesome, natural-based solutions into our daily routines, we fortify our well-being, enhance vitality and foster a harmonious balance between the mind, soul and body."
    },
    {
        question: "How do we source our products?",
        answer: "We guarantee you that we only sell 100% original products, all products on our platform were carefully researched and sourced directly from the manufacturers or trusted wholesalers."
    },
    {
        question: "When should I expect my delivery?",
        answer: "Deliveries are usually within 1 - 4 business days, be rest assured that we would do everything to deliver your products to you as soon as possible."
    },
    {
        question: "Where do we deliver to?",
        answer: "Currently we only deliver to USA, UK, Canada, Egypt, Ghana, Nigeria, South Africa, Rwanda, Uganda, Kenya, Germany, Australia and India."
    },
    {
        question: "How is my data used?",
        answer: "We respect our client's privacy and only use your data solely for the purpose of processing your orders and providing you with the best possible shopping experience."
    }
]

export const quotes: Array<IQuoteState> = [
    {
        quote: "Vinyl Chloride is a deadly toxin that is present in our air and drinking water, long-term exposure to this toxin has been known to cause liver damage and cancer."
    },
    {
        quote: "True happiness comes from within."
    },
    {
        quote: "It’s up to you today to start making healthy choices. Not choices that are just healthy for your body, but healthy for your mind."
    },
    {
        quote: "Arsenic is a toxin found in some food crops and water, long-term exposure to this toxin can cause cancer and skin lesions."
    },
    {
        quote: "Mercury is one of toxins mostly found in seafoods and has been known to produce harmful effects on the nervous, digestive and immune systems, lungs and kidneys, and may be fatal.",
    },
    {
        quote: "One of the major symptoms of liver dysfunction is brain fog. Participating in a detox program can promote clearer thinking due to the absence of refined foods that can make us feel fatigued and cause our thought process to be compromised."
    },
    {
        quote: "Detoxing can often bring about weight loss due to eating more nutrient-dense foods as opposed to calorie-dense foods."
    }, 
    {
        quote: "Detoxing can often combat digestive issues such as bloating, constipation, indigestion and flatulence which often occur due to a build-up of toxins and/or a poor diet. You are likely to experience more regular bowel movements and feel better overall."
    },
    {
        quote: "Being overburdened with toxins may be the reason you find yourself waking up at odd hours of the morning."
    },
    {
        quote: "If our liver gets overworked, toxins begin to get stored in our fat and muscle, and circulate through our blood stream. These toxins increase inflammation throughout our body which can cause symptoms such as headaches, weight gain, fatigue, lethargy and poor complexion."
    },
    {
        quote: "Phthalates are a group of chemicals used in a wide range of products such as plastics, cosmetics, personal care products, and medical devices. Some studies have suggested that exposure to phthalates may pose health risks such as endocrine system disruption, particularly in infants and children."
    },
    {
        quote: "TBHQ (tert-Butylhydroquinone) is a food additive that is commonly used as a preservative in processed foods which in high doses has been proven to cause DNA damage, liver, reproductive problems and even cancer."
    },
    {
        quote: "Perchlorate is a chemical compound found in some fertilizers, food products, bleach and other household products which leads to a range of health problems, including developmental delays, decreased fertility and thyroid disorders."
    }
] 

export const testimonies: Array<ITestimony> = [
    {
        name: "Ryan Hayes",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1IQkP_azDdRCkyk4YBPg_LmsvL4TsQR-h",
            width: 101,
            height: 101
        },
        profession: "Accountant",
        testimony: "Since using the Norland Detox Pack I've experienced improved digestion, increased energy levels, and a renewed sense of well-being,  The combination of natural ingredients and innovative formulas has proven to be incredibly effective."
    },
    {
        name: "Daniel Mukasa",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1qaVIx8r-etUJB-2pf0TRiRR-8dT3O7c0",
            width: 101,
            height: 101
        },
        profession: "Financial Advisor",
        testimony: "My wife and I use the ginseng tea as a dietary supplement. The product has proven to be an energy boost and is easily disolvable in our coffee or tea drinks. It's like a rejuvenating elixir in a cup!"
    },
    {
        name: "Linh Nguyen",
        image: {
            src: "https://drive.google.com/uc?export=download&id=18Q9rXJTCFocP4GSRykc882-LCOa56Fiz",
            width: 101,
            height: 101
        },
        profession: "Interior Designer",
        testimony: "I highly recommend the Kinoki Cleaning Detox Foot Pads to anyone looking for a soothing and convenient way to promote their overall health. It's like a spa treatment right at home!"
    },
    {
        name: "Lily Chen",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1x_pUdyuYwrRjsSOm2Xicup8N_RZ3dQkW",
            width: 101,
            height: 101
        },
        profession: "Data Scientist",
        testimony: "V-Steam Detox has been a revelation for me. This soothing treatment has helped me connect with my body and embrace holistic wellness. It provides a rejuvenating experience that leaves me feeling refreshed and balanced."
    },
    {
        name: "Priya Sharma",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1oal1nb-UYEI_x5jg0NKcZHC3BdOFqhGA",
            width: 101,
            height: 101
        },
        profession: "Fashion Designer",
        testimony: "I've noticed a significant improvement in the overall texture and appearance of my skin since incorporating the Simple Skin Detox into my skincare routine. It's truly a skincare essential!"
    },
    {
        name: "Mia Anderson",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1EnHG5rZO2ySBAl_og9OULtPIOUeVdpLF",
            width: 101,
            height: 101
        },
        profession: "Chef",
        testimony: "The high-quality norland panty liner provides excellent protection and keeps me feeling fresh and confident throughout the day. I highly recommend it to every person looking for a reliable and comfortable solution. It's a must-have!"
    },
    {
        name: "Amina Nyambura",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1OZqcxUju_lF3gNeD4AkHhNf6LMOsw33M",
            width: 101,
            height: 101
        },
        profession: "Marketing Manager",
        testimony: "I highly recommend the Womb Detox Tea to any woman seeking to nurture and care for her womb. Since taking it, I've experienced increased vitality and a sense of balance. It's truly empowering!."
    },
    {
        name: "Omar Khalid",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1AR60H9I2vQicc8QsVc5W5sf_V9QwAo5Q",
            width: 101,
            height: 101
        },
        profession: "Graphics Designer",
        testimony: "Male Fertility Tea changed the game for me! This amazing blend improved my reproductive health my confidence and vitality. It tastes great and supports my fertility journey. Highly recommended!."
    },
    {
        name: "Aisha Farouk",
        image: {
            src: "https://drive.google.com/uc?export=download&id=16F_fyq6CEkYq2svW_ktR8LblIiedAim7",
            width: 101,
            height: 101
        },
        profession: "Tour Guide",
        testimony: "I drink the Kuding tea twice a day for over a year now. It comes promptly when I order it. I have tried other brands but keep coming back to this one."
    },
    {
        name: "Lindiwe Khumalo",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1f506OaWNgjssHvCymU-djsTpotzxk4Hf",
            width: 101,
            height: 101
        },
        profession: "Event Planner",
        testimony: "Wuqing Women health care is a very nicely packaged, good quality and reasonable priced product! I like it very much and recommend it. I'll buy it again."
    }
]

///This contains the number of countries that we operate in
export const countryList: Array<ICountry> = [
    {
        name: 'United States', 
        dial_code: '+1', 
        code: 'US',  
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1M0gkMQjwoKCUsKlhniy6jKSBIYddfapJ',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Canada', 
        dial_code: '+1', 
        code: 'CA', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1q6y6HolsOzkDWxDtdB-Oj9ZiSCWEP2Ql',
            width: 28,
            height: 20
        }
    },
    {
        name: 'United Kingdom', 
        dial_code: '+44', 
        code: 'GB', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1CF8YeyOYiv95SHIwzeYv3FHjkHO80ZlY',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Egypt', 
        dial_code: '+20', 
        code: 'EG', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1xVq4WCAUahbtXKvxSfeeDqi25BDzqYt4',
            width: 28, 
            height: 20
        }
    },
    {
        name: 'Ghana', 
        dial_code: '+233', 
        code: 'GH', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1_CF51QMet_fPRH_Mo58zbijjZa1aHIEa',
            width: 28, 
            height: 20
        }
    },
    {
        name: 'Nigeria', 
        dial_code: '+234', 
        code: 'NG', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1LCz4DZBzTJxKNcBd5NLYQFwwr10LkHGO',
            width: 28,
            height: 20
        } 
    },
    {
        name: 'South Africa', 
        dial_code: '+27', 
        code: 'ZA', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1iZStelnWq4kYndejJqW5p-pPLbNbiooi',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Rwanda', 
        dial_code: '+250', 
        code: 'RW', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1nv3ffhBvKpmXuzXN6g14IuZvR6vlVAEa',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Uganda', 
        dial_code: '+256', 
        code: 'UG', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1T3kWn_0S-WVzDDPjKq39eoVb3Jel8fNX',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Kenya', 
        dial_code: '+254', 
        code: 'KE', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1y76iXqrFo-dXxck80UdIieBLA41VFzrd',
            width: 28,
            height: 20
        }
    },
    {
        name: 'Germany', 
        dial_code: '+49', 
        code: 'DE', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1RwXP8xZfNzdCCLiGU2FBPijWZHe6mjjt',
            width: 28,
            height: 20
        }
    }, 
    {
        name: 'Australia', 
        dial_code: '+61', 
        code: 'AU', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1_Q4LIoic4KKoEDlc6ET-aTmzmAVQgANX',
            width: 28,
            height: 20
        }
    },
    {
        name: 'India', 
        dial_code: '+91', 
        code: 'IN', 
        flag: {
            src: 'https://drive.google.com/uc?export=download&id=1mR1UlTlPJEGeHJJfRl37RbA1IJRlLMlq',
            width: 28,
            height: 20
        }
    }
]

