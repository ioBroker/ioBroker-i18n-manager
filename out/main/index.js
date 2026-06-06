"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path$1 = require("node:path");
const fs = require("fs");
const util = require("util");
const nodeWatch = require("node-watch");
const _ = require("lodash/fp");
const _$1 = require("lodash");
const path = require("path");
const yaml = require("js-yaml");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace$1 = /* @__PURE__ */ _interopNamespaceDefault(path$1);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const util__namespace = /* @__PURE__ */ _interopNamespaceDefault(util);
const ___namespace$1 = /* @__PURE__ */ _interopNamespaceDefault(_);
const ___namespace = /* @__PURE__ */ _interopNamespaceDefault(_$1);
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const yaml__namespace = /* @__PURE__ */ _interopNamespaceDefault(yaml);
const save = "save";
const saveComplete = "saveComplete";
const convert = "convert";
const open = "open";
const dataChanged = "dataChanged";
const navigateTo = "navigateTo";
const showSettings = "showSettings";
const settings = "settings";
const saveSettings$1 = "saveSettings";
const recentFolders = "recentFolders";
const closeFolder = "closeFolder";
const refreshFolder = "refreshFolder";
const locales = {
  "af": "Afrikaans",
  "af-NA": "Afrikaans (Namibia)",
  "af-ZA": "Afrikaans (South Africa)",
  "ak": "Akan",
  "ak-GH": "Akan (Ghana)",
  "sq": "Albanian",
  "sq-AL": "Albanian (Albania)",
  "sq-XK": "Albanian (Kosovo)",
  "sq-MK": "Albanian (Macedonia)",
  "am": "Amharic",
  "am-ET": "Amharic (Ethiopia)",
  "ar": "Arabic",
  "ar-DZ": "Arabic (Algeria)",
  "ar-BH": "Arabic (Bahrain)",
  "ar-TD": "Arabic (Chad)",
  "ar-KM": "Arabic (Comoros)",
  "ar-DJ": "Arabic (Djibouti)",
  "ar-EG": "Arabic (Egypt)",
  "ar-ER": "Arabic (Eritrea)",
  "ar-IQ": "Arabic (Iraq)",
  "ar-IL": "Arabic (Israel)",
  "ar-JO": "Arabic (Jordan)",
  "ar-KW": "Arabic (Kuwait)",
  "ar-LB": "Arabic (Lebanon)",
  "ar-LY": "Arabic (Libya)",
  "ar-MR": "Arabic (Mauritania)",
  "ar-MA": "Arabic (Morocco)",
  "ar-OM": "Arabic (Oman)",
  "ar-PS": "Arabic (Palestinian Territories)",
  "ar-QA": "Arabic (Qatar)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "ar-SO": "Arabic (Somalia)",
  "ar-SS": "Arabic (South Sudan)",
  "ar-SD": "Arabic (Sudan)",
  "ar-SY": "Arabic (Syria)",
  "ar-TN": "Arabic (Tunisia)",
  "ar-AE": "Arabic (United Arab Emirates)",
  "ar-EH": "Arabic (Western Sahara)",
  "ar-YE": "Arabic (Yemen)",
  "hy": "Armenian",
  "hy-AM": "Armenian (Armenia)",
  "as": "Assamese",
  "as-IN": "Assamese (India)",
  "az": "Azerbaijani",
  "az-AZ": "Azerbaijani (Azerbaijan)",
  "az-Cyrl-AZ": "Azerbaijani (Cyrillic, Azerbaijan)",
  "az-Cyrl": "Azerbaijani (Cyrillic)",
  "az-Latn-AZ": "Azerbaijani (Latin, Azerbaijan)",
  "az-Latn": "Azerbaijani (Latin)",
  "bm": "Bambara",
  "bm-Latn-ML": "Bambara (Latin, Mali)",
  "bm-Latn": "Bambara (Latin)",
  "eu": "Basque",
  "eu-ES": "Basque (Spain)",
  "be": "Belarusian",
  "be-BY": "Belarusian (Belarus)",
  "bn": "Bengali",
  "bn-BD": "Bengali (Bangladesh)",
  "bn-IN": "Bengali (India)",
  "bs": "Bosnian",
  "bs-BA": "Bosnian (Bosnia & Herzegovina)",
  "bs-Cyrl-BA": "Bosnian (Cyrillic, Bosnia & Herzegovina)",
  "bs-Cyrl": "Bosnian (Cyrillic)",
  "bs-Latn-BA": "Bosnian (Latin, Bosnia & Herzegovina)",
  "bs-Latn": "Bosnian (Latin)",
  "br": "Breton",
  "br-FR": "Breton (France)",
  "bg": "Bulgarian",
  "bg-BG": "Bulgarian (Bulgaria)",
  "my": "Burmese",
  "my-MM": "Burmese (Myanmar (Burma))",
  "ca": "Catalan",
  "ca-AD": "Catalan (Andorra)",
  "ca-FR": "Catalan (France)",
  "ca-IT": "Catalan (Italy)",
  "ca-ES": "Catalan (Spain)",
  "zh": "Chinese",
  "zh-CN": "Chinese (China)",
  "zh-HK": "Chinese (Hong Kong SAR China)",
  "zh-MO": "Chinese (Macau SAR China)",
  "zh-Hans-CN": "Chinese (Simplified, China)",
  "zh-Hans-HK": "Chinese (Simplified, Hong Kong SAR China)",
  "zh-Hans-MO": "Chinese (Simplified, Macau SAR China)",
  "zh-Hans-SG": "Chinese (Simplified, Singapore)",
  "zh-Hans": "Chinese (Simplified)",
  "zh-SG": "Chinese (Singapore)",
  "zh-TW": "Chinese (Taiwan)",
  "zh-Hant-HK": "Chinese (Traditional, Hong Kong SAR China)",
  "zh-Hant-MO": "Chinese (Traditional, Macau SAR China)",
  "zh-Hant-TW": "Chinese (Traditional, Taiwan)",
  "zh-Hant": "Chinese (Traditional)",
  "kw": "Cornish",
  "kw-GB": "Cornish (United Kingdom)",
  "hr": "Croatian",
  "hr-BA": "Croatian (Bosnia & Herzegovina)",
  "hr-HR": "Croatian (Croatia)",
  "cs": "Czech",
  "cs-CZ": "Czech (Czech Republic)",
  "da": "Danish",
  "da-DK": "Danish (Denmark)",
  "da-GL": "Danish (Greenland)",
  "nl": "Dutch",
  "nl-AW": "Dutch (Aruba)",
  "nl-BE": "Dutch (Belgium)",
  "nl-BQ": "Dutch (Caribbean Netherlands)",
  "nl-CW": "Dutch (Curaçao)",
  "nl-NL": "Dutch (Netherlands)",
  "nl-SX": "Dutch (Sint Maarten)",
  "nl-SR": "Dutch (Suriname)",
  "dz": "Dzongkha",
  "dz-BT": "Dzongkha (Bhutan)",
  "en": "English",
  "en-AS": "English (American Samoa)",
  "en-AI": "English (Anguilla)",
  "en-AG": "English (Antigua & Barbuda)",
  "en-AU": "English (Australia)",
  "en-BS": "English (Bahamas)",
  "en-BB": "English (Barbados)",
  "en-BE": "English (Belgium)",
  "en-BZ": "English (Belize)",
  "en-BM": "English (Bermuda)",
  "en-BW": "English (Botswana)",
  "en-IO": "English (British Indian Ocean Territory)",
  "en-VG": "English (British Virgin Islands)",
  "en-CM": "English (Cameroon)",
  "en-CA": "English (Canada)",
  "en-KY": "English (Cayman Islands)",
  "en-CX": "English (Christmas Island)",
  "en-CC": "English (Cocos (Keeling) Islands)",
  "en-CK": "English (Cook Islands)",
  "en-DG": "English (Diego Garcia)",
  "en-DM": "English (Dominica)",
  "en-ER": "English (Eritrea)",
  "en-FK": "English (Falkland Islands)",
  "en-FJ": "English (Fiji)",
  "en-GM": "English (Gambia)",
  "en-GH": "English (Ghana)",
  "en-GI": "English (Gibraltar)",
  "en-GD": "English (Grenada)",
  "en-GU": "English (Guam)",
  "en-GG": "English (Guernsey)",
  "en-GY": "English (Guyana)",
  "en-HK": "English (Hong Kong SAR China)",
  "en-IN": "English (India)",
  "en-IE": "English (Ireland)",
  "en-IM": "English (Isle of Man)",
  "en-JM": "English (Jamaica)",
  "en-JE": "English (Jersey)",
  "en-KE": "English (Kenya)",
  "en-KI": "English (Kiribati)",
  "en-LS": "English (Lesotho)",
  "en-LR": "English (Liberia)",
  "en-MO": "English (Macau SAR China)",
  "en-MG": "English (Madagascar)",
  "en-MW": "English (Malawi)",
  "en-MY": "English (Malaysia)",
  "en-MT": "English (Malta)",
  "en-MH": "English (Marshall Islands)",
  "en-MU": "English (Mauritius)",
  "en-FM": "English (Micronesia)",
  "en-MS": "English (Montserrat)",
  "en-NA": "English (Namibia)",
  "en-NR": "English (Nauru)",
  "en-NZ": "English (New Zealand)",
  "en-NG": "English (Nigeria)",
  "en-NU": "English (Niue)",
  "en-NF": "English (Norfolk Island)",
  "en-MP": "English (Northern Mariana Islands)",
  "en-PK": "English (Pakistan)",
  "en-PW": "English (Palau)",
  "en-PG": "English (Papua New Guinea)",
  "en-PH": "English (Philippines)",
  "en-PN": "English (Pitcairn Islands)",
  "en-PR": "English (Puerto Rico)",
  "en-RW": "English (Rwanda)",
  "en-WS": "English (Samoa)",
  "en-SC": "English (Seychelles)",
  "en-SL": "English (Sierra Leone)",
  "en-SG": "English (Singapore)",
  "en-SX": "English (Sint Maarten)",
  "en-SB": "English (Solomon Islands)",
  "en-ZA": "English (South Africa)",
  "en-SS": "English (South Sudan)",
  "en-SH": "English (St. Helena)",
  "en-KN": "English (St. Kitts & Nevis)",
  "en-LC": "English (St. Lucia)",
  "en-VC": "English (St. Vincent & Grenadines)",
  "en-SD": "English (Sudan)",
  "en-SZ": "English (Swaziland)",
  "en-TZ": "English (Tanzania)",
  "en-TK": "English (Tokelau)",
  "en-TO": "English (Tonga)",
  "en-TT": "English (Trinidad & Tobago)",
  "en-TC": "English (Turks & Caicos Islands)",
  "en-TV": "English (Tuvalu)",
  "en-UM": "English (U.S. Outlying Islands)",
  "en-VI": "English (U.S. Virgin Islands)",
  "en-UG": "English (Uganda)",
  "en-GB": "English (United Kingdom)",
  "en-US": "English (United States)",
  "en-VU": "English (Vanuatu)",
  "en-ZM": "English (Zambia)",
  "en-ZW": "English (Zimbabwe)",
  "eo": "Esperanto",
  "et": "Estonian",
  "et-EE": "Estonian (Estonia)",
  "ee": "Ewe",
  "ee-GH": "Ewe (Ghana)",
  "ee-TG": "Ewe (Togo)",
  "fo": "Faroese",
  "fo-FO": "Faroese (Faroe Islands)",
  "fi": "Finnish",
  "fi-FI": "Finnish (Finland)",
  "fil": "Filipino (Philippines)",
  "fil-PH": "Filipino (Philippines)",
  "fr": "French",
  "fr-DZ": "French (Algeria)",
  "fr-BE": "French (Belgium)",
  "fr-BJ": "French (Benin)",
  "fr-BF": "French (Burkina Faso)",
  "fr-BI": "French (Burundi)",
  "fr-CM": "French (Cameroon)",
  "fr-CA": "French (Canada)",
  "fr-CF": "French (Central African Republic)",
  "fr-TD": "French (Chad)",
  "fr-KM": "French (Comoros)",
  "fr-CG": "French (Congo - Brazzaville)",
  "fr-CD": "French (Congo - Kinshasa)",
  "fr-CI": "French (Côte d’Ivoire)",
  "fr-DJ": "French (Djibouti)",
  "fr-GQ": "French (Equatorial Guinea)",
  "fr-FR": "French (France)",
  "fr-GF": "French (French Guiana)",
  "fr-PF": "French (French Polynesia)",
  "fr-GA": "French (Gabon)",
  "fr-GP": "French (Guadeloupe)",
  "fr-GN": "French (Guinea)",
  "fr-HT": "French (Haiti)",
  "fr-LU": "French (Luxembourg)",
  "fr-MG": "French (Madagascar)",
  "fr-ML": "French (Mali)",
  "fr-MQ": "French (Martinique)",
  "fr-MR": "French (Mauritania)",
  "fr-MU": "French (Mauritius)",
  "fr-YT": "French (Mayotte)",
  "fr-MC": "French (Monaco)",
  "fr-MA": "French (Morocco)",
  "fr-NC": "French (New Caledonia)",
  "fr-NE": "French (Niger)",
  "fr-RE": "French (Réunion)",
  "fr-RW": "French (Rwanda)",
  "fr-SN": "French (Senegal)",
  "fr-SC": "French (Seychelles)",
  "fr-BL": "French (St. Barthélemy)",
  "fr-MF": "French (St. Martin)",
  "fr-PM": "French (St. Pierre & Miquelon)",
  "fr-CH": "French (Switzerland)",
  "fr-SY": "French (Syria)",
  "fr-TG": "French (Togo)",
  "fr-TN": "French (Tunisia)",
  "fr-VU": "French (Vanuatu)",
  "fr-WF": "French (Wallis & Futuna)",
  "ff": "Fulah",
  "ff-CM": "Fulah (Cameroon)",
  "ff-GN": "Fulah (Guinea)",
  "ff-MR": "Fulah (Mauritania)",
  "ff-SN": "Fulah (Senegal)",
  "gl": "Galician",
  "gl-ES": "Galician (Spain)",
  "lg": "Ganda",
  "lg-UG": "Ganda (Uganda)",
  "ka": "Georgian",
  "ka-GE": "Georgian (Georgia)",
  "de": "German",
  "de-AT": "German (Austria)",
  "de-BE": "German (Belgium)",
  "de-DE": "German (Germany)",
  "de-LI": "German (Liechtenstein)",
  "de-LU": "German (Luxembourg)",
  "de-CH": "German (Switzerland)",
  "el": "Greek",
  "el-CY": "Greek (Cyprus)",
  "el-GR": "Greek (Greece)",
  "gu": "Gujarati",
  "gu-IN": "Gujarati (India)",
  "ha": "Hausa",
  "ha-GH": "Hausa (Ghana)",
  "ha-Latn-GH": "Hausa (Latin, Ghana)",
  "ha-Latn-NE": "Hausa (Latin, Niger)",
  "ha-Latn-NG": "Hausa (Latin, Nigeria)",
  "ha-Latn": "Hausa (Latin)",
  "ha-NE": "Hausa (Niger)",
  "ha-NG": "Hausa (Nigeria)",
  "he": "Hebrew",
  "he-IL": "Hebrew (Israel)",
  "hi": "Hindi",
  "hi-IN": "Hindi (India)",
  "hu": "Hungarian",
  "hu-HU": "Hungarian (Hungary)",
  "is": "Icelandic",
  "is-IS": "Icelandic (Iceland)",
  "ig": "Igbo",
  "ig-NG": "Igbo (Nigeria)",
  "id": "Indonesian",
  "id-ID": "Indonesian (Indonesia)",
  "ga": "Irish",
  "ga-IE": "Irish (Ireland)",
  "it": "Italian",
  "it-IT": "Italian (Italy)",
  "it-SM": "Italian (San Marino)",
  "it-CH": "Italian (Switzerland)",
  "ja": "Japanese",
  "ja-JP": "Japanese (Japan)",
  "kl": "Kalaallisut",
  "kl-GL": "Kalaallisut (Greenland)",
  "kn": "Kannada",
  "kn-IN": "Kannada (India)",
  "ks": "Kashmiri",
  "ks-Arab-IN": "Kashmiri (Arabic, India)",
  "ks-Arab": "Kashmiri (Arabic)",
  "ks-IN": "Kashmiri (India)",
  "kk": "Kazakh",
  "kk-Cyrl-KZ": "Kazakh (Cyrillic, Kazakhstan)",
  "kk-Cyrl": "Kazakh (Cyrillic)",
  "kk-KZ": "Kazakh (Kazakhstan)",
  "km": "Khmer",
  "km-KH": "Khmer (Cambodia)",
  "ki": "Kikuyu",
  "ki-KE": "Kikuyu (Kenya)",
  "rw": "Kinyarwanda",
  "rw-RW": "Kinyarwanda (Rwanda)",
  "ko": "Korean",
  "ko-KP": "Korean (North Korea)",
  "ko-KR": "Korean (South Korea)",
  "ky": "Kyrgyz",
  "ky-Cyrl-KG": "Kyrgyz (Cyrillic, Kyrgyzstan)",
  "ky-Cyrl": "Kyrgyz (Cyrillic)",
  "ky-KG": "Kyrgyz (Kyrgyzstan)",
  "lo": "Lao",
  "lo-LA": "Lao (Laos)",
  "lv": "Latvian",
  "lv-LV": "Latvian (Latvia)",
  "ln": "Lingala",
  "ln-AO": "Lingala (Angola)",
  "ln-CF": "Lingala (Central African Republic)",
  "ln-CG": "Lingala (Congo - Brazzaville)",
  "ln-CD": "Lingala (Congo - Kinshasa)",
  "lt": "Lithuanian",
  "lt-LT": "Lithuanian (Lithuania)",
  "lu": "Luba-Katanga",
  "lu-CD": "Luba-Katanga (Congo - Kinshasa)",
  "lb": "Luxembourgish",
  "lb-LU": "Luxembourgish (Luxembourg)",
  "mk": "Macedonian",
  "mk-MK": "Macedonian (Macedonia)",
  "mg": "Malagasy",
  "mg-MG": "Malagasy (Madagascar)",
  "ms": "Malay",
  "ms-BN": "Malay (Brunei)",
  "ms-Latn-BN": "Malay (Latin, Brunei)",
  "ms-Latn-MY": "Malay (Latin, Malaysia)",
  "ms-Latn-SG": "Malay (Latin, Singapore)",
  "ms-Latn": "Malay (Latin)",
  "ms-MY": "Malay (Malaysia)",
  "ms-SG": "Malay (Singapore)",
  "ml": "Malayalam",
  "ml-IN": "Malayalam (India)",
  "mt": "Maltese",
  "mt-MT": "Maltese (Malta)",
  "gv": "Manx",
  "gv-IM": "Manx (Isle of Man)",
  "mr": "Marathi",
  "mr-IN": "Marathi (India)",
  "mn": "Mongolian",
  "mn-Cyrl-MN": "Mongolian (Cyrillic, Mongolia)",
  "mn-Cyrl": "Mongolian (Cyrillic)",
  "mn-MN": "Mongolian (Mongolia)",
  "ne": "Nepali",
  "ne-IN": "Nepali (India)",
  "ne-NP": "Nepali (Nepal)",
  "nd": "North Ndebele",
  "nd-ZW": "North Ndebele (Zimbabwe)",
  "se": "Northern Sami",
  "se-FI": "Northern Sami (Finland)",
  "se-NO": "Northern Sami (Norway)",
  "se-SE": "Northern Sami (Sweden)",
  "no": "Norwegian",
  "no-NO": "Norwegian (Norway)",
  "nb": "Norwegian Bokmål",
  "nb-NO": "Norwegian Bokmål (Norway)",
  "nb-SJ": "Norwegian Bokmål (Svalbard & Jan Mayen)",
  "nn": "Norwegian Nynorsk",
  "nn-NO": "Norwegian Nynorsk (Norway)",
  "or": "Oriya",
  "or-IN": "Oriya (India)",
  "om": "Oromo",
  "om-ET": "Oromo (Ethiopia)",
  "om-KE": "Oromo (Kenya)",
  "os": "Ossetic",
  "os-GE": "Ossetic (Georgia)",
  "os-RU": "Ossetic (Russia)",
  "ps": "Pashto",
  "ps-AF": "Pashto (Afghanistan)",
  "fa": "Persian",
  "fa-AF": "Persian (Afghanistan)",
  "fa-IR": "Persian (Iran)",
  "pl": "Polish",
  "pl-PL": "Polish (Poland)",
  "pt": "Portuguese",
  "pt-AO": "Portuguese (Angola)",
  "pt-BR": "Portuguese (Brazil)",
  "pt-CV": "Portuguese (Cape Verde)",
  "pt-GW": "Portuguese (Guinea-Bissau)",
  "pt-MO": "Portuguese (Macau SAR China)",
  "pt-MZ": "Portuguese (Mozambique)",
  "pt-PT": "Portuguese (Portugal)",
  "pt-ST": "Portuguese (São Tomé & Príncipe)",
  "pt-TL": "Portuguese (Timor-Leste)",
  "pa": "Punjabi",
  "pa-Arab-PK": "Punjabi (Arabic, Pakistan)",
  "pa-Arab": "Punjabi (Arabic)",
  "pa-Guru-IN": "Punjabi (Gurmukhi, India)",
  "pa-Guru": "Punjabi (Gurmukhi)",
  "pa-IN": "Punjabi (India)",
  "pa-PK": "Punjabi (Pakistan)",
  "qu": "Quechua",
  "qu-BO": "Quechua (Bolivia)",
  "qu-EC": "Quechua (Ecuador)",
  "qu-PE": "Quechua (Peru)",
  "ro": "Romanian",
  "ro-MD": "Romanian (Moldova)",
  "ro-RO": "Romanian (Romania)",
  "rm": "Romansh",
  "rm-CH": "Romansh (Switzerland)",
  "rn": "Rundi",
  "rn-BI": "Rundi (Burundi)",
  "ru": "Russian",
  "ru-BY": "Russian (Belarus)",
  "ru-KZ": "Russian (Kazakhstan)",
  "ru-KG": "Russian (Kyrgyzstan)",
  "ru-MD": "Russian (Moldova)",
  "ru-RU": "Russian (Russia)",
  "ru-UA": "Russian (Ukraine)",
  "sg": "Sango",
  "sg-CF": "Sango (Central African Republic)",
  "gd": "Scottish Gaelic",
  "gd-GB": "Scottish Gaelic (United Kingdom)",
  "sr": "Serbian",
  "sr-BA": "Serbian (Bosnia & Herzegovina)",
  "sr-Cyrl-BA": "Serbian (Cyrillic, Bosnia & Herzegovina)",
  "sr-Cyrl-XK": "Serbian (Cyrillic, Kosovo)",
  "sr-Cyrl-ME": "Serbian (Cyrillic, Montenegro)",
  "sr-Cyrl-RS": "Serbian (Cyrillic, Serbia)",
  "sr-Cyrl": "Serbian (Cyrillic)",
  "sr-XK": "Serbian (Kosovo)",
  "sr-Latn-BA": "Serbian (Latin, Bosnia & Herzegovina)",
  "sr-Latn-XK": "Serbian (Latin, Kosovo)",
  "sr-Latn-ME": "Serbian (Latin, Montenegro)",
  "sr-Latn-RS": "Serbian (Latin, Serbia)",
  "sr-Latn": "Serbian (Latin)",
  "sr-ME": "Serbian (Montenegro)",
  "sr-RS": "Serbian (Serbia)",
  "sh": "Serbo-Croatian",
  "sh-BA": "Serbo-Croatian (Bosnia & Herzegovina)",
  "sn": "Shona",
  "sn-ZW": "Shona (Zimbabwe)",
  "ii": "Sichuan Yi",
  "ii-CN": "Sichuan Yi (China)",
  "si": "Sinhala",
  "si-LK": "Sinhala (Sri Lanka)",
  "sk": "Slovak",
  "sk-SK": "Slovak (Slovakia)",
  "sl": "Slovenian",
  "sl-SI": "Slovenian (Slovenia)",
  "so": "Somali",
  "so-DJ": "Somali (Djibouti)",
  "so-ET": "Somali (Ethiopia)",
  "so-KE": "Somali (Kenya)",
  "so-SO": "Somali (Somalia)",
  "es": "Spanish",
  "es-AR": "Spanish (Argentina)",
  "es-BO": "Spanish (Bolivia)",
  "es-IC": "Spanish (Canary Islands)",
  "es-EA": "Spanish (Ceuta & Melilla)",
  "es-CL": "Spanish (Chile)",
  "es-CO": "Spanish (Colombia)",
  "es-CR": "Spanish (Costa Rica)",
  "es-CU": "Spanish (Cuba)",
  "es-DO": "Spanish (Dominican Republic)",
  "es-EC": "Spanish (Ecuador)",
  "es-SV": "Spanish (El Salvador)",
  "es-GQ": "Spanish (Equatorial Guinea)",
  "es-GT": "Spanish (Guatemala)",
  "es-HN": "Spanish (Honduras)",
  "es-MX": "Spanish (Mexico)",
  "es-NI": "Spanish (Nicaragua)",
  "es-PA": "Spanish (Panama)",
  "es-PY": "Spanish (Paraguay)",
  "es-PE": "Spanish (Peru)",
  "es-PH": "Spanish (Philippines)",
  "es-PR": "Spanish (Puerto Rico)",
  "es-ES": "Spanish (Spain)",
  "es-US": "Spanish (United States)",
  "es-UY": "Spanish (Uruguay)",
  "es-VE": "Spanish (Venezuela)",
  "es-419": "Spanish (Latin America)",
  "sr-CS": "Serbian",
  "sw": "Swahili",
  "sw-KE": "Swahili (Kenya)",
  "sw-TZ": "Swahili (Tanzania)",
  "sw-UG": "Swahili (Uganda)",
  "sv": "Swedish",
  "sv-AX": "Swedish (Åland Islands)",
  "sv-FI": "Swedish (Finland)",
  "sv-SE": "Swedish (Sweden)",
  "gsw": "Swiss German",
  "tl": "Tagalog",
  "tl-PH": "Tagalog (Philippines)",
  "ta": "Tamil",
  "ta-IN": "Tamil (India)",
  "ta-MY": "Tamil (Malaysia)",
  "ta-SG": "Tamil (Singapore)",
  "ta-LK": "Tamil (Sri Lanka)",
  "te": "Telugu",
  "te-IN": "Telugu (India)",
  "th": "Thai",
  "th-TH": "Thai (Thailand)",
  "bo": "Tibetan",
  "bo-CN": "Tibetan (China)",
  "bo-IN": "Tibetan (India)",
  "ti": "Tigrinya",
  "ti-ER": "Tigrinya (Eritrea)",
  "ti-ET": "Tigrinya (Ethiopia)",
  "to": "Tongan",
  "to-TO": "Tongan (Tonga)",
  "tr": "Turkish",
  "tr-CY": "Turkish (Cyprus)",
  "tr-TR": "Turkish (Turkey)",
  "uk": "Ukrainian",
  "uk-UA": "Ukrainian (Ukraine)",
  "ur": "Urdu",
  "ur-IN": "Urdu (India)",
  "ur-PK": "Urdu (Pakistan)",
  "ug": "Uyghur",
  "ug-Arab-CN": "Uyghur (Arabic, China)",
  "ug-Arab": "Uyghur (Arabic)",
  "ug-CN": "Uyghur (China)",
  "uz": "Uzbek",
  "uz-AF": "Uzbek (Afghanistan)",
  "uz-Arab-AF": "Uzbek (Arabic, Afghanistan)",
  "uz-Arab": "Uzbek (Arabic)",
  "uz-Cyrl-UZ": "Uzbek (Cyrillic, Uzbekistan)",
  "uz-Cyrl": "Uzbek (Cyrillic)",
  "uz-Latn-UZ": "Uzbek (Latin, Uzbekistan)",
  "uz-Latn": "Uzbek (Latin)",
  "uz-UZ": "Uzbek (Uzbekistan)",
  "vi": "Vietnamese",
  "vi-VN": "Vietnamese (Vietnam)",
  "cy": "Welsh",
  "cy-GB": "Welsh (United Kingdom)",
  "fy": "Western Frisian",
  "fy-NL": "Western Frisian (Netherlands)",
  "yi": "Yiddish",
  "yo": "Yoruba",
  "yo-BJ": "Yoruba (Benin)",
  "yo-NG": "Yoruba (Nigeria)",
  "zu": "Zulu",
  "zu-ZA": "Zulu (South Africa)"
};
const localesKeys = Object.keys(locales);
const getLocale = _.memoize(
  (locale) => localesKeys.find((it) => it.toLowerCase() === locale.toLowerCase().replace("_", "-"))
);
_.memoize((text) => {
  const normalizedText = getNormalizedText(text);
  const filteredLocales = localesKeys.filter((l) => normalizedText === l.toLowerCase());
  return _.maxBy((l) => l.length, filteredLocales) || text;
});
const getNormalizedText = (text) => {
  if (text.length === 2) {
    return text;
  }
  const normalizedText = text.replace(/_/g, "-").toLowerCase().split("-");
  if (normalizedText.length === 1) {
    return text;
  }
  if (normalizedText[0].length > 2) {
    normalizedText.shift();
  }
  return normalizedText.join("-");
};
const defaultSettings = {
  window: {
    width: 1024,
    height: 768
  },
  customSettings: {
    translationEngine: "google",
    googleTranslateApiKey: "",
    awsTranslateApiKey: "",
    deepLTranslateApiKey: "",
    iobrokerTranslateApiKey: "",
    sortOnSave: "sort",
    spacesIndentation: "detect",
    translationFrom: "en",
    translationTo: ["en"],
    translationMode: "this",
    translationOverwrite: false
  },
  recentFolders: []
};
const settingsFilePath = path__namespace.join(electron.app.getPath("userData"), "settings.json");
const getSavedSettings = () => {
  const existsSettingsFile = fs__namespace.existsSync(settingsFilePath);
  if (!existsSettingsFile) {
    return defaultSettings;
  }
  const file = fs__namespace.readFileSync(settingsFilePath);
  const parsed = JSON.parse(file.toString());
  return ___namespace.merge(defaultSettings, parsed);
};
const saveSettings = (settings2) => {
  fs__namespace.writeFileSync(settingsFilePath, JSON.stringify(settings2, null, 2));
  return getSavedSettings();
};
const getCustomSettings = () => {
  return getSavedSettings().customSettings || {};
};
const saveCustomSettings = (data) => {
  const settings2 = getSavedSettings();
  settings2.customSettings = data;
  saveSettings(settings2);
  return getCustomSettings();
};
const getRecentFolders = () => {
  return getSavedSettings().recentFolders || [];
};
const addRecentFolder = (folderPath) => {
  const settings2 = getSavedSettings();
  settings2.recentFolders.unshift(folderPath);
  settings2.recentFolders = ___namespace.uniq(settings2.recentFolders).slice(0, 20);
  saveSettings(settings2);
  return settings2.recentFolders;
};
const removeRecentFolder = (folderPath) => {
  const settings2 = getSavedSettings();
  settings2.recentFolders = ___namespace.uniq(settings2.recentFolders).filter((it) => it !== folderPath).slice(0, 10);
  saveSettings(settings2);
  return settings2.recentFolders;
};
const fileExtensions$1 = [".json", ".arb"];
const parse$1 = (content) => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return Promise.resolve(void 0);
  }
};
const serialize$1 = async (data, format) => {
  try {
    const settings2 = getSavedSettings();
    let spacesIndent;
    if (settings2.customSettings.spacesIndentation === "detect" || !settings2.customSettings.spacesIndentation) {
      spacesIndent = format?.indent || 2;
    } else if (settings2.customSettings.spacesIndentation === "2") {
      spacesIndent = 2;
    } else if (settings2.customSettings.spacesIndentation === "4") {
      spacesIndent = 4;
    } else if (settings2.customSettings.spacesIndentation === "tab") {
      spacesIndent = "	";
    } else {
      spacesIndent = 2;
    }
    let text = JSON.stringify(data, null, spacesIndent);
    if (format?.crlf) {
      if (format.crlf === "\r") {
        text = text.replace(/\n/g, "\r");
      } else if (format.crlf === "\r\n") {
        text = text.replace(/\n/g, "\r\n");
      }
      console.log(`Use settings: tab=${spacesIndent === "	" ? "tab" : spacesIndent}, crlf=${format?.crlf === "\r\n" ? "crlf" : format?.crlf === "\n" ? "cr" : "lf"}`);
    } else {
      console.log(`Use settings: tab=${spacesIndent === "	" ? "tab" : spacesIndent}`);
    }
    return text;
  } catch (e) {
    return void 0;
  }
};
const jsonPlugin = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fileExtensions: fileExtensions$1,
  parse: parse$1,
  serialize: serialize$1
}, Symbol.toStringTag, { value: "Module" }));
const fileExtensions = [".yaml", ".yml"];
const parse = (content) => {
  try {
    return yaml__namespace.load(content);
  } catch (e) {
    return Promise.resolve(void 0);
  }
};
const serialize = async (data, format) => {
  try {
    return yaml__namespace.dump(data);
  } catch (e) {
    return void 0;
  }
};
const yamlPlugin = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fileExtensions,
  parse,
  serialize
}, Symbol.toStringTag, { value: "Module" }));
let plugins = [jsonPlugin, yamlPlugin];
const getPlugins = () => plugins;
const readdirAsync = util__namespace.promisify(fs__namespace.readdir);
const readFileAsync = util__namespace.promisify(fs__namespace.readFile);
const writeFileAsync = util__namespace.promisify(fs__namespace.writeFile);
const statAsync = util__namespace.promisify(fs__namespace.stat);
const DEFAULT_GROUP_NAME = "Unknown Prefix";
const loadFolder = async (folderPath) => {
  const folderContent = await readdirAsync(folderPath);
  const stats = await getFolderStats(folderPath, folderContent);
  const groupedFiles = await getGroupedFiles(folderPath, folderContent, stats);
  const groupedLanguageFolders = await getGroupedLanguageFolders(folderPath, folderContent, stats);
  const subFolders = await getSubFolders(folderPath, folderContent, stats);
  return groupedFiles.concat(groupedLanguageFolders).concat(subFolders);
};
const parseFile = async (filePath) => {
  try {
    const fileContent = await readFileAsync(filePath);
    const plugin = getPluginForFile(filePath);
    if (!plugin) {
      return {};
    }
    const data = await plugin.parse(fileContent.toString());
    return data ?? {};
  } catch (e) {
    return void 0;
  }
};
function detectIndent(data) {
  let crlf;
  const text = data.toString();
  if (text.includes("\r\n")) {
    crlf = "\r\n";
  } else if (text.includes("\r")) {
    crlf = "\r";
  } else {
    crlf = "\n";
  }
  let indent;
  const lines = data.toString().split("\n");
  const line = lines.find((l) => l.match(/^\s/));
  if (line) {
    if (line.startsWith("    ")) {
      indent = 4;
    } else if (line.startsWith("  ")) {
      indent = 2;
    } else if (line.startsWith("	")) {
      indent = "	";
    }
  }
  return { indent, crlf };
}
const saveFile = async (parsedFile) => {
  try {
    const plugin = getPluginForFile(parsedFile.filePath);
    const fileContent = await readFileAsync(parsedFile.filePath);
    const indent = detectIndent(fileContent);
    const data = await plugin.parse(fileContent.toString());
    const updatedData = mergeDrop(data, parsedFile.data);
    const settings2 = getSavedSettings();
    let serializedContent;
    if (settings2.customSettings.sortOnSave !== "no sort") {
      const sortedData = sortObjectDeeply(updatedData);
      serializedContent = await plugin.serialize(sortedData, indent);
    } else {
      serializedContent = await plugin.serialize(updatedData, indent);
    }
    if (serializedContent === null || serializedContent === void 0) {
      return false;
    }
    await writeFileAsync(parsedFile.filePath, serializedContent);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
const order = (unordered) => Object.keys(unordered).sort().reduce((obj, key) => {
  obj[key] = unordered[key];
  return obj;
}, {});
const sortObjectDeeply = (object) => {
  for (let [key, value] of Object.entries(object)) {
    if (typeof value === "object") {
      object[key] = sortObjectDeeply(value);
    }
  }
  return order(object);
};
const mergeDrop = (obj1, obj2) => {
  if (!obj1 || !obj2) return obj2;
  const obj1Keys = Object.keys(obj1);
  for (let i = 0; i < obj1Keys.length; i++) {
    const key = obj1Keys[i];
    if (obj2[key] === void 0) {
      Reflect.deleteProperty(obj1, key);
    } else if (typeof obj2[key] === "object") {
      Reflect.set(obj1, key, mergeDrop(obj1[key], obj2[key]));
    }
  }
  const obj2Keys = Object.keys(obj2);
  for (let i = 0; i < obj2Keys.length; i++) {
    const key = obj2Keys[i];
    if (typeof obj2[key] === "string") {
      Reflect.set(obj1, key, obj2[key]);
    } else if (typeof obj2[key] === "object") {
      Reflect.set(obj1, key, mergeDrop(obj1[key], obj2[key]));
    }
  }
  return obj1;
};
const getPluginForFile = (filePath) => getPlugins().filter((plugin) => pluginSupportsFileExtension(plugin, filePath))[0];
const pluginSupportsFileExtension = (plugin, filePath) => plugin.fileExtensions.filter((extension) => filePath.toLowerCase().endsWith(extension)).length > 0;
const getGroupedFiles = async (folderPath, folderContent, stats) => {
  const files = folderContent.filter((it) => !stats[it].isDirectory()).map((it) => getFileDetails(it, path__namespace.join(folderPath, it))).filter(Boolean);
  return parseFilesWithGroup(folderPath, files);
};
const getGroupedLanguageFolders = async (folderPath, folderContent, stats) => {
  const languageFolders = folderContent.filter((it) => stats[it].isDirectory() && getLocale(it));
  const foldersFiles = (await Promise.all(
    languageFolders.map(async (folder) => {
      const languageFolderPath = path__namespace.join(folderPath, folder);
      const folderItems = await readdirAsync(languageFolderPath);
      const folderStats = await getFolderStats(languageFolderPath, folderItems);
      return {
        [folder]: folderItems.filter((it) => !folderStats[it].isDirectory())
      };
    })
  )).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  const files = ___namespace.flatMap(
    Object.entries(foldersFiles).map(
      ([folder, folderFiles]) => folderFiles.map((file) => {
        const fileName = getFileNameWithoutExtension(file);
        return {
          fileName: file,
          filePath: path__namespace.join(folderPath, folder, file),
          language: folder,
          prefix: fileName
        };
      })
    )
  );
  return parseFilesWithGroup(folderPath, files);
};
const getSubFolders = async (folderPath, folderContent, stats) => {
  const folders = folderContent.filter((it) => stats[it].isDirectory() && !getLocale(it));
  return Promise.all(
    folders.map(async (it) => {
      const items = await loadFolder(path__namespace.join(folderPath, it));
      return {
        items,
        type: "folder",
        name: it
      };
    })
  );
};
const parseFilesWithGroup = async (folderPath, files) => {
  const groupedByPrefix = ___namespace.groupBy(files, (it) => it.prefix);
  const entries = Object.entries(groupedByPrefix);
  return ___namespace.flatMap(
    await Promise.all(
      entries.map(async ([prefix, items]) => {
        const groupFiles = (await parseFilesFromDetails(items)).filter(Boolean);
        return {
          type: "file",
          name: prefix,
          items: groupFiles
        };
      })
    )
  ).filter((it) => it.items.length > 0);
};
const parseFilesFromDetails = async (items) => await Promise.all(items.map(parseFileFromDetails));
const parseFileFromDetails = async (details) => {
  const plugin = getPluginForFile(details.fileName);
  if (!plugin) {
    return void 0;
  }
  const fileContent = await parseFile(details.filePath);
  return {
    ...details,
    extension: path__namespace.extname(details.fileName),
    data: fileContent
  };
};
const getFolderStats = async (folderPath, folderContent) => {
  const stats = {};
  for (const item of folderContent) {
    stats[item] = await statAsync(path__namespace.join(folderPath, item));
  }
  return stats;
};
const getFileNameWithoutExtension = (fileName) => fileName.split(".").slice(0, -1).join(".");
const separators = /[._]/g;
const getFileDetails = (fileName, filePath) => {
  const nameWithoutExtension = getFileNameWithoutExtension(fileName);
  const normalizedName = nameWithoutExtension.replace(separators, "||").split("||");
  const locale = getLocale(nameWithoutExtension);
  if (locale) {
    return {
      fileName,
      filePath,
      language: locale,
      prefix: DEFAULT_GROUP_NAME
    };
  }
  let prefix = normalizedName[0];
  let language;
  for (let i = 1; i < normalizedName.length; i++) {
    const lang = getLocale(normalizedName.slice(i).join("-"));
    if (lang) {
      prefix = nameWithoutExtension.substr(
        0,
        nameWithoutExtension.replace(separators, "-").lastIndexOf(lang) - 1
      );
      language = lang;
      break;
    }
  }
  if (!language) {
    language = prefix = nameWithoutExtension;
  }
  return {
    fileName,
    filePath,
    prefix,
    language
  };
};
const getFormattedFoldersPaths = (folders) => {
  return folders.map((folder) => ({
    fullPath: folder,
    folder: path__namespace.basename(folder),
    path: path__namespace.dirname(folder)
  }));
};
const hasWindows = () => electron.BrowserWindow.getAllWindows().length > 0;
const createWindow = () => {
  const window = new electron.BrowserWindow({
    ...getSavedSettings().window,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    icon: path$1.join(__dirname, "../../icons/icon.png"),
    webPreferences: {
      preload: path$1.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    window.loadFile(path$1.join(__dirname, "../renderer/index.html"));
  }
  registerEvents(window);
  return window;
};
const getCurrentWindow = () => electron.BrowserWindow.getFocusedWindow();
const sendOpen = async (window, folderPath, folder) => {
  sendToIpc(window, navigateTo, { path: "/folder" });
  sendToIpc(window, open, folder);
};
const sendSave = ___namespace.debounce((window, data = {}) => {
  sendToIpc(window, save, data);
}, 500);
const sendSaveComplete = (window, data = {}) => {
  sendToIpc(window, saveComplete, data);
};
const sendRefreshFolder = (window, folder) => {
  sendToIpc(window, refreshFolder, folder);
};
const sendShowSettings = (window) => {
  sendToIpc(window, showSettings);
};
const sendSettings = (window, data = {}) => {
  sendToIpc(window, settings, data);
};
const sendRecentFolders = (window, data) => {
  sendToIpc(window, recentFolders, getFormattedFoldersPaths(data));
};
const sendClose = (window) => {
  sendToIpc(window, closeFolder, {});
};
const sendToIpc = (window, message, data) => {
  const send = () => window.webContents.send(message, data);
  if (window.webContents.isLoading()) {
    window.webContents.once("did-finish-load", send);
  } else {
    send();
  }
};
var SaveResponse = /* @__PURE__ */ ((SaveResponse2) => {
  SaveResponse2[SaveResponse2["Save"] = 0] = "Save";
  SaveResponse2[SaveResponse2["Cancel"] = 1] = "Cancel";
  SaveResponse2[SaveResponse2["DontSave"] = 2] = "DontSave";
  return SaveResponse2;
})(SaveResponse || {});
const showSaveDialog = async (window) => {
  const result = await electron.dialog.showMessageBox(window, {
    type: "question",
    buttons: ["Save", "Cancel", "Don't Save"],
    message: "Do you want to save the changes you made?",
    detail: "Your changes will be lost if you don't save them."
  });
  switch (result.response) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    default:
      return 1;
  }
};
const getAvailableWindow = () => electron.BrowserWindow.getAllWindows().filter((w) => !w.isDocumentEdited())[0];
const registerEvents = (window) => {
  window.on("close", onClose(window));
  window.on("resize", ___namespace.debounce(onResize(window), 1e3));
  window.on("ready-to-show", onReadyToShow(window));
};
const onClose = (window) => async (e) => {
  if (!window.isDocumentEdited()) {
    return;
  }
  if (e) {
    e.preventDefault();
  }
  const response = await showSaveDialog(window);
  if (response === 0) {
    sendSave(window, { close: true });
  } else if (response === 2) {
    window.destroy();
  }
};
const onReadyToShow = (window) => () => {
  window.show();
  window.focus();
};
const onResize = (window) => () => {
  const settingsConfig = getSavedSettings();
  const [width, height] = window.getSize();
  settingsConfig.window = {
    ...settingsConfig.window,
    width,
    height
  };
  saveSettings(settingsConfig);
};
const existsAsync = util.promisify(fs.exists);
const openFolder = async (folderPath) => {
  const window = getAvailableWindow() || createWindow();
  await openFolderInWindow(folderPath, window);
};
const openFolderInWindow = async (folderPath, window) => {
  let recentFolders2;
  const isValidPath = await existsAsync(folderPath);
  if (!isValidPath) {
    recentFolders2 = removeRecentFolder(folderPath);
    sendClose(window);
    electron.dialog.showMessageBox(window, {
      type: "error",
      message: `Folder not found in the given path "${folderPath}"`
    });
  } else {
    const parsedFiles = await loadFolder(folderPath);
    await sendOpen(window, folderPath, parsedFiles);
    watchFolder(window, folderPath);
    const parts = folderPath.replace(/\\/g, "/").split("/");
    if (parts[parts.length - 1] === "i18n") {
      parts.pop();
    }
    window.setTitle(`i18n Manager - ${parts.join("/")}`);
    electron.app.addRecentDocument(folderPath);
    recentFolders2 = addRecentFolder(folderPath);
  }
  sendRecentFolders(window, recentFolders2);
};
const saveFolder = async (data) => {
  const parsedFiles = getParsedFiles(data);
  const saveAll = parsedFiles.map((it) => saveFile(it));
  const result = await Promise.all(saveAll);
  return result.map((success, index) => !success ? parsedFiles[index].fileName : void 0).filter(Boolean);
};
const getParsedFiles = (data) => data.map(
  (it) => it.type === "file" ? it.items : getParsedFiles(it.items)
).flat();
const watchFolder = (window, folderPath) => {
  const handleFileUpdate = ___namespace$1.debounce(1e3, async () => {
    const parsedFiles = await loadFolder(folderPath);
    sendRefreshFolder(window, parsedFiles);
  });
  nodeWatch(folderPath, { recursive: true }, handleFileUpdate);
};
const onSave = async (e, data) => {
  const window = electron.BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  const closeWindow = data.data.close;
  const closeDirectory2 = data.data.closeDirectory;
  const folder = data.payload;
  if (folder.length === 0) {
    sendSaveComplete(window, []);
    return;
  }
  const result = await saveFolder(folder);
  sendSaveComplete(window, result);
  if (result.length > 0) {
    electron.dialog.showErrorBox("Failed to save the following files", result.join("\n"));
    return;
  }
  window.setDocumentEdited(false);
  if (closeWindow) {
    window.close();
  }
  if (closeDirectory2) {
    sendClose(window);
  }
};
const onOpen = (e, data) => {
  const window = electron.BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  openFolderInWindow(data, window);
};
const onConvert = (e, files) => {
  if (!Array.isArray(files) || files.length === 0) return;
  sendClose(e.sender);
  const failures = [];
  let parentDir;
  for (const file of files) {
    try {
      const languageDir = path__namespace$1.dirname(file.path);
      parentDir = parentDir ?? path__namespace$1.dirname(languageDir);
      const destination = path__namespace$1.join(parentDir, `${file.language}.json`);
      const data = fs.readFileSync(file.path, "utf8");
      fs.writeFileSync(destination, data);
      fs.unlinkSync(file.path);
      fs.rmSync(languageDir, { recursive: true, force: true });
    } catch (err) {
      failures.push(`${file.path}: ${err?.message ?? err}`);
    }
  }
  if (failures.length > 0) {
    electron.dialog.showErrorBox("Failed to convert the following files", failures.join("\n"));
  }
  if (parentDir) {
    onOpen(e, parentDir);
  }
};
const onDataChanged = (e, data) => {
  const window = electron.BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  window.setDocumentEdited(data);
};
const onGetSettings = (e) => {
  const window = electron.BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  sendSettings(window, getCustomSettings());
};
const onSaveSettings = (e, data) => {
  saveCustomSettings(data);
};
const onOpenFile = (e, data) => {
  if (electron.app.isReady()) {
    openFolder(data);
  } else {
    electron.app.on("ready", () => openFolder(data));
  }
};
const onRecentFolders = (e) => {
  const window = electron.BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  sendRecentFolders(window, getRecentFolders());
};
const registerAppEvents = () => {
  electron.ipcMain.on(open, onOpen);
  electron.ipcMain.on(save, onSave);
  electron.ipcMain.on(convert, onConvert);
  electron.ipcMain.on(dataChanged, onDataChanged);
  electron.ipcMain.on(saveSettings$1, onSaveSettings);
  electron.ipcMain.on(settings, onGetSettings);
  electron.ipcMain.on(recentFolders, onRecentFolders);
  electron.ipcMain.on("open-external", (_e, url) => {
    void electron.shell.openExternal(url);
  });
  electron.app.on("open-file", onOpenFile);
};
const onPreferencesClick = () => {
  const window = getCurrentWindow();
  if (!window) {
    return;
  }
  sendShowSettings(window);
};
let appMenu = {};
if (process.platform === "darwin") {
  appMenu = {
    label: electron.app.name,
    submenu: [
      { role: "about" },
      { type: "separator" },
      {
        label: "Preferences",
        click: onPreferencesClick,
        accelerator: "CommandOrControl+,"
      },
      { type: "separator" },
      { role: "services", submenu: [] },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" }
    ]
  };
}
const appMenu$1 = appMenu;
const editMenu = {
  label: "Edit",
  submenu: [
    { role: "undo" },
    { role: "redo" },
    { type: "separator" },
    { role: "cut" },
    { role: "copy" },
    { role: "paste" },
    { role: "pasteAndMatchStyle" },
    { role: "delete" },
    { role: "selectAll" }
  ]
};
if (process.platform === "darwin") {
  editMenu.submenu.push(
    { type: "separator" },
    {
      label: "Speech",
      submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
    }
  );
}
const newWindow = () => createWindow();
const openDirectory = async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  if (result) {
    openFolder(result.filePaths[0]);
  }
};
const closeDirectory = async () => {
  const currentWindow = getCurrentWindow();
  if (!currentWindow) {
    return;
  }
  currentWindow.setTitle(`i18n Manager`);
  if (!currentWindow.isDocumentEdited()) {
    sendClose(currentWindow);
    return;
  }
  const response = await showSaveDialog(currentWindow);
  if (response === SaveResponse.Save) {
    sendSave(currentWindow, { closeDirectory: true });
  } else if (response === SaveResponse.DontSave) {
    sendClose(currentWindow);
  }
};
const saveDirectory = () => {
  const currentWindow = getCurrentWindow();
  if (currentWindow) {
    sendSave(currentWindow);
  }
};
const fileMenu = {
  label: "File",
  submenu: [
    {
      label: "New Window",
      click: newWindow,
      accelerator: "CommandOrControl+Shift+N"
    },
    { type: "separator" },
    {
      label: "Open Folder",
      click: openDirectory,
      accelerator: "CommandOrControl+O"
    },
    {
      label: "Close Folder",
      click: closeDirectory,
      accelerator: "CommandOrControl+W"
    },
    { type: "separator" },
    {
      label: "Save",
      click: saveDirectory,
      accelerator: "CommandOrControl+S"
    }
  ]
};
if (process.platform === "linux") {
  fileMenu.submenu.push(
    { type: "separator" },
    {
      label: "Preferences",
      click: onPreferencesClick,
      accelerator: "CommandOrControl+,"
    }
  );
}
const helpMenu = {
  role: "help",
  submenu: [
    {
      label: "Project Repository",
      click: () => electron.shell.openExternal("https://github.com/gilmarsquinelato/i18n-manager")
    },
    {
      label: "Toggle Developer Tools",
      accelerator: "CommandOrControl+Shift+I",
      click: (_menuItem, window) => {
        if (window instanceof electron.BrowserWindow) {
          window.webContents.toggleDevTools();
        }
      }
    }
  ]
};
const isDev = utils.is.dev;
const viewMenu = {
  label: "View",
  submenu: [
    { role: "resetZoom" },
    { role: "zoomIn" },
    { role: "zoomOut" },
    { type: "separator" },
    { role: "togglefullscreen" }
  ]
};
if (isDev) {
  viewMenu.submenu.unshift(
    { role: "reload" },
    { role: "forcereload" },
    { role: "toggledevtools" },
    { type: "separator" }
  );
}
const windowMenu = {
  role: "window",
  submenu: [{ role: "minimize" }, { role: "close" }]
};
if (process.platform === "darwin") {
  windowMenu.submenu.push(
    { role: "close" },
    { role: "minimize" },
    { role: "zoom" },
    { type: "separator" },
    { role: "front" }
  );
}
if (process.platform === "win32") {
  windowMenu.submenu.push(
    { type: "separator" },
    {
      label: "Preferences",
      click: onPreferencesClick,
      accelerator: "CommandOrControl+,"
    }
  );
}
const menuTemplate = [];
if (Object.keys(appMenu$1).length > 0) {
  menuTemplate.push(appMenu$1);
}
menuTemplate.push(fileMenu);
menuTemplate.push(editMenu);
menuTemplate.push(viewMenu);
menuTemplate.push(windowMenu);
menuTemplate.push(helpMenu);
const getMenu = () => electron.Menu.buildFromTemplate(menuTemplate);
const loadMenu = () => electron.Menu.setApplicationMenu(getMenu());
registerAppEvents();
electron.app.name = "i18n Manager";
if (process.platform === "darwin") {
  electron.app.setAboutPanelOptions({
    applicationName: "i18n Manager",
    applicationVersion: electron.app.getVersion(),
    copyright: "https://www.github.com/gilmarsquinelato",
    credits: "Gilmar Quinelato",
    version: electron.app.getVersion()
  });
}
const openConsole = (window) => {
  if (utils.is.dev) {
    window.webContents.openDevTools();
  }
};
electron.app.on("ready", () => {
  loadMenu();
  const window = createWindow();
  openConsole(window);
});
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
electron.app.on("activate", () => {
  if (!hasWindows()) {
    createWindow();
  }
});
