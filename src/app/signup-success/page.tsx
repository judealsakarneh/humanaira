import Link from 'next/link'

export default function SignupSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Check your email!</h1>
        <p className="mb-6 text-gray-700">
          We’ve sent a confirmation link to your email address.<br />
          Please check your inbox and follow the instructions to activate your account.
        </p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}