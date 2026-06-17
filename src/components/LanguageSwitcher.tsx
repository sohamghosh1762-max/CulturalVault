"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="bn">Bengali</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
      </select>

      <p>Current Language: {language}</p>
    </>
  );
}