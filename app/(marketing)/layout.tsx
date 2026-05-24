import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import PageTransition from "@/components/ui/PageTransition";
import { getSiteSettings } from "@/lib/cms/settings";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <ScrollProgressBar />
      <Header logoUrl={settings.logo_url} />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer logoUrl={settings.footer_logo_url || settings.logo_url} />
      <WhatsAppFAB />
    </>
  );
}
