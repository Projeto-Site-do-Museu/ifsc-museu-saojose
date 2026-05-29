"use client";
import "../app/globals.css";
import { useEffect, useState } from "react";



declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function Translate() {
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    // Only add the script if it doesn't exist yet
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Define the callback
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;

    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));
  };

  return (
    <div>
      <div id="google_translate_element" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-200">
          <div className="bg-black rounded-lg p-4 sm:px-3 sm:py-1 w-full max-w-lg sm:max-w-md md:max-w-2xl lg:max-w-5xl relative transform transition-all duration-200 scale-95 opacity-0 animate-modalIn mx-2">
            <p className="text-center font-worksans">Conheça o nosso Museu em outras línguas!</p>
            <button
              type="button"
              className="absolute sm:top-0 sm:right-2 sm:text-2xl top-0 right-2 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

              <div className="outras_linhas">
                <div className="conteiner_outras_linhas">
                  <button onClick={() => {changeLanguage("en"), setShowModal(false)}} className="button_lenguage">English</button>
                  <button onClick={() => {changeLanguage("es"), setShowModal(false)}} className="button_lenguage">Español</button>
                  <button onClick={() => {changeLanguage("pt"), setShowModal(false)}} className="button_lenguage">Português</button>
              </div>
            </div>
          </div>
        </div>
      )}


    

    </div>
  );
}