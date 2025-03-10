//This acts as a database for the web app

///Libraries -->
import { IFAQState, IQuoteState, ITestimony, ICountry } from "./interfaces";
import { companyName, deliveryDuration, deliveryPeriod } from "./sharedUtils";

///Commencing the code -->

///This contains the number of countries that we operate in
export const countryList: Array<ICountry> = [
    // {
    //     name: {
    //         common: "Angola",
    //         official: "Republic of Angola",
    //         abbreviation: "AO",
    //         demonym: "Angolan",
    //         capital: "Luanda"
    //     },
    //     dial_code: "+244",
    //     location: {
    //         continent: "Africa",
    //         subContinent: "Middle Africa"
    //     }
    // },
    {
        name: {
            common: "Australia",
            official: "Commonwealth of Australia",
            abbreviation: "AU",
            demonym: "Australian",
            capital: "Canberra"
        },
        dial_code: '+61', 
        currency: {
            name: "Australian Dollar",
            abbreviation: "AUD",
            symbol: "$",
            exchangeRate: 1.51
        },
        location: {
            continent: "Oceania",
            subContinent: "Australasia",
            geoCordinates: {
                latitude: -27,
                longitude: 133
            },
            mapLink: "https://goo.gl/maps/DcjaDa7UbhnZTndH6"
        },
        languages: [
            {
                name: "English",
                code: "eng"
            }
        ],
        timezones: [
            "UTC+05:00",
            "UTC+06:30",
            "UTC+07:00",
            "UTC+08:00",
            "UTC+09:30",
            "UTC+10:00",
            "UTC+10:30",
            "UTC+11:30"
        ],
        flag: {
            src: "https://flagcdn.com/w320/au.png",
            alt: "The flag of Australia has a dark blue field. It features the flag of the United Kingdom — the Union Jack — in the canton, beneath which is a large white seven-pointed star. A representation of the Southern Cross constellation, made up of one small five-pointed and four larger seven-pointed white stars, is situated on the fly side of the field.",
            width: 320,
            height: 160
        }
    },
    {
        name: {
            common: "Botswana",
            official: "Republic of Botswana",
            abbreviation: "BW",
            demonym: "Motswana",
            capital: "Gaborone"
        },
        dial_code: '+267', 
        currency: {
            name: "Botswana Pula",
            abbreviation: "BWP",
            symbol: "P",
            exchangeRate: 13.6
        },
        location: {
            continent: "Africa",
            subContinent: "Southern Africa",
            geoCordinates: {
                latitude: -22,
                longitude: 24
            },
            mapLink: "https://goo.gl/maps/E364KeLy6N4JwxwQ8"
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Tswana",
                code: "tsn"
            }
        ],
        timezones: [
            "UTC+02:00"
        ],
        flag: {
            src: "https://flagcdn.com/w320/bw.png",
            alt: "The flag of Botswana has a light blue field with a white-edged black horizontal band across its center.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Canada",
            official: "Canada",
            abbreviation: 'CA',
            demonym: "Canadian",
            capital: "Ottawa"
        },
        dial_code: '+1',  
        currency: {
            name: "Canadian Dollar",
            abbreviation: "CAD",
            symbol: "$",
            exchangeRate: 1.5
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "French",
                code: "fra"
            }
        ],
        states: [
            {
                name: "Alberta",
                abbreviation: "AB",
                extraDeliveryPercent: 10,
            },
            {
                name: "British Columbia",
                abbreviation: "BC",
                extraDeliveryPercent: 10,
            },
            {
                name: "Manitoba",
                abbreviation: "MB",
                extraDeliveryPercent: 10,
            },
            {
                name: "New Brunswick",
                abbreviation: "NB",
                extraDeliveryPercent: 10,
            },
            {
                name: "Newfoundland and Labrador",
                abbreviation: "NL",
                extraDeliveryPercent: 10,
            },
            {
                name: "Nova Scotia",
                abbreviation: "NS",
                extraDeliveryPercent: 10,
            },
            {
                name: "Ontario",
                abbreviation: "ON",
                extraDeliveryPercent: 0,
            },
            {
                name: "Prince Edward Island",
                abbreviation: "PE",
                extraDeliveryPercent: 10,
            },
            {
                name: "Quebec",
                abbreviation: "QC",
                extraDeliveryPercent: 10,
            },
            {
                name: "Saskatchewan",
                abbreviation: "SK",
                extraDeliveryPercent: 10,
            },
            {
                name: "Northwest Territories",
                abbreviation: "NT",
                extraDeliveryPercent: 10,
            },
            {
                name: "Nunavut",
                abbreviation: "NU",
                extraDeliveryPercent: 10,
            },
            {
                name: "Yukon",
                abbreviation: "YT",
                extraDeliveryPercent: 10,
            }
        ],
        delivery: {
            feePerKg: 0.8,
            baseNumber: 7
        }, 
        priceInflation: 0,
        flag: {
            src: 'https://flagcdn.com/w320/ca.png',
            alt: "The flag of Canada is composed of a red vertical band on the hoist and fly sides and a central white square that is twice the width of the vertical bands. A large eleven-pointed red maple leaf is centered in the white square.",
            width: 320,
            height: 160
        }
    },
    {
        name: {
            common: "Egypt",
            official: "Arab Republic of Egypt",
            abbreviation: 'EG',
            demonym: "Egyptian",
            capital: "Cairo"
        }, 
        dial_code: '+20',  
        currency: {
            name: "Egyptian Pound",
            abbreviation: "EGP",
            symbol: "£",
            exchangeRate: 47.94
        },
        languages: [
            {
                name: "Arabic",
                code: "ara"
            },
            {
                name: "English",
                code: "eng"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/eg.png',
            alt: "The flag of Egypt is composed of three equal horizontal bands of red, white and black, with Egypt's national emblem — a hoist-side facing gold eagle of Saladin — centered in the white band.",
            width: 320, 
            height: 213
        }
    },
    {
        name: {
            common: "Eswatini",
            official: "Kingdom of Eswatini",
            abbreviation: 'SZ',
            demonym: "Swazi",
            capital: "Mbabane"
        }, 
        dial_code: '+268',  
        currency: {
            name: "Swazi lilangeni",
            abbreviation: "SZL",
            symbol: "L",
            exchangeRate: 18.48
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Swati",
                code: "ssw"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/sz.png',
            alt: "The flag of Eswatini is composed of three horizontal bands — a large central yellow-edged red band, and a light blue band above and beneath the red band. The red band is three times the height of the blue bands and bears a centered emblem made up of a large black and white Nguni shield covering two spears and a staff decorated with feather tassels, all placed horizontally.",
            width: 320, 
            height: 213
        }
    },
    {
        name: {
            common: "Ethiopia",
            official: "Federal Democratic Republic of Ethiopia",
            abbreviation: 'ET',
            demonym: "Ethiopian",
            capital: "Addis Ababa"
        }, 
        dial_code: '+251',  
        currency: {
            name: "Ethiopian Birr",
            abbreviation: "ETB",
            symbol: "Br",
            exchangeRate: 57.31
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Amharic",
                code: "amh"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/et.png',
            alt: "The flag of Ethiopia is composed of three equal horizontal bands of green, yellow and red, with the national emblem superimposed at the center of the field. The national emblem comprises a light blue circle bearing a golden-yellow pentagram with single yellow rays emanating from the angles between the points of the pentagram.",
            width: 320, 
            height: 160
        }
    },
    {
        name: {
            common: "Gambia",
            official: "Republic of the Gambia",
            abbreviation: 'GM',
            demonym: "Gambian",
            capital: "Banjul"
        },
        dial_code: '+220',
        currency: {
            name: "Gambian Dalasi",
            abbreviation: "GMD",
            symbol: "D",
            exchangeRate: 67.75
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Amharic",
            //     code: "amh"
            // }
        ], 
        flag: {
            src: 'https://flagcdn.com/w320/gm.png',
            alt: "The flag of Gambia is composed of three equal horizontal bands of red, blue with white top and bottom edges, and green.",
            width: 320, 
            height: 213
        }
    },
    {
        name: {
            common: "Germany",
            official: "Federal Republic of Germany",
            abbreviation: 'DE',
            demonym: "German",
            capital: "Berlin"
        }, 
        dial_code: '+49',
        currency: {
            name: "Euro",
            abbreviation: "EUR",
            symbol: "€",
            exchangeRate: 0.93
        },
        languages: [
            {
                name: "German",
                code: "ger"
            },
            {
                name: "English",
                code: "eng"
            }
        ], 
        flag: {
            src: 'https://flagcdn.com/w320/de.png',
            alt: "The flag of Germany is composed of three equal horizontal bands of black, red and gold.",
            width: 320,
            height: 192
        }
    }, 
    {
        name: {
            common: "Ghana",
            official: "Republic of Ghana",
            abbreviation: 'GH',
            demonym: "Ghanaian",
            capital: "Accra"
        },
        dial_code: '+233',
        currency: {
            name: "Ghanaian Cedi",
            abbreviation: "GHS",
            symbol: "₵",
            exchangeRate: 15.5
        }, 
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Amharic",
            //     code: "amh"
            // }
        ],
        states: [
            {
                name: "Ahafo",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Ashanti",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Bono",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Bono East",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Central",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Eastern",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Greater Accra",
                abbreviation: "",
                extraDeliveryPercent: 0
            },
            {
                name: "North East",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Northern",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Oti",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Savannah",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Upper East",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Upper West",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Volta",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Western",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Western North",
                abbreviation: "",
                extraDeliveryPercent: 70
            }

        ],
        priceInflation: 10,
        flag: {
            src: 'https://flagcdn.com/w320/gh.png',
            alt: "The flag of Ghana is composed of three equal horizontal bands of red, gold and green, with a five-pointed black star centered in the gold band.",
            width: 320, 
            height: 213
        }
    },
    {
        name: {
            common: "India",
            official: "Republic of India",
            abbreviation: 'IN',
            demonym: "Indian",
            capital: "New Delhi"
        },
        currency: {
            name: "Indian Rupee",
            abbreviation: "INR",
            symbol: "₵",
            exchangeRate: 83.51
        }, 
        languages: [
            {
                name: "Hindi",
                code: "hin"
            },
            {
                name: "English",
                code: "eng"
            }
        ], 
        dial_code: '+91', 
        flag: {
            src: 'https://flagcdn.com/w320/in.png',
            alt: "The flag of India is composed of three equal horizontal bands of saffron, white and green. A navy blue wheel with twenty-four spokes — the Ashoka Chakra — is centered in the white band.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Kenya",
            official: "Republic of Kenya",
            abbreviation: 'KE',
            demonym: "Kenyan",
            capital: "Nairobi"
        }, 
        dial_code: '+254', 
        currency: {
            name: "Kenya Shilling",
            abbreviation: "KES",
            symbol: "Sh",
            exchangeRate: 133.5
        }, 
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Swahili",
                code: "swa"
            }
        ], 
        flag: {
            src: 'https://flagcdn.com/w320/ke.png',
            alt: "The flag of Kenya is composed of three equal horizontal bands of black, red with white top and bottom edges, and green. An emblem comprising a red, black and white Maasai shield covering two crossed white spears is superimposed at the center of the field.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Lesotho",
            official: "Kingdom of Lesotho",
            abbreviation: 'LS',
            demonym: "Mosotho",
            capital: "Maseru"
        }, 
        dial_code: '+266', 
        currency: {
            name: "Lesotho Loti",
            abbreviation: "LSL",
            symbol: "L",
            exchangeRate: 18.48
        }, 
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Sotho",
                code: "sot"
            }
        ], 
        flag: {
            src: 'https://flagcdn.com/w320/ls.png',
            alt: "The flag of Lesotho is composed of three horizontal bands of blue, white and green in the ratio of 3:4:3. A black mokorotlo — a Basotho hat — is centered in the white band.",
            width: 320,
            height: 213
        }
    },
    // {
    //     name: {
    //         common: "Libya",
    //         official: "State of Libya",
    //         abbreviation: 'LY',
    //         demonym: "Libyan",
    //         capital: "Tripoli"
    //     }, 
    //     dial_code: '+266', 
    //     currency: {
    //         name: "Lesotho Loti",
    //         abbreviation: "LSL",
    //         symbol: "L",
    //         exchangeRate: 18.48
    //     }, 
    //     languages: [
    //         {
    //             name: "English",
    //             code: "eng"
    //         },
    //         {
    //             name: "Sotho",
    //             code: "sot"
    //         }
    //     ], 
    //     flag: {
    //         src: 'https://flagcdn.com/w320/ls.png',
    //         alt: "The flag of Lesotho is composed of three horizontal bands of blue, white and green in the ratio of 3:4:3. A black mokorotlo — a Basotho hat — is centered in the white band.",
    //         width: 320,
    //         height: 213
    //     }
    // },
    {
        name: {
            common: "Mauritius",
            official: "Republic of Mauritius",
            abbreviation: 'MU',
            demonym: "Mauritian",
            capital: "Port Louis"
        }, 
        dial_code: '+230', 
        currency: {
            name: "Mauritian Rupee",
            abbreviation: "MUR",
            symbol: "₨",
            exchangeRate: 46.19
        }, 
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "French",
                code: "fre"
            },
            {
                name: "Mauritian Creole",
                code: "mfe"
            }
        ], 
        flag: {
            src: 'https://flagcdn.com/w320/mu.png',
            alt: "The flag of Mauritius is composed of four equal horizontal bands of red, blue, yellow and green.",
            width: 320,
            height: 213
        }
    },
    // {
    //     name: {
    //         common: "Mozambique",
    //         official: "Republic of Mozambique",
    //         abbreviation: 'MZ',
    //         demonym: "Mauritian",
    //         capital: "Maputo"
    //     }, 
    //     dial_code: '+230', 
    //     currency: {
    //         name: "Mauritian Rupee",
    //         abbreviation: "MUR",
    //         symbol: "₨",
    //         exchangeRate: 46.19
    //     }, 
    //     languages: [
    //         {
    //             name: "English",
    //             code: "eng"
    //         },
    //         {
    //             name: "French",
    //             code: "fre"
    //         },
    //         {
    //             name: "Mauritian Creole",
    //             code: "mfe"
    //         }
    //     ], 
    //     flag: {
    //         src: 'https://flagcdn.com/w320/mu.png',
    //         alt: "The flag of Mauritius is composed of four equal horizontal bands of red, blue, yellow and green.",
    //         width: 320,
    //         height: 213
    //     }
    // },
    {
        name: {
            common: "Nigeria",
            official: "Federal Republic of Nigeria",
            abbreviation: 'NG',
            demonym: "Nigerian",
            capital: "Abuja"
        }, 
        dial_code: '+234', 
        currency: {
            name: "Nigerian Naira",
            abbreviation: "NGN",
            symbol: "₦",
            exchangeRate: 1300
        },
        states: [
            {
                name: "Abuja",
                abbreviation: "FC",
                extraDeliveryPercent: 40,
            },
            {
                name: "Abia",
                abbreviation: "AB",
                extraDeliveryPercent: 40,
            },
            {
                name: "Adamawa",
                abbreviation: "AD",
                extraDeliveryPercent: 70,
            },
            {
                name: "Akwa Ibom",
                abbreviation: "AK",
                extraDeliveryPercent: 40,
            },
            {
                name: "Anambra",
                abbreviation: "AN",
                extraDeliveryPercent: 40,
            },
            {
                name: "Bauchi",
                abbreviation: "BA",
                extraDeliveryPercent: 70,
            },
            {
                name: "Bayelsa",
                abbreviation: "BY",
                extraDeliveryPercent: 40,
            },
            {
                name: "Benue",
                abbreviation: "BE",
                extraDeliveryPercent: 70,
            },
            {
                name: "Borno",
                abbreviation: "BO",
                extraDeliveryPercent: 70,
            },
            {
                name: "Cross River",
                abbreviation: "CR",
                extraDeliveryPercent: 40,
            },
            {
                name: "Delta",
                abbreviation: "DE",
                extraDeliveryPercent: 40,
            },
            {
                name: "Ebonyi",
                abbreviation: "EB",
                extraDeliveryPercent: 40,
            },
            {
                name: "Edo",
                abbreviation: "ED",
                extraDeliveryPercent: 40,
            },
            {
                name: "Ekiti",
                abbreviation: "EK",
                extraDeliveryPercent: 40,
            },
            {
                name: "Gombe",
                abbreviation: "GO",
                extraDeliveryPercent: 70,
            },
            {
                name: "Imo",
                abbreviation: "IM",
                extraDeliveryPercent: 40,
            },
            {
                name: "Jigawa",
                abbreviation: "JI",
                extraDeliveryPercent: 70,
            },
            {
                name: "Kaduna",
                abbreviation: "KD",
                extraDeliveryPercent: 70,
            },
            {
                name: "Kano",
                abbreviation: "KN",
                extraDeliveryPercent: 70,
            },
            {
                name: "Katsina",
                abbreviation: "KT",
                extraDeliveryPercent: 70,
            },
            {
                name: "Kebbi",
                abbreviation: "KE",
                extraDeliveryPercent: 70,
            },
            {
                name: "Kogi",
                abbreviation: "KO",
                extraDeliveryPercent: 70,
            },
            {
                name: "Kwara",
                abbreviation: "KW",
                extraDeliveryPercent: 60,
            },
            {
                name: "Lagos",
                abbreviation: "LA",
                extraDeliveryPercent: 0,
            },
            {
                name: "Nassarawa",
                abbreviation: "NA",
                extraDeliveryPercent: 70,
            },
            {
                name: "Niger",
                abbreviation: "NI",
                extraDeliveryPercent: 70,
            },
            {
                name: "Ogun",
                abbreviation: "OG",
                extraDeliveryPercent: 40,
            },
            {
                name: "Ondo",
                abbreviation: "ON",
                extraDeliveryPercent: 40,
            },
            {
                name: "Osun",
                abbreviation: "OS",
                extraDeliveryPercent: 40,
            },
            {
                name: "Oyo",
                abbreviation: "OY",
                extraDeliveryPercent: 40,
            },
            {
                name: "Plateau",
                abbreviation: "PL",
                extraDeliveryPercent: 70,
            },
            {
                name: "Rivers",
                abbreviation: "RI",
                extraDeliveryPercent: 40,
            },
            {
                name: "Sokoto",
                abbreviation: "SO",
                extraDeliveryPercent: 70,
            },
            {
                name: "Taraba",
                abbreviation: "TA",
                extraDeliveryPercent: 70,
            },
            {
                name: "Yobe",
                abbreviation: "YO",
                extraDeliveryPercent: 70,
            },
            {
                name: "Zamfara",
                abbreviation: "ZA",
                extraDeliveryPercent: 70,
            }
        ],
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Swahili",
            //     code: "swa"
            // }
        ],
        delivery: {
            feePerKg: 0.7,
            baseNumber: 3
        }, 
        priceInflation: 0,
        flag: {
            src: 'https://flagcdn.com/w320/ng.png',
            alt: "The flag of Nigeria is composed of three equal vertical bands of green, white and green.",
            width: 320,
            height: 160
        } 
    },
    {
        name: {
            common: "Rwanda",
            official: "Republic of Rwanda",
            abbreviation: 'RW',
            demonym: "Rwandan",
            capital: "Kigali"
        }, 
        currency: {
            name: "Rwandan Franc",
            abbreviation: "RWF",
            symbol: "Fr",
            exchangeRate: 1290.13
        },
        dial_code: '+250', 
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Kinyarwanda",
                code: "kin"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/rw.png',
            alt: "The flag of Rwanda is composed of three horizontal bands of light blue, yellow and green. The light blue band is twice the height of the other two bands and bears a yellow sun with twenty-four rays on its fly side.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Sierra Leone",
            official: "Republic of Sierra Leone",
            abbreviation: 'SL',
            demonym: "Sierra Leonean",
            capital: "Freetown"
        }, 
        currency: {
            name: "Sierra Leonean Leone",
            abbreviation: "SLL",
            symbol: "Le",
            exchangeRate: 20969.5
        },
        dial_code: '+232', 
        languages: [
            {
                name: "English",
                code: "eng"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/sl.png',
            alt: "The flag of Sierra Leone is composed of three equal horizontal bands of green, white and blue.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "South Africa",
            official: "Republic of South Africa",
            abbreviation: 'ZA',
            demonym: "South African",
            capital: ["Pretoria", "Bloemfontein", "Cape Town"]
        },  
        dial_code: '+27', 
        currency: {
            name: "South African Rand",
            abbreviation: "ZAR",
            symbol: "R",
            exchangeRate: 18.48
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Zulu",
                code: "zul"
            }
        ],
        priceInflation: 15, 
        states: [
            {
                name: "Eastern Cape",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Free State",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Gauteng",
                abbreviation: "",
                extraDeliveryPercent: 0
            },
            {
                name: "KwaZulu-Natal",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Limpopo",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Mpumalanga",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Northern Cape",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "North West",
                abbreviation: "",
                extraDeliveryPercent: 70
            },
            {
                name: "Western Cape",
                abbreviation: "",
                extraDeliveryPercent: 70
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/za.png',
            alt: "The flag of South Africa is composed of two equal horizontal bands of red and blue, with a yellow-edged black isosceles triangle superimposed on the hoist side of the field. This triangle has its base centered on the hoist end, spans about two-fifth the width and two-third the height of the field, and is enclosed on its sides by the arms of a white-edged green horizontally oriented Y-shaped band which extends along the boundary of the red and blue bands to the fly end of the field.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Tanzania",
            official: "United Republic of Tanzania",
            abbreviation: 'TZ',
            demonym: "Tanzanian",
            capital: "Dodoma"
        }, 
        dial_code: '+255', 
        currency: {
            name: "Tanzanian Shilling",
            abbreviation: "TZS",
            symbol: "Sh",
            exchangeRate: 2595
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Swahili",
                code: "swa"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/tz.png',
            alt: "The flag of Tanzania features a yellow-edged black diagonal band that extends from the lower hoist-side corner to the upper fly-side corner of the field. Above and beneath this band are a green and light blue triangle respectively.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Uganda",
            official: "Republic of Uganda",
            abbreviation: 'UG',
            demonym: "Ugandan",
            capital: "Kampala"
        }, 
        dial_code: '+256', 
        currency: {
            name: "Ugandan Shilling",
            abbreviation: "UGX",
            symbol: "Sh",
            exchangeRate: 3765.14
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            {
                name: "Swahili",
                code: "swa"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/ug.png',
            alt: "The flag of Uganda is composed of six equal horizontal bands of black, yellow, red, black, yellow and red. A white circle bearing a hoist-side facing grey red-crested crane is superimposed in the center of the field.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "United Kingdom",
            official: "United Kingdom of Great Britain and Northern Ireland",
            abbreviation: 'GB',
            demonym: "British",
            capital: "London"
        }, 
        dial_code: '+44', 
        currency: {
            name: "British Pound",
            abbreviation: "GBP",
            symbol: "£",
            exchangeRate: 0.8
        },
        languages: [
            {
                name: "English",
                code: "eng"
            }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/gb.png',
            alt: "The flag of the United Kingdom — the Union Jack — has a blue field. It features the white-edged red cross of Saint George superimposed on the diagonal red cross of Saint Patrick which is superimposed on the diagonal white cross of Saint Andrew.",
            width: 320,
            height: 160
        }
    },
    {
        name: {
            common: "United States",
            official: 'United States of America', 
            abbreviation: "US",
            demonym: "American",
            capital: "Washington, D.C."
        },
        dial_code: '+1',
        currency: {
            name: "United States Dollar",
            abbreviation: "USD",
            symbol: "$",
            exchangeRate: 1
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Swahili",
            //     code: "swa"
            // }
        ], 
        states: [
            { name: "Alabama", abbreviation: "AL", extraDeliveryPercent: 0 },
            { name: "Alaska", abbreviation: "AK", extraDeliveryPercent: 0 },
            { name: "Arizona", abbreviation: "AZ", extraDeliveryPercent: 0 },
            { name: "Arkansas", abbreviation: "AR", extraDeliveryPercent: 0 },
            { name: "California", abbreviation: "CA", extraDeliveryPercent: 0 },
            { name: "Colorado", abbreviation: "CO", extraDeliveryPercent: 0 },
            { name: "Connecticut", abbreviation: "CT", extraDeliveryPercent: 0 },
            { name: "Delaware", abbreviation: "DE", extraDeliveryPercent: 0 },
            { name: "Florida", abbreviation: "FL", extraDeliveryPercent: 0 },
            { name: "Georgia", abbreviation: "GA", extraDeliveryPercent: 0 },
            { name: "Hawaii", abbreviation: "HI", extraDeliveryPercent: 0 },
            { name: "Idaho", abbreviation: "ID", extraDeliveryPercent: 0 },
            { name: "Illinois", abbreviation: "IL", extraDeliveryPercent: 0 },
            { name: "Indiana", abbreviation: "IN", extraDeliveryPercent: 0 },
            { name: "Iowa", abbreviation: "IA", extraDeliveryPercent: 0 },
            { name: "Kansas", abbreviation: "KS", extraDeliveryPercent: 0 },
            { name: "Kentucky", abbreviation: "KY", extraDeliveryPercent: 0 },
            { name: "Louisiana", abbreviation: "LA", extraDeliveryPercent: 0 },
            { name: "Maine", abbreviation: "ME", extraDeliveryPercent: 0 },
            { name: "Maryland", abbreviation: "MD", extraDeliveryPercent: 0 },
            { name: "Massachusetts", abbreviation: "MA", extraDeliveryPercent: 0 },
            { name: "Michigan", abbreviation: "MI", extraDeliveryPercent: 0 },
            { name: "Minnesota", abbreviation: "MN", extraDeliveryPercent: 0 },
            { name: "Mississippi", abbreviation: "MS", extraDeliveryPercent: 0 },
            { name: "Missouri", abbreviation: "MO", extraDeliveryPercent: 0 },
            { name: "Montana", abbreviation: "MT", extraDeliveryPercent: 0 },
            { name: "Nebraska", abbreviation: "NE", extraDeliveryPercent: 0 },
            { name: "Nevada", abbreviation: "NV", extraDeliveryPercent: 0 },
            { name: "New Hampshire", abbreviation: "NH", extraDeliveryPercent: 0 },
            { name: "New Jersey", abbreviation: "NJ", extraDeliveryPercent: 0 },
            { name: "New Mexico", abbreviation: "NM", extraDeliveryPercent: 0 },
            { name: "New York", abbreviation: "NY", extraDeliveryPercent: 0 },
            { name: "North Carolina", abbreviation: "NC", extraDeliveryPercent: 0 },
            { name: "North Dakota", abbreviation: "ND", extraDeliveryPercent: 0 },
            { name: "Ohio", abbreviation: "OH", extraDeliveryPercent: 0 },
            { name: "Oklahoma", abbreviation: "OK", extraDeliveryPercent: 0 },
            { name: "Oregon", abbreviation: "OR", extraDeliveryPercent: 0 },
            { name: "Pennsylvania", abbreviation: "PA", extraDeliveryPercent: 0 },
            { name: "Rhode Island", abbreviation: "RI", extraDeliveryPercent: 0 },
            { name: "South Carolina", abbreviation: "SC", extraDeliveryPercent: 0 },
            { name: "South Dakota", abbreviation: "SD", extraDeliveryPercent: 0 },
            { name: "Tennessee", abbreviation: "TN", extraDeliveryPercent: 0 },
            { name: "Texas", abbreviation: "TX", extraDeliveryPercent: 0 },
            { name: "Utah", abbreviation: "UT", extraDeliveryPercent: 0 },
            { name: "Vermont", abbreviation: "VT", extraDeliveryPercent: 0 },
            { name: "Virginia", abbreviation: "VA", extraDeliveryPercent: 0 },
            { name: "Washington", abbreviation: "WA", extraDeliveryPercent: 0 },
            { name: "West Virginia", abbreviation: "WV", extraDeliveryPercent: 0 },
            { name: "Wisconsin", abbreviation: "WI", extraDeliveryPercent: 0 },
            { name: "Wyoming", abbreviation: "WY", extraDeliveryPercent: 0 }
        ],
        delivery: {
            feePerKg: 0.8,
            baseNumber: 7
        },
        flag: {
            src: 'https://flagcdn.com/w320/us.png',
            alt: "The flag of the United States of America is composed of thirteen equal horizontal bands of red alternating with white. A blue rectangle, bearing fifty small five-pointed white stars arranged in nine rows where rows of six stars alternate with rows of five stars, is superimposed in the canton.",
            width: 320,
            height: 168
        }
    },
    {
        name: {
            common: "Zambia",
            official: "Republic of Zambia",
            abbreviation: 'ZM',
            demonym: "Zambian",
            capital: "Lusaka"
        }, 
        dial_code: '+260', 
        currency: {
            name: "Zambian Kwacha",
            abbreviation: "ZMW",
            symbol: "ZK",
            exchangeRate: 27.1
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Swahili",
            //     code: "swa"
            // }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/zm.png',
            alt: "The flag of Zambia has a green field, on the fly side of which is a soaring orange African fish eagle above a rectangular area divided into three equal vertical bands of red, black and orange.",
            width: 320,
            height: 213
        }
    },
    {
        name: {
            common: "Zimbabwe",
            official: "Republic of Zimbabwe",
            abbreviation: 'ZW',
            demonym: "Zimbabwean",
            capital: "Harare"
        }, 
        dial_code: '+263', 
        currency: {
            name: "Zimbabwean dollar",
            abbreviation: "ZWL",
            symbol: "$",
            exchangeRate: 322
        },
        languages: [
            {
                name: "English",
                code: "eng"
            },
            // {
            //     name: "Swahili",
            //     code: "swa"
            // }
        ],
        flag: {
            src: 'https://flagcdn.com/w320/zw.png',
            alt: "The flag of Zimbabwe is composed of seven equal horizontal bands of green, yellow, red, black, red, yellow and green, with a white isosceles triangle superimposed on the hoist side of the field. This triangle is edged in black, spans about one-fourth the width of the field and has its base on the hoist end. A yellow Zimbabwe bird superimposed on a five-pointed red star is centered in the triangle.",
            width: 320,
            height: 160
        }
    },
]

