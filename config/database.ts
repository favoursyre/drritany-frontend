//This acts as a database for the web app

///Libraries -->
import { IFAQState, IQuoteState, ITestimony } from "./interfaces";

///Commencing the code -->
export const faqs: Array<IFAQState> = [
    {
        question: "Why is detoxifying important?",
        answer: "Detoxifying is important because it helps the body to get rid of harmful toxins that can accumulate over time and cause various health problems. Toxins can come from a variety of sources, including environmental pollutants, processed foods, alcohol, drugs, and medications."
    },
    {
        question: "How do we source our products?",
        answer: "We guarantee you that we only sell 100% original products, all products on our platform were carefully researched and sourced directly from the manufacturers or trusted wholesalers."
    },
    {
        question: "When should I expect my delivery?",
        answer: "Deliveries are usually within 7 business days, be rest assured that we would do everything to deliver your products to you as soon as possible."
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

export const testimonies: Array<ITestimony> = []

