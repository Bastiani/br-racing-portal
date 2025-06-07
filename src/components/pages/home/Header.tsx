import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function Header() {
  return (
    <div
      className="flex flex-col h-28"
      style={{
        background:
          "linear-gradient(90deg, #1B263B 0%, #0D1B2A 50%, #1B263B 100%)",
      }}
    >
      <div className="flex-1 container flex flex-col justify-center">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <nav>
            <ul className="flex gap-6 items-center">
              <li>
                <Link
                  href="/championships"
                  className="bg-orange-700/80 p-2 rounded-lg text-amber-50 hover:bg-[#ff6b00] transition-colors"
                >
                  4FUN´s
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-championships"
                  className="bg-orange-700/80 p-2 rounded-lg text-amber-50 hover:bg-[#ff6b00] transition-colors"
                >
                  Campeonatos
                </Link>
              </li>
              <li>
                <Link
                  href="/pilots"
                  className="bg-orange-700/80 p-2 rounded-lg text-amber-50 hover:bg-[#ff6b00] transition-colors"
                >
                  Pilotos
                </Link>
              </li>
              {/* <li>
                        <Link 
                          href="/admin" 
                          className="bg-[#ff6b00] hover:bg-[#ff8533] px-4 py-2 rounded-md transition-colors"
                        >
                          Área do Piloto
                        </Link>
                      </li> */}
            </ul>
          </nav>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-slate-500 via-slate-100 to-slate-500"></div>
    </div>
  );
}
