import { useEffect } from 'react';
import { Shield, Lock, Key, Eye, Server, AlertTriangle } from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Encrypted Connections',
    description: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3.',
  },
  {
    icon: Key,
    title: 'Secure Password Storage',
    description: 'Passwords are hashed using bcrypt with salt rounds, making them unreadable even to us.',
  },
  {
    icon: Eye,
    title: 'Privacy by Design',
    description: 'We collect only the data necessary to provide our service. We never sell your information.',
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'Our servers are hosted on MongoDB Atlas with enterprise-grade security and regular backups.',
  },
];

export default function Security() {
  useEffect(() => {
    document.title = 'Security | SubTrack';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto mb-6 inline-flex rounded-full bg-green-100 p-4 dark:bg-green-900/30">
          <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Security at SubTrack
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Your data security is our top priority. Learn how we protect your information.
        </p>
      </section>

      {/* Security Features */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Practices */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Our Security Practices
          </h2>
          <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Authentication</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>JWT-based authentication with 7-day expiration</li>
                <li>Token blacklisting on logout for immediate invalidation</li>
                <li>Email verification required for new accounts</li>
                <li>Rate limiting on login attempts to prevent brute force attacks</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Data Protection</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Input validation and sanitization to prevent injection attacks</li>
                <li>Helmet.js for secure HTTP headers (XSS, clickjacking protection)</li>
                <li>CORS configured to allow only trusted origins</li>
                <li>Request body size limits to prevent payload attacks</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Infrastructure</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>MongoDB Atlas with encryption at rest</li>
                <li>Regular automated backups</li>
                <li>IP whitelisting for database access</li>
                <li>Environment variables for sensitive configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-xl border border-orange-200 bg-orange-50 p-8 text-center dark:border-orange-900/50 dark:bg-orange-900/20">
          <AlertTriangle className="mx-auto h-10 w-10 text-orange-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Found a Security Issue?
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            If you discover a security vulnerability, please report it responsibly. We appreciate your help in keeping SubTrack secure.
          </p>
          <a
            href="/support"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Report a Vulnerability
          </a>
        </div>
      </section>
    </div>
  );
}
