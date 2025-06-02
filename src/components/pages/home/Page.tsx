import Header from "./Header";
import Footer from "./Footer";

export interface PageProps {
  children: React.ReactNode;
  className?: string;
  withHeader?: boolean;
  withFooter?: boolean;
}

export default function Page(props: PageProps) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, #0D1B2A 0%, #1B263B 100%)",
      }}
    >
      <div
        className="flex-1 flex flex-col w-screen"
        style={{
          background: 'url("/background.png")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      >
        {!props.withHeader && <Header />}
        <main className={`flex-1 flex flex-col ${props.className ?? ""}`}>
          {props.children}
        </main>
        {!props.withFooter && <Footer />}
      </div>
    </div>
  );
}
