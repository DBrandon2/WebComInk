import { useState, useEffect } from "react";

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier le consentement existant
    const savedConsent = localStorage.getItem("cookieConsent");
    setConsent(savedConsent);
    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setConsent("accepted");
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setConsent("declined");
  };

  const resetConsent = () => {
    localStorage.removeItem("cookieConsent");
    setConsent(null);
  };

  const hasConsented = () => {
    return consent === "accepted";
  };

  const needsConsent = () => {
    return consent === null;
  };

  return {
    consent,
    isLoading,
    acceptCookies,
    declineCookies,
    resetConsent,
    hasConsented,
    needsConsent,
  };
};
