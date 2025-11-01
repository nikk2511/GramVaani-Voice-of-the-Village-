import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: 'Our Voice, Our Rights',
      selectDistrict: 'Select Your District',
      useMyLocation: 'Use My Location',
      peopleBenefited: 'People Who Got Work',
      peopleBenefitedDesc: 'Number of people who received paid work',
      expenditure: 'Amount Spent',
      expenditureDesc: 'Total money spent on MGNREGA works',
      persondays: 'Work Days Created',
      persondaysDesc: 'Total number of work days generated',
      averagePersondays: 'Average Work Days',
      worksStarted: 'Works Started',
      worksCompleted: 'Works Completed',
      lastUpdated: 'Last Updated',
      dataMayBeOld: 'Data may be old',
      compareWithState: 'Compare with State Average',
      compareWithDistrict: 'Compare with Another District',
      historicalTrends: 'Historical Trends',
      month: 'Month',
      statusGood: 'Good Performance',
      statusAverage: 'Average Performance',
      statusPoor: 'Needs Improvement',
      explainThis: 'Explain This',
      playVoice: 'Play Voice',
      stopVoice: 'Stop Voice',
      language: 'Language',
      about: 'About',
      dataSource: 'Data Source',
      feedback: 'Feedback',
      loading: 'Loading...',
      error: 'Error',
      noData: 'No data available',
      searchDistrict: 'Search district...',
    },
  },
  hi: {
    translation: {
      appName: 'हमारी आवाज़, हमारे अधिकार',
      selectDistrict: 'अपना जिला चुनें',
      useMyLocation: 'मेरी लोकेशन उपयोग करें',
      peopleBenefited: 'काम पाने वाले लोग',
      peopleBenefitedDesc: 'भुगतान कार्य प्राप्त करने वाले लोगों की संख्या',
      expenditure: 'खर्च की गई राशि',
      expenditureDesc: 'MGNREGA कार्यों पर खर्च की गई कुल राशि',
      persondays: 'बनाए गए काम के दिन',
      persondaysDesc: 'उत्पन्न काम के दिनों की कुल संख्या',
      averagePersondays: 'औसत काम के दिन',
      worksStarted: 'शुरू किए गए कार्य',
      worksCompleted: 'पूरे किए गए कार्य',
      lastUpdated: 'अंतिम अपडेट',
      dataMayBeOld: 'डेटा पुराना हो सकता है',
      compareWithState: 'राज्य औसत के साथ तुलना करें',
      compareWithDistrict: 'दूसरे जिले के साथ तुलना करें',
      historicalTrends: 'ऐतिहासिक रुझान',
      month: 'महीना',
      statusGood: 'अच्छा प्रदर्शन',
      statusAverage: 'औसत प्रदर्शन',
      statusPoor: 'सुधार की आवश्यकता',
      explainThis: 'इसे समझाएं',
      playVoice: 'आवाज चलाएं',
      stopVoice: 'आवाज रोकें',
      language: 'भाषा',
      about: 'के बारे में',
      dataSource: 'डेटा स्रोत',
      feedback: 'प्रतिक्रिया',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      noData: 'कोई डेटा उपलब्ध नहीं',
      searchDistrict: 'जिला खोजें...',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

