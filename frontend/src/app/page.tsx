import { TokenProvider } from "./component/auth/TokenContext";

export default function Home() {
  return (
    <TokenProvider>
      <div>
        <h1>Welcome to Airbnb!</h1>
        <p>
          This is a Next.js app with Tailwind CSS for styling, and JWT (JSON Web Tokens) for authentication.
        </p>
      </div>
    </TokenProvider>
  );
}
