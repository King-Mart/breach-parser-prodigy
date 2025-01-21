import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { UrlAnalyzer } from "@/components/UrlAnalyzer";
import { fetchDatabaseRows } from "@/api/database";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Plane, Shield, Lock, Database } from "lucide-react";

const sampleData = [
  {
    id: "728732",
    username: "******",
    domain: "brasilescola.uol.com.br",
    url_path: "/cadastro/ativar.htm",
    application: "Website",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["login", "education"]
  },
  {
    id: "728733",
    username: "******",
    domain: "computerlounge.co.nz",
    url_path: "/",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail", "technology"]
  },
  {
    id: "728734",
    username: "******",
    domain: "ready-study-go.com",
    url_path: "/espace-client/login.php",
    application: "Education Platform",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["education", "login"]
  },
  {
    id: "728735",
    username: "******",
    domain: "accounts.google.com",
    url_path: "/signin/v2/challenge/pwd",
    application: "Google",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["login", "email"]
  },
  {
    id: "728736",
    username: "******",
    domain: "oyunzor.com",
    url_path: "/",
    application: "Gaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["gaming"]
  },
  {
    id: "728737",
    username: "******",
    domain: "app.site223.com",
    url_path: "/manager/affiliate/abLandingOutsource.php",
    application: "Affiliate Management",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["affiliate"]
  },
  {
    id: "728738",
    username: "******",
    domain: "bizmates.ph",
    url_path: "/",
    application: "Business",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["business"]
  },
  {
    id: "728739",
    username: "thot64",
    domain: "android-applications-gratuites.com",
    url_path: "/",
    application: "Android Apps",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["android"]
  },
  {
    id: "728740",
    username: "******",
    domain: "lcpdfr.com",
    url_path: "/register/",
    application: "Gaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["gaming"]
  },
  {
    id: "728741",
    username: "******",
    domain: "m.musica.univision.com",
    url_path: "/",
    application: "Music",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["music"]
  },
  {
    id: "728742",
    username: "******",
    domain: "www.kirmiziperfect.com",
    url_path: "/",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728743",
    username: "******",
    domain: "login.kemlu.go.id",
    url_path: "/adfs/ls/",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728744",
    username: "******",
    domain: "app.vivawallet.com",
    url_path: "/register/kyc/govgr/45d45b12-3976-48ad-b4da-d29fd3fac806/password",
    application: "Finance",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["finance"]
  },
  {
    id: "728745",
    username: "******",
    domain: "dropbox.com",
    url_path: "/scl/fo/m7sn4j7no1d370d/AABuNeU41tNxQvbCk9u16I3ja",
    application: "Cloud Storage",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["cloud"]
  },
  {
    id: "728746",
    username: "******",
    domain: "account.samsung.com",
    url_path: "/accounts/v1/CSWEB/signIn",
    application: "Samsung",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["electronics"]
  },
  {
    id: "728747",
    username: "******",
    domain: "flirtinlove.com",
    url_path: "/en/lp/sexy/27/1/steps/1",
    application: "Dating",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["dating"]
  },
  {
    id: "728748",
    username: "******",
    domain: "shavebox.com",
    url_path: "/",
    application: "Grooming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["grooming"]
  },
  {
    id: "728749",
    username: "******",
    domain: "192.168.8.1",
    url_path: "/html/wlanbasicsettings.html",
    application: "Router",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["network"]
  },
  {
    id: "728750",
    username: "******",
    domain: "collect.cashguru66.in",
    url_path: "/",
    application: "Finance",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["finance"]
  },
  {
    id: "728751",
    username: "******",
    domain: "kelas.com",
    url_path: "/signin",
    application: "Education",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["education"]
  },
  {
    id: "728752",
    username: "******",
    domain: "www.passaportonline.poliziadistato.it",
    url_path: "/LogInAction.do",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728753",
    username: "******",
    domain: "my.malwarebytes.com",
    url_path: "/",
    application: "Security",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["security"]
  },
  {
    id: "728754",
    username: "******",
    domain: "com.roblox.client",
    url_path: "/",
    application: "Gaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["gaming"]
  },
  {
    id: "728755",
    username: "******",
    domain: "p-auth.duke-energy.com",
    url_path: "/my-account/registration-r5",
    application: "Utility",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["utility"]
  },
  {
    id: "728756",
    username: "******",
    domain: "siteavenida.conductor.com.br",
    url_path: "/",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728757",
    username: "******",
    domain: "www.carcommunications.co.uk",
    url_path: "/index.php",
    application: "Automotive",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["automotive"]
  },
  {
    id: "728758",
    username: "******",
    domain: "kuechenplaner.xxxlutz.at",
    url_path: "/cloud/XXXLUTZ3D-AT",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728759",
    username: "******",
    domain: "www.starlegends.ph",
    url_path: "/",
    application: "Gaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["gaming"]
  },
  {
    id: "728760",
    username: "******",
    domain: "spankbang.com",
    url_path: "/8upca/video/mkin",
    application: "Adult",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["adult"]
  },
  {
    id: "728761",
    username: "******",
    domain: "www.disneyplus.com",
    url_path: "/login/password",
    application: "Streaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["streaming"]
  },
  {
    id: "728762",
    username: "******",
    domain: "com.netflix.mediaclient",
    url_path: "/",
    application: "Streaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["streaming"]
  },
  {
    id: "728763",
    username: "******",
    domain: "moja.biedronka.pl",
    url_path: "/rejestracja/",
    application: "Retail",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728764",
    username: "******",
    domain: "auth.streamotion.com.au",
    url_path: "/login",
    application: "Streaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["streaming"]
  },
  {
    id: "728765",
    username: "******",
    domain: "www.pietadenim.com",
    url_path: "/account/login",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728766",
    username: "******",
    domain: "accounts.autodesk.com",
    url_path: "/Authentication/LogOn",
    application: "Design",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["design"]
  },
  {
    id: "728767",
    username: "******",
    domain: "www.unifrog.org",
    url_path: "/sign-in",
    application: "Education",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["education"]
  },
  {
    id: "728768",
    username: "******",
    domain: "id.cisco.com",
    url_path: "/signin",
    application: "Networking",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["networking"]
  },
  {
    id: "728769",
    username: "******",
    domain: "loteriaparagonowa.gov.pl",
    url_path: "/zasady",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728770",
    username: "******",
    domain: "roblox.com",
    url_path: "/",
    application: "Gaming",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["gaming"]
  },
  {
    id: "728771",
    username: "******",
    domain: "ticket.cineplexbd.com",
    url_path: "/",
    application: "Entertainment",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["entertainment"]
  },
  {
    id: "728772",
    username: "******",
    domain: "www.ezys.lt",
    url_path: "/prisijungimas",
    application: "Retail",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728773",
    username: "******",
    domain: "pismp.moe.gov.my",
    url_path: "/RAYUAN_BUKA.CFM",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728774",
    username: "******",
    domain: "bancapersonas.bancoestado.cl",
    url_path: "/",
    application: "Banking",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["banking"]
  },
  {
    id: "728775",
    username: "******",
    domain: "discordapp.com",
    url_path: "/channels/488700503497113610/501667022199980053",
    application: "Chat",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["chat"]
  },
  {
    id: "728776",
    username: "******",
    domain: "www.buzzsneakers.ro",
    url_path: "/coscumparaturi",
    application: "E-commerce",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["retail"]
  },
  {
    id: "728777",
    username: "******",
    domain: "oam.nsf.org",
    url_path: "/oam/server/obrareq.cgi",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728778",
    username: "******",
    domain: "www.hr.gov.ge",
    url_path: "/account/resetpassword",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728779",
    username: "******",
    domain: "psconline.psc.gov.np",
    url_path: "/",
    application: "Government",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["government"]
  },
  {
    id: "728780",
    username: "******",
    domain: "messenger.wepluz.com",
    url_path: "/register",
    application: "Chat",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["chat"]
  },
  {
    id: "728781",
    username: "******",
    domain: "atlas.my.salesforce-sites.com",
    url_path: "/",
    application: "CRM",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["crm"]
  },
  {
    id: "728782",
    username: "******",
    domain: "www.diary.ru",
    url_path: "/",
    application: "Blog",
    is_accessible: true,
    is_parked: false,
    breach_detected: true,
    tags: ["blog"]
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Transform the sample data to match the DataTable interface
  const transformedSampleData = sampleData.map(entry => ({
    ...entry,
    tags: entry.tags || [],
    is_accessible: true,
    is_parked: false,
    breach_detected: true
  }));

  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => Promise.resolve(transformedSampleData),
    initialData: transformedSampleData,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background bg-[url('/airplane-pattern.png')] bg-repeat bg-opacity-10">
      <div className="container py-8 space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 pointer-events-none" />
        
        <div className="relative space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary animate-pulse" />
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  Breach Data Analyzer
                </h1>
              </div>
              <p className="text-muted-foreground">
                Navigate through breach data securely with our advanced analysis tools.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/1abc1e8e-4752-421a-b217-232af70b0285.png" 
                alt="TADA DATA Logo" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <Plane className="h-6 w-6 text-primary/80 floating-plane" />
            </div>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-colors">
            <UrlAnalyzer />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-all duration-300">
              <FileUpload />
            </div>
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-all duration-300 space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                Quick Search
              </h2>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Breached Data Overview
            </h2>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-colors overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <DataTable data={data} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
