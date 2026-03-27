import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-6xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}