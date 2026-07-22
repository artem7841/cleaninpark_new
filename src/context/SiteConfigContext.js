import React, { createContext, useContext, useEffect, useState } from "react";
import { publicUrl } from "../utils/publicUrl";

const defaultConfig = {
  page: {
    title: "CleanInPark - Профессиональный клининг",
    description: "CleanInPark - профессиональные услуги клининга и уборки",
    ogUrl: "https://cleaninpark.ru",
  },
  company: {
    brandName: "CleanInPark",
    legalName: "Лопатин Ярослав Михайлович",
    inn: "667908332008",
    founderName: "Конова Ангелина",
    founderRole: "Основатель CleanInPark",
    copyrightYear: "2025",
    websiteUrl: "https://cleaninpark.ru",
  },
  contacts: {
    email: "cleaninpark@yandex.ru",
    phoneDisplay: "+7 (995) 662-30-02",
    phoneTel: "+79956623002",
    phoneDisplaySecondary: "+7 (982) 716-62-07",
    phoneTelSecondary: "+79827166207",
    telegramUrl: "https://t.me/+79956623002",
    whatsappUrl:
      "https://max.ru/u/f9LHodD0cOImONlYMOGzSj7dA0XT5owzRuQq3wOdErsun5gKCJMypWT_9c8",
  },
  map: {
    yandexWidgetUrl:
      "https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=205650411945",
  },
};

const SiteConfigContext = createContext({
  config: defaultConfig,
  loading: true,
});

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(publicUrl("site.json"));
        if (!response.ok) {
          throw new Error("Не удалось загрузить site.json");
        }
        const data = await response.json();
        setConfig({
          page: { ...defaultConfig.page, ...data.page },
          company: { ...defaultConfig.company, ...data.company },
          contacts: { ...defaultConfig.contacts, ...data.contacts },
          map: { ...defaultConfig.map, ...data.map },
        });
      } catch (error) {
        console.error("Ошибка загрузки site.json:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);

export const SiteMeta = () => {
  const { config } = useSiteConfig();

  useEffect(() => {
    document.title = config.page.title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", config.page.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", config.page.title);
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    );
    if (ogDescription) {
      ogDescription.setAttribute("content", config.page.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", config.page.ogUrl);
    }
  }, [config]);

  return null;
};