//console.log("Company: ", companyName)
export const faqs: Array<IFAQState> = [
    {
        question: `Why ${companyName}?`,
        answer: `${companyName} is committed to quality and customer satisfaction. We aspire to create a global community of satisfied customers who trust us for all their shopping needs. By continually evolving and adapting to the latest trends and technologies, we aim to set new standards in the ecommerce industry.`
    },
    {
        question: "How do we source our products?",
        answer: "We guarantee you that we only sell 100% original products, all products on our platform were carefully researched and sourced directly from the manufacturers or trusted wholesalers."
    },
    {
        question: "When should I expect my delivery?",
        answer: `Deliveries are usually within ${deliveryPeriod} - ${deliveryDuration + deliveryPeriod} business days, be rest assured that we would do everything to deliver your products to you as soon as possible.`
    },
    {
        question: "How can I track my order?",
        answer: "You will receive an order invoice slip via email once you place an order, you can always use the invoice slip to track your order status."
    },
    {
        question: "How do I pay for my order?",
        answer: "We offer a wide range of payment options through Stripe payment gateway"
    },
    {
        question: "What should I do if I receive a damaged item?",
        answer: "If you receive a damaged item, please contact our customer service team immediately with your order id number and a photo of the damaged item. However, we do our best to vet every product that we ship out to our clients."
    },
    {
        question: "Do you offer discounts or promotions?",
        answer: "Yes, all of our products comes with price discounts and extra price discounts offer when you order more quantities. Aside that, we also occasionally offer other kinds discounts and promotions, sign up for our newsletter to stay updated on our latest deals."
    },
    {
        question: "Do you offer gift wrapping?",
        answer: "Yes, we offer gift wrapping for a slight additional fee. Contact our customer support team to get a quote."
    },
    {
        question: "What is your return policy?",
        answer: "Damaged or wrong products should be returned within 7 days of purchase. To be eligible, items must be unused and in original packaging/condition and we'd refund you accordingly, contact our support team for more info."
    },
    {
        question: "Can I change or cancel my order?",
        answer: `If you need to change or cancel your order, please contact us as soon as possible. We process orders quickly and would appreciate it if you do your very best to let us know on time. Thanks!`
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
        quote: "Health is a state of complete physical, mental and social well-being and not merely the absence of disease or infirmity."
    },
    {
        quote: "We are what we repeatedly eat. Healthy eating is not an act but a habit."
    },
    {
        quote: "Those who have no time for healthy eating will sooner or later have to find the time for illness."
    },
    {
        quote: "True happiness comes from within."
    },
    {
        quote: "Every living cell in your body is made from the food you eat. If you consistently eat junk food then you’ll have a junk body."
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
        name: "Emily Johnson",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1nYP_Jwu7WOnAusZDcBx_E47C6KBMUPEp",
            width: 101,
            height: 101
        },
        profession: "Nurse",
        testimony: "I've struggled with hair loss for years, trying countless products with little success. But then I discovered Jaysuing Hair Treatment, and it's been a game-changer for me. Within just a few weeks of using this product, I started noticing significant improvements in my hair thickness and volume."
    },
    {
        name: "Michael Williams",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1QEMbw4tZ80lDlv85WXVyIFVMDb_FQFVc",
            width: 101,
            height: 101
        },
        profession: "Medical Doctor",
        testimony: "Norland Calcium Iron Zinc Capsules have significantly boosted my overall health and vitality since I started taking them. I've noticed a remarkable improvement in my energy levels and immune system, making them an essential part of my daily routine. Highly recommend for anyone looking to enhance their overall health."
    },
    {
        name: "Maya Thompson",
        image: {
            src: "https://drive.google.com/uc?export=download&id=16Y_bSwPOIwJSQzGkQCPNV6Ch7MwTJmKe",
            width: 101,
            height: 101
        },
        profession: "Human Resource Manager",
        testimony: "Jaysuing Advanced Scar Gel has transformed my skin. It's incredible how it's fading my scars and giving me renewed confidence. I highly recommend it to anyone looking to fade off their scars and improve the appearance of their skin"
    },
    {
        name: "Emeka Okafor",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1LU8uTt9NacZXFSpaif0hTqoWlAYmklQH",
            width: 101,
            height: 101
        },
        profession: "Trader",
        testimony: "Norland GI Vital Softgel has been a breakthrough for my ulcer. After years of discomfort, this product brought the much-needed relief and restored my digestive health. I'm truly thankful for its remarkable effectiveness"
    },
    {
        name: "Ethan Bullock",
        image: {
            src: "https://drive.google.com/uc?export=download&id=14XterurRHXO-hSV84zXaMW1dUMhM7nm5",
            width: 101,
            height: 101
        },
        profession: "Civil Engineer",
        testimony: "Ever since I started using Norland Healthway Vision Capsules, my eyesight has experienced a remarkable transformation. These capsules effectively addressed various eye issues I was facing, providing me with clearer and sharper vision. I highly recommend them to anyone seeking to improve their eye health."
    },
    {
        name: "Sofia Martinez",
        image: {
            src: "https://drive.google.com/uc?export=download&id=1BWEuuHi6prjJwjR8R2fZYMJkiamxwq8o",
            width: 101,
            height: 101
        },
        profession: "Nutritionist",
        testimony: "Norland Healthway Hypoglycemic Capsules has effectively managed my abnormal blood sugar levels. I've experienced remarkable improvements in my health and energy levels since incorporating it into my daily routine. Highly recommend for anyone seeking natural support for blood sugar management."
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

