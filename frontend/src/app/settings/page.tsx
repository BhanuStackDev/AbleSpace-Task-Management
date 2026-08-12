
"use client";

import { useEffect, useState } from "react";

const SETTINGS_KEY = "ablespace-settings";

type Settings = {
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
};

const defaultSettings: Settings = {
  notifications: true,
  emailUpdates: false,
  language: "English",
};

const translations = {
  English: {
    title: "Settings",
    description:
      "Manage your AbleSpace preferences and account settings.",
    account: "Account",
    guestUser: "Guest User",
    guestAccount: "Guest account",
    notifications: "Notifications",
    taskNotifications: "Task notifications",
    taskNotificationsDescription:
      "Receive notifications about your tasks.",
    emailUpdates: "Email updates",
    emailUpdatesDescription:
      "Receive important updates by email.",
    preferences: "Preferences",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    reset: "Reset settings",
  },

  Hindi: {
    title: "सेटिंग्स",
    description:
      "अपनी AbleSpace प्राथमिकताओं और अकाउंट सेटिंग्स को प्रबंधित करें।",
    account: "खाता",
    guestUser: "अतिथि उपयोगकर्ता",
    guestAccount: "अतिथि अकाउंट",
    notifications: "सूचनाएँ",
    taskNotifications: "कार्य सूचनाएँ",
    taskNotificationsDescription:
      "अपने कार्यों से संबंधित सूचनाएँ प्राप्त करें।",
    emailUpdates: "ईमेल अपडेट",
    emailUpdatesDescription:
      "महत्वपूर्ण अपडेट ईमेल के माध्यम से प्राप्त करें।",
    preferences: "प्राथमिकताएँ",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    reset: "सेटिंग्स रीसेट करें",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings =
        localStorage.getItem(SETTINGS_KEY);

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }, [settings, isLoaded]);

  function toggleNotifications() {
    setSettings((current) => ({
      ...current,
      notifications: !current.notifications,
    }));
  }

  function toggleEmailUpdates() {
    setSettings((current) => ({
      ...current,
      emailUpdates: !current.emailUpdates,
    }));
  }

  function handleLanguageChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSettings((current) => ({
      ...current,
      language: event.target.value,
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  const language =
    settings.language === "Hindi"
      ? "Hindi"
      : "English";

  const t = translations[language];

  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.description}
          </p>
        </div>

        {/* Account */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.account}
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-700 dark:bg-slate-700 dark:text-white">
              G
            </div>

            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {t.guestUser}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.guestAccount}
              </p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.notifications}
          </h2>

          <div className="mt-5 space-y-5">
            {/* Task notifications */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {t.taskNotifications}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.taskNotificationsDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleNotifications}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  settings.notifications
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
                aria-label={t.taskNotifications}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${
                    settings.notifications
                      ? "translate-x-6 bg-white dark:bg-slate-900"
                      : "translate-x-1 bg-white"
                  }`}
                />
              </button>
            </div>

            {/* Email updates */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {t.emailUpdates}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.emailUpdatesDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleEmailUpdates}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  settings.emailUpdates
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
                aria-label={t.emailUpdates}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${
                    settings.emailUpdates
                      ? "translate-x-6 bg-white dark:bg-slate-900"
                      : "translate-x-1 bg-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.preferences}
          </h2>

          <div className="mt-5">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-slate-900 dark:text-white"
            >
              {t.language}
            </label>

            <select
              id="language"
              value={settings.language}
              onChange={handleLanguageChange}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="English">
                {t.english}
              </option>

              <option value="Hindi">
                {t.hindi}
              </option>
            </select>
          </div>

          {/* Reset */}
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.reset}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

