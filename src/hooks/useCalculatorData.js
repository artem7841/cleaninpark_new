import { useState, useEffect, useRef, useCallback } from "react";

const CALCULATOR_STORAGE_KEY = "calculatorData";
const CALCULATOR_DATA_TTL_MS = 5 * 60 * 1000;

/**
 * Loads "calculatorData" saved by the price calculator into sessionStorage,
 * and keeps it in sync if the calculator updates it later (same tab via a
 * custom event, other tabs via the native "storage" event, or the user
 * navigating back to #contact).
 *
 * onApply(data) is called whenever fresh calculator data becomes available,
 * so the caller can prefill name/phone in the contact form.
 */
export function useCalculatorData({ onApply } = {}) {
  const [calculatorData, setCalculatorData] = useState(null);
  const calculatorDataRef = useRef(null);
  const hasLoadedCalculatorData = useRef(false);

  // Keep the latest onApply without re-registering listeners every render.
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;

  const applyData = useCallback((data) => {
    setCalculatorData(data);
    calculatorDataRef.current = data;
    hasLoadedCalculatorData.current = true;
    onApplyRef.current?.(data);
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(CALCULATOR_STORAGE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw);
      const isFresh =
        !data.timestamp || Date.now() - data.timestamp < CALCULATOR_DATA_TTL_MS;

      if (!isFresh) {
        sessionStorage.removeItem(CALCULATOR_STORAGE_KEY);
        return false;
      }

      applyData(data);
      return true;
    } catch (error) {
      console.error("Не удалось загрузить данные калькулятора:", error);
      return false;
    }
  }, [applyData]);

  // Uses a ref (not the calculatorData state) for comparison, so this stays
  // correct even though it's captured once inside a mount-only effect below.
  const checkForUpdates = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(CALCULATOR_STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (
        !calculatorDataRef.current ||
        data.timestamp !== calculatorDataRef.current.timestamp
      ) {
        loadFromStorage();
      }
    } catch (error) {
      console.error("Ошибка проверки обновлений калькулятора:", error);
    }
  }, [loadFromStorage]);

  useEffect(() => {
    loadFromStorage();

    if (window.location.hash === "#contact") {
      checkForUpdates();
    }

    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        checkForUpdates();
      }
    };

    const handleCalculatorEvent = (event) => {
      if (event.detail) applyData(event.detail);
    };

    const handleStorageEvent = (e) => {
      if (e.key === CALCULATOR_STORAGE_KEY) checkForUpdates();
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("calculatorDataSaved", handleCalculatorEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("calculatorDataSaved", handleCalculatorEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
    // Intentionally mount-only: all three handlers use refs/callbacks that
    // don't go stale, so there's no need to re-subscribe on every render
    // (and no need for the 1s setInterval poll the original had).
  }, [loadFromStorage, checkForUpdates, applyData]);

  const clearCalculatorData = useCallback(() => {
    sessionStorage.removeItem(CALCULATOR_STORAGE_KEY);
    sessionStorage.removeItem("calculatorFormData");
    calculatorDataRef.current = null;
    hasLoadedCalculatorData.current = false;
    setCalculatorData(null);
  }, []);

  return {
    calculatorData,
    hasLoadedCalculatorData: hasLoadedCalculatorData.current,
    clearCalculatorData,
  };
}
