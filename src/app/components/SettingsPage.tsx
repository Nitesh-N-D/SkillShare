import { JSX } from "react";

export function SettingsPage(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Account */}
        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-2">
            Account
          </h2>
          <p className="text-sm text-gray-600">
            Manage your personal information and preferences.
          </p>
        </section>

        {/* Notifications */}
        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-2">
            Notifications
          </h2>
          <p className="text-sm text-gray-600">
            Control how and when you receive updates.
          </p>
        </section>

        {/* Security */}
        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-2">
            Security
          </h2>
          <p className="text-sm text-gray-600">
            Authentication and session management.
          </p>
        </section>
      </div>
    </div>
  );
}
