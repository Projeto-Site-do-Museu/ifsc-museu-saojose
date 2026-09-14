"use client";
import "../app/globals.css";
import { useCallback, useEffect, useRef, useState } from "react";

type Language = "pt" | "en" | "es";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

function readPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A escolha ainda funciona nesta página se o navegador bloquear o armazenamento.
  }
}

function clearTranslationCookie() {
  // O Google pode guardar o cookie no host ou em um domínio pai.
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let index = 0; index < parts.length; index += 1) {
    const domain = parts.slice(index).join(".");
    domains.push(`; domain=${domain}`, `; domain=.${domain}`);
  }
  const paths = new Set(["/"]);
  const segments = window.location.pathname.split("/").filter(Boolean);
  for (let index = 1; index <= segments.length; index += 1) {
    const path = `/${segments.slice(0, index).join("/")}`;
    paths.add(path);
    paths.add(`${path}/`);
  }
  for (const domain of domains) {
    for (const path of Array.from(paths)) {
      document.cookie = `googtrans=; Max-Age=0; path=${path}${domain}`;
    }
  }
}

export default function Translate() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const pendingLanguage = useRef<Language | null>(null);
  const requestedAt = useRef(0);

  const closeModal = useCallback(() => {
    savePreference("languagePromptSeen", "true");
    setShowModal(false);
  }, []);

  const restorePortuguese = useCallback(() => {
    pendingLanguage.current = null;
    savePreference("language", "pt");
    clearTranslationCookie();
    closeModal();
    // Recarregar recupera o HTML original, sem tentar traduzir PT para PT.
    window.location.reload();
  }, [closeModal]);

  useEffect(() => {
    let disposed = false;
    let initialized = false;
    const savedLanguage = readPreference("language");
    setShowModal(!readPreference("languagePromptSeen"));

    if (savedLanguage === "pt") {
      clearTranslationCookie();
    } else if (savedLanguage === "en" || savedLanguage === "es") {
      pendingLanguage.current = savedLanguage;
      requestedAt.current = Date.now();
    }

    const initialize = () => {
      if (disposed || initialized || !window.google?.translate?.TranslateElement) return;
      if (document.querySelector("#google_translate_element .goog-te-combo")) return;
      initialized = true;
      new window.google.translate.TranslateElement(
        { pageLanguage: "pt", includedLanguages: "en,es", autoDisplay: false },
        "google_translate_element"
      );
    };

    // Registrar o callback antes de carregar o script evita uma corrida no carregamento.
    window.googleTranslateElementInit = initialize;
    initialize();
    let script = document.getElementById("google-translate-script") as HTMLScriptElement | null;
    const handleError = () => {
      if (disposed) return;
      setMessage("Não foi possível carregar a tradução. Confira sua conexão e tente novamente.");
      setShowModal(true);
    };
    if (!script) {
      script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.addEventListener("error", handleError);
      document.body.appendChild(script);
    } else {
      script.addEventListener("error", handleError);
    }

    const interval = window.setInterval(() => {
      const language = pendingLanguage.current;
      if (!language || language === "pt") return;
      const select = document.querySelector<HTMLSelectElement>("#google_translate_element .goog-te-combo");
      if (select && Array.from(select.options).some((option) => option.value === language)) {
        pendingLanguage.current = null;
        select.value = language;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        setMessage("");
        savePreference("languagePromptSeen", "true");
        setShowModal(false);
      } else if (Date.now() - requestedAt.current >= 15000) {
        pendingLanguage.current = null;
        setMessage("A tradução demorou para carregar. Recarregue a página para tentar novamente ou escolha Português.");
        setShowModal(true);
      }
    }, 250);

    // Enquanto o widget estiver visível, suas escolhas também devem ser lembradas.
    const container = document.getElementById("google_translate_element");
    const rememberWidgetChoice = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement) || !target.matches(".goog-te-combo")) return;
      if (target.value) {
        pendingLanguage.current = null;
        savePreference("language", target.value);
      }
    };
    container?.addEventListener("change", rememberWidgetChoice);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      script?.removeEventListener("error", handleError);
      container?.removeEventListener("change", rememberWidgetChoice);
    };
  }, []);

  const changeLanguage = useCallback((language: Language) => {
    window.dispatchEvent(new CustomEvent("museu:language-changed", { detail: language }));
    if (language === "pt") {
      restorePortuguese();
      return;
    }
    savePreference("language", language);
    pendingLanguage.current = language;
    requestedAt.current = Date.now();
    setMessage("Carregando tradução…");
  }, [restorePortuguese]);

  useEffect(() => {
    const handleRequest = (event: Event) => {
      const language = (event as CustomEvent<unknown>).detail;
      if (language === "pt" || language === "en" || language === "es") {
        changeLanguage(language);
      }
    };
    window.addEventListener("museu:language-request", handleRequest);
    return () => window.removeEventListener("museu:language-request", handleRequest);
  }, [changeLanguage]);

  return (
    <div>
      <div id="google_translate_element" aria-hidden="true" />
      {!showModal && message && <p role="status" translate="no" className="notranslate fixed bottom-4 left-4 right-4 z-50 rounded bg-black p-3 text-center text-white">{message}</p>}
      {showModal && (
        <div translate="no" className="notranslate fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className="text-center font-worksans">Conheça o nosso Museu em outras línguas!</p>
            <button type="button" className="absolute sm:top-0 sm:right-2 sm:text-2xl top-0 right-2 text-2xl" onClick={closeModal} aria-label="Fechar seleção de idioma">
              &times;
            </button>
            <div className="outras_linhas">
              <div className="conteiner_outras_linhas">
                <button type="button" onClick={() => changeLanguage("en")} className="button_lenguage">English</button>
                <button type="button" onClick={() => changeLanguage("es")} className="button_lenguage">Español</button>
                <button type="button" onClick={() => changeLanguage("pt")} className="button_lenguage">Português</button>
              </div>
            </div>
            {message && <p role="status" className="text-center font-worksans mt-2">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
