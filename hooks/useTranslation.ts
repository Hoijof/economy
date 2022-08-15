import { useState } from 'react';
import translations from '../translations.json';

export enum Languages {
    EN = 'en',
    ES = 'es'
}

export default function useTranslation(defaultLanguage=Languages.EN) {
    const [language, setLanguage] = useState(defaultLanguage);

    return [translations[language], setLanguage];
}