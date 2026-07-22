import { useState, useEffect, useCallback } from "react";

const emptyFormData = { name: "", phone: "", contactMethod: "" };

const emptyTouched = {
  name: false,
  phone: false,
  contactMethod: false,
  privacyPolicyRead: false,
  dataProcessing: false,
};

const emptyErrors = {
  name: "",
  phone: "",
  contactMethod: "",
  privacyPolicyRead: "",
  dataProcessing: "",
};

const emptyConsents = { privacyPolicyRead: false, dataProcessing: false };

function validateName(name) {
  if (!name.trim()) return "Введите имя";
  if (name.trim().length < 2) return "Имя должно содержать минимум 2 символа";
  if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name.trim()))
    return "Имя может содержать только буквы и дефисы";
  return "";
}

function validatePhone(phone) {
  if (!phone.trim()) return "Введите телефон";
  const cleanPhone = phone.replace(/[^\d]/g, "");
  if (cleanPhone.length < 10) return "Телефон должен содержать минимум 10 цифр";
  if (cleanPhone.length > 15) return "Телефон слишком длинный";
  if (!/^[\d\s\-\+\(\)]+$/.test(phone)) return "Введите корректный номер телефона";
  return "";
}

function validateContactMethod(method) {
  return method ? "" : "Выберите предпочтительный способ связи";
}

function validatePrivacyPolicyRead(read) {
  return read ? "" : "Необходимо ознакомиться с политикой конфиденциальности";
}

function validateDataProcessing(accepted) {
  return accepted ? "" : "Необходимо дать согласие на обработку персональных данных";
}

const validators = {
  name: validateName,
  phone: validatePhone,
  contactMethod: validateContactMethod,
  privacyPolicyRead: validatePrivacyPolicyRead,
  dataProcessing: validateDataProcessing,
};

export function useContactForm() {
  const [formData, setFormData] = useState(emptyFormData);
  const [consents, setConsents] = useState(emptyConsents);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState(emptyTouched);

  // Restore a previously started (but not submitted) form once on mount.
  // If calculator data also loads on this page (see useCalculatorData,
  // whose effect runs after this one), it will overwrite name/phone below —
  // which is the desired priority.
  useEffect(() => {
    try {
      const savedFormData = sessionStorage.getItem("contactsFormData");
      const savedConsents = sessionStorage.getItem("contactsConsents");
      if (savedFormData) setFormData(JSON.parse(savedFormData));
      if (savedConsents) setConsents(JSON.parse(savedConsents));
    } catch (error) {
      console.error("Не удалось восстановить сохранённые данные формы:", error);
    }
  }, []);

  // Persist as the user types, so the draft survives an accidental reload.
  useEffect(() => {
    sessionStorage.setItem("contactsFormData", JSON.stringify(formData));
    sessionStorage.setItem("contactsConsents", JSON.stringify(consents));
  }, [formData, consents]);

  const applyCalculatorData = useCallback((data) => {
    setFormData((prev) => ({ ...prev, name: data.name || "", phone: data.phone || "" }));
    setTouched((prev) => ({ ...prev, name: !!data.name, phone: !!data.phone }));
    setErrors((prev) => ({
      ...prev,
      name: validateName(data.name || ""),
      phone: validatePhone(data.phone || ""),
    }));
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
      }
    },
    [touched],
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  }, []);

  const handleConsentChange = useCallback(
    (consentName, checked) => {
      setConsents((prev) => ({ ...prev, [consentName]: checked }));
      if (touched[consentName]) {
        setErrors((prev) => ({ ...prev, [consentName]: validators[consentName](checked) }));
      }
    },
    [touched],
  );

  const handleConsentBlur = useCallback((consentName) => {
    setTouched((prev) => ({ ...prev, [consentName]: true }));
  }, []);

  const validateAll = useCallback(() => {
    setTouched({
      name: true,
      phone: true,
      contactMethod: true,
      privacyPolicyRead: true,
      dataProcessing: true,
    });

    const newErrors = {
      name: validators.name(formData.name),
      phone: validators.phone(formData.phone),
      contactMethod: validators.contactMethod(formData.contactMethod),
      privacyPolicyRead: validators.privacyPolicyRead(consents.privacyPolicyRead),
      dataProcessing: validators.dataProcessing(consents.dataProcessing),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [formData, consents]);

  const reset = useCallback(() => {
    setFormData(emptyFormData);
    setConsents(emptyConsents);
    setErrors(emptyErrors);
    setTouched(emptyTouched);
    sessionStorage.removeItem("contactsFormData");
    sessionStorage.removeItem("contactsConsents");
  }, []);

  const getFieldClassName = useCallback(
    (fieldName) => (touched[fieldName] && errors[fieldName] ? "error" : ""),
    [touched, errors],
  );

  return {
    formData,
    consents,
    errors,
    touched,
    handleInputChange,
    handleBlur,
    handleConsentChange,
    handleConsentBlur,
    applyCalculatorData,
    validateAll,
    reset,
    getFieldClassName,
  };
}
