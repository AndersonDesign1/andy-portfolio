import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-light-heading dark:text-dark-heading">
          Your&apos;re not supposed to be here!
        </h1>
        <p className="text-light-text dark:text-dark-text mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Please check the
          URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
