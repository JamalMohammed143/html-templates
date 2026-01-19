import { Link } from "react-router-dom";
import { BOOK_CATEGORIES } from "../config/constants";
import { t } from "../config/i18n";
import FictionIcon from "../assets/Fiction.svg";
import DramaIcon from "../assets/Drama.svg";
import HumourIcon from "../assets/Humour.svg";
import PoliticsIcon from "../assets/Politics.svg";
import PhilosophyIcon from "../assets/Philosophy.svg";
import HistoryIcon from "../assets/History.svg";
import AdventureIcon from "../assets/Adventure.svg";
import NextIcon from "../assets/Next.svg";
import PatternBg from "../assets/Pattern.svg";

const categoryIcons: Record<string, string> = {
  Fiction: FictionIcon,
  Drama: DramaIcon,
  Humor: HumourIcon,
  Politics: PoliticsIcon,
  Philosophy: PhilosophyIcon,
  History: HistoryIcon,
  Adventure: AdventureIcon,
};

export function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${PatternBg})`,
        backgroundRepeat: "repeat",
      }}
    >
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="mb-4 text-5xl font-semibold leading-tight text-primary">
          {t("app.title")}
        </h1>
        <p className="mb-12 font-semibold text-grey-dark">
          {t("app.tagline")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BOOK_CATEGORIES.map((cat) => {
            const IconComponent = categoryIcons[cat];
            return (
              <Link
                key={cat}
                to={`/books?topic=${encodeURIComponent(cat)}`}
                className="flex items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {IconComponent && (
                  <img
                    src={IconComponent}
                    alt={cat}
                    className="h-8 w-8 shrink-0"
                  />
                )}
                <span className="flex-1 text-xl font-semibold text-grey-dark">
                  {cat.toUpperCase()}
                </span>
                <img
                  src={NextIcon}
                  alt="Next"
                  className="h-4 w-4 shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
