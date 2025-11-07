import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl text-light-heading dark:text-dark-heading">
          Your&apos;re not supposed to be here!
        </h1>
        <p className="mb-8 text-light-text dark:text-dark-text">
          The page you&apos;re looking for doesn&apos;t exist. Please check the
          URL or return to the homepage.
        </p>
        <Link
          className="inline-flex items-center font-medium text-blue-400 transition-colors hover:text-blue-300"
          href="/"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
