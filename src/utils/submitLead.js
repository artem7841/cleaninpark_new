const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";

function getContactMethodText(method) {
  switch (method) {
    case "telegram":
      return "Telegram";
    case "whatsapp":
      return "WhatsApp";
    case "phone":
      return "Телефонный звонок";
    case "email":
      return "Email";
    default:
      return "Не указан";
  }
}

function buildFormFields({ formData, consents, calculatorData }) {
  return {
    "entry.1803102575": formData.name,
    "entry.1496045372": formData.phone,
    "entry.392138171": getContactMethodText(formData.contactMethod),
    "entry.1639246950": calculatorData ? calculatorData.service : "Прямой запрос",
    "entry.749667160": calculatorData
      ? `${calculatorData.meters} ${calculatorData.service === "Мойка окон" ? "окон" : "м²"}`
      : "Не указана",
    "entry.1761612622": calculatorData
      ? `от ${calculatorData.calculatedPrice?.min || 0} до ${calculatorData.calculatedPrice?.max || 0} руб.`
      : "Не рассчитывалась",
    "entry.1146187820": calculatorData?.comment || "",
    "entry.consent_timestamp": new Date().toISOString(),
    "entry.privacy_consent": consents.privacyPolicyRead ? "Да" : "Нет",
    "entry.data_processing_consent": consents.dataProcessing ? "Да" : "Нет",
  };
}

function submitViaFetch(fields) {
  const body = new FormData();
  Object.entries(fields).forEach(([name, value]) => body.append(name, value));

  // mode: "no-cors" means the response is always opaque - we genuinely can't
  // tell success from an HTTP-level failure here, only from a network-level
  // one. That's inherited from the original implementation; a real
  // delivery guarantee would need a server-side endpoint in front of this.
  return fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body })
    .then(() => true)
    .catch(() => false);
}

// Fallback used only if the fetch above throws (e.g. environments that
// block fetch to this endpoint). Kept for parity with the original.
function submitViaHiddenIframe(fields) {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.name = "google-form-iframe";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_FORM_URL;
    form.target = "google-form-iframe";
    form.style.display = "none";

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      document.body.removeChild(iframe);
      document.body.removeChild(form);
      resolve(true);
    }, 1000);
  });
}

export async function submitLead({ formData, consents, calculatorData }) {
  const fields = buildFormFields({ formData, consents, calculatorData });

  const succeeded = await submitViaFetch(fields);
  if (succeeded) return true;

  return submitViaHiddenIframe(fields);
}

/**
 * Client-side breadcrumb only - sessionStorage disappears when the tab
 * closes, so this is NOT a durable record of consent. If this needs to
 * hold up as proof of consent (152-ФЗ or similar), send it to a server
 * you control instead of / in addition to this.
 */
export function logConsent({ formData, consents, calculatorData }) {
  try {
    const consentRecord = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      phone: formData.phone,
      privacyPolicyRead: consents.privacyPolicyRead,
      dataProcessing: consents.dataProcessing,
      userAgent: navigator.userAgent,
      service: calculatorData?.service || "Прямой запрос",
    };
    sessionStorage.setItem("consentLog", JSON.stringify(consentRecord));
  } catch (error) {
    console.error("Не удалось сохранить лог согласия:", error);
  }
}
