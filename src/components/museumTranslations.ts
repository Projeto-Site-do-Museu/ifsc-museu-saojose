"use client";

import { useEffect, useState } from "react";

export type MuseumLanguage = "pt" | "en" | "es";

export const museumTranslations = {
  pt: {
    home: "Início", about: "Sobre", collections: "Coleções Culturais",
    collection: "Acervo", articles: "Artigos", tour: "Tour Virtual",
    videos: "Nossos Vídeos", games: "Nossos Jogos", menu: "Abrir menu",
    closeMenu: "Fechar menu", language: "Idioma", logo: "Logo do Museu Histórico de São José",
    watchVideo: "Ver vídeo introdutório", meetMuseum: "Conheça o nosso Museu!",
    closeVideo: "Fechar vídeo", unsupportedVideo: "Seu navegador não suporta o elemento de vídeo.",
    welcome: "Bem-vindo ao Museu Histórico de São José",
    introduction: "Descubra a história e a cultura de São José em um espaço dedicado à memória, à educação e à valorização das nossas raízes. Explore exposições, participe de eventos e viva experiências únicas que conectam passado, presente e futuro da nossa cidade.",
  },
  en: {
    home: "Home", about: "About", collections: "Cultural Collections",
    collection: "Collection", articles: "Articles", tour: "Virtual Tour",
    videos: "Our Videos", games: "Our Games", menu: "Open menu",
    closeMenu: "Close menu", language: "Language", logo: "Museu Histórico de São José logo",
    watchVideo: "Watch the introduction", meetMuseum: "Discover our museum!",
    closeVideo: "Close video", unsupportedVideo: "Your browser does not support video playback.",
    welcome: "Welcome to the São José History Museum",
    introduction: "Discover the history and culture of São José in a space dedicated to preserving memories, learning and celebrating our roots. Explore exhibitions, take part in events and enjoy unique experiences that connect our city's past, present and future.",
  },
  es: {
    home: "Inicio", about: "Acerca de", collections: "Colecciones Culturales",
    collection: "Acervo", articles: "Artículos", tour: "Visita Virtual",
    videos: "Nuestros Videos", games: "Nuestros Juegos", menu: "Abrir menú",
    closeMenu: "Cerrar menú", language: "Idioma", logo: "Logotipo del Museu Histórico de São José",
    watchVideo: "Ver video introductorio", meetMuseum: "¡Conoce nuestro museo!",
    closeVideo: "Cerrar video", unsupportedVideo: "Tu navegador no admite la reproducción de video.",
    welcome: "Bienvenido al Museo Histórico de São José",
    introduction: "Descubre la historia y la cultura de São José en un espacio dedicado a la memoria, la educación y la valoración de nuestras raíces. Explora exposiciones, participa en eventos y vive experiencias únicas que conectan el pasado, el presente y el futuro de nuestra ciudad.",
  },
};

export function useMuseumLanguage() {
  const [language, setLanguage] = useState<MuseumLanguage>("pt");

  useEffect(() => {
    const update = (value: unknown) => {
      if (value === "pt" || value === "en" || value === "es") setLanguage(value);
    };
    try {
      update(localStorage.getItem("language"));
    } catch {
      // Mantém PT quando o armazenamento está indisponível.
    }
    const onLanguageChange = (event: Event) => update((event as CustomEvent<unknown>).detail);
    window.addEventListener("museu:language-changed", onLanguageChange);
    return () => window.removeEventListener("museu:language-changed", onLanguageChange);
  }, []);

  return { language, text: museumTranslations[language] };
}
