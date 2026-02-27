import { getDictionary } from "@/i18n/get-dictionary";
import { Navigation } from "@/components/layout/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/layout/footer";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Navigation dictionary={dictionary} lang={lang} />
      <main>
        <Hero dictionary={dictionary} lang={lang} />
        <div id="features">
          <Features dictionary={dictionary} />
        </div>
        <div id="pricing">
          <Cta dictionary={dictionary} lang={lang} />
        </div>
      </main>
      <Footer dictionary={dictionary} lang={lang} />
    </>
  );
}
