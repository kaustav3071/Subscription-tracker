import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | SubTrack';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: December 30, 2025</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SubTrack ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">2. Description of Service</h2>
            <p>
              SubTrack is a subscription tracking service that helps users manage and monitor their recurring subscriptions. The Service allows users to add, edit, and track subscription details, receive renewal reminders, and view spending analytics.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">3. User Accounts</h2>
            <ul className="ml-4 list-disc space-y-2">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized access to your account.</li>
              <li>One person may not maintain more than one account.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload malicious code or content</li>
              <li>Impersonate another person or entity</li>
              <li>Use the Service to send spam or unsolicited messages</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">5. User Content</h2>
            <p>
              You retain ownership of any data you submit to the Service. By using SubTrack, you grant us a limited license to store, process, and display your data solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">6. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We may temporarily suspend the Service for maintenance, updates, or other reasons without prior notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">7. Limitation of Liability</h2>
            <p>
              SubTrack is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SubTrack and its team from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">9. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these Terms. You may delete your account at any time from your profile settings. Upon termination, your data will be deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">10. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will notify users of material changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">11. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="/support" className="text-blue-600 hover:underline dark:text-blue-400">
                our support page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
