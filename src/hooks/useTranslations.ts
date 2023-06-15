import en from '../locales/en.json';
import ru from '../locales/ru.json';

type LanguageType = string;

const translation: { [name in LanguageType]: typeof ru & typeof en } = {
  'ru-RU': ru,
  'en-US': en,
};

interface useTranslationType {
  language: LanguageType;
}
export const useTranslations = (props: useTranslationType) => {
  let lang = props.language;

  return {
    t: translation[lang],
  };
};
