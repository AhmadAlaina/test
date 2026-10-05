import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateLead } from '@workspace/api-client-react';
import { ArrowLeft, ArrowRight, Check, Menu, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import logo from '../../../attached_assets/WhatsApp_Image_2026-09-28_at_22.52.49_1791147904685.jpeg';

const queryClient = new QueryClient();
const projectPhotoBase = `${import.meta.env.BASE_URL}project-photos/`;
const projectPhotos: { src: string; alt: string; caption: string; featured: boolean; width: number; height: number }[] = [
  { src: `${projectPhotoBase}project-01.jpg`, alt: 'Woonruimte met een centraal bouwdeel en afgedekte vloer tijdens werkzaamheden.', caption: 'Woonruimte tijdens werkzaamheden', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-02.jpg`, alt: 'Vloer in voorbereiding tijdens een verbouwing.', caption: 'Vloer in voorbereiding', featured: false, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-03.jpg`, alt: 'Werkzaamheden aan plafond en wand in een ruimte in aanbouw.', caption: 'Werkzaamheden aan plafond en wand', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-04.jpg`, alt: 'Wandafwerking rond een raam in een ruimte in aanbouw.', caption: 'Wandafwerking bij een raam', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-05.jpg`, alt: 'Vloerdetail met plaatsingsmateriaal bij een deuropening.', caption: 'Detail van vloerwerk', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-06.jpg`, alt: 'Aansluiting tussen een tegelvloer en een visgraatvloer.', caption: 'Aansluiting van twee vloeren', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-07.jpg`, alt: 'Keuken met kookeiland tijdens werkzaamheden.', caption: 'Keuken tijdens werkzaamheden', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-08.jpg`, alt: 'Badkamer in verbouwing met een bad en wandtegels.', caption: 'Badkamer in verbouwing', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-09.jpg`, alt: 'Badkamerwand tijdens werkzaamheden.', caption: 'Werkzaamheden in de badkamer', featured: false, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-10.jpg`, alt: 'Trap met groene afwerking en geïntegreerde opbergruimte.', caption: 'Trap en maatwerk in beeld', featured: true, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-11.jpg`, alt: 'Vloerwerk in een woonkamer tijdens een project.', caption: 'Vloerwerk in een woonkamer', featured: false, width: 1000, height: 1333 },
  { src: `${projectPhotoBase}project-12.jpg`, alt: 'Gang tijdens de afbouw, gezien vanuit de deuropening.', caption: 'Gang tijdens de afbouw', featured: false, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-13.jpg`, alt: 'Badkamer met douche, toilet en wastafel.', caption: 'Badkamer met douche en wastafel', featured: false, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-14.jpg`, alt: 'Keuken met kookeiland en afgeplakte oppervlakken tijdens werkzaamheden.', caption: 'Keuken met kookeiland', featured: true, width: 788, height: 1400 },
  { src: `${projectPhotoBase}project-15.jpg`, alt: 'Badkamer met ligbad, toilet en tegelwerk.', caption: 'Badkamer met ligbad', featured: true, width: 788, height: 1400 },
];
const entryParams = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
const navItems = [
  ['Diensten', '/diensten'], ['Projecten', '/projecten'], ['Werkwijze', '/werkwijze'],
  ['Over ons', '/over-ons'], ['Werkgebied', '/werkgebied'],
];
const serviceItems = [
  {
    slug: 'stukadoorswerk',
    title: 'Stukadoorswerk',
    summary: 'Stucwerk aan wanden en plafonds.',
    kicker: 'Stukadoorswerk',
    intro: 'Wilt u een stukadoor inschakelen? Beschrijf de ruimte en de afwerking die u voor ogen heeft.',
    requestHint: 'Beschrijf welke wanden of plafonds u wilt laten stukadoren en welke afwerking u voor ogen heeft.',
    description: 'Bespreek stukadoorswerk met Alaina Bouw Klusbedrijf. Werkgebied: heel Nederland.',
  },
  {
    slug: 'schilderwerk',
    title: 'Schilderwerk',
    summary: 'Schilderwerk aan uw woning.',
    kicker: 'Schilderwerk',
    intro: 'Welke onderdelen wilt u laten schilderen? Deel uw wensen en de gewenste planning.',
    requestHint: 'Beschrijf welke ruimte of onderdelen u wilt laten schilderen.',
    description: 'Bespreek schilderwerk met Alaina Bouw Klusbedrijf. Werkgebied: heel Nederland.',
  },
  {
    slug: 'tuinwerk',
    title: 'Tuinwerk',
    summary: 'Tuinieren en werkzaamheden in de tuin.',
    kicker: 'Tuinwerk',
    intro: 'Wilt u tuinwerk bespreken? Vertel wat u in de tuin wilt aanpakken of laten veranderen.',
    requestHint: 'Beschrijf welk tuinwerk u wilt laten uitvoeren en wat u belangrijk vindt.',
    description: 'Bespreek tuinwerk en tuinieren met Alaina Bouw Klusbedrijf. Werkgebied: heel Nederland.',
  },
  {
    slug: 'tegelwerk',
    title: 'Tegelwerk',
    summary: 'Tegels laten plaatsen in uw woning.',
    kicker: 'Tegelwerk',
    intro: 'Wilt u tegels laten plaatsen? Beschrijf de ruimte en uw wensen voor het tegelwerk.',
    requestHint: 'Beschrijf waar u tegels wilt laten plaatsen en wat uw wensen zijn.',
    description: 'Bespreek tegelwerk met Alaina Bouw Klusbedrijf. Werkgebied: heel Nederland.',
  },
  {
    slug: 'laminaat-leggen',
    title: 'Laminaat leggen',
    summary: 'Laminaat laten leggen in uw woning.',
    kicker: 'Laminaat leggen',
    intro: 'Wilt u laminaat laten leggen? Deel om welke ruimte het gaat en welke planning u in gedachten heeft.',
    requestHint: 'Beschrijf in welke ruimte u laminaat wilt laten leggen.',
    description: 'Bespreek het leggen van laminaat met Alaina Bouw Klusbedrijf. Werkgebied: heel Nederland.',
  },
];
const routes = [
  '/', '/diensten', ...serviceItems.map((service) => `/diensten/${service.slug}`),
  '/projecten', '/werkwijze', '/over-ons', '/werkgebied', '/contact', '/offerte-aanvragen',
  '/privacy', '/cookies', '/algemene-voorwaarden',
];
const pages: Record<string, { title: string; description: string; kicker: string; intro: string }> = {
  '/diensten': { title: 'Diensten', description: 'Stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en laminaat leggen in heel Nederland.', kicker: 'Onze diensten', intro: 'Bekijk het stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en laminaat leggen. Staat uw klus er niet tussen? U kunt die ook voorleggen.' },
  ...Object.fromEntries(serviceItems.map((service) => [
    `/diensten/${service.slug}`,
    { title: service.title, description: service.description, kicker: service.kicker, intro: service.intro },
  ])),
  '/projecten': { title: 'Projectfoto’s', description: 'Bekijk beelden van echte projecten van Alaina Bouw Klusbedrijf. De foto’s tonen verschillende werkzaamheden; locaties en aanvullende projectgegevens worden alleen vermeld als die zijn bevestigd.', kicker: 'Echt werk, in beeld', intro: 'Een selectie foto’s van echte projecten. De beelden tonen verschillende ruimtes en werkzaamheden; we voegen geen onbevestigde klantnamen, locaties of projectresultaten toe.' },
  '/werkwijze': { title: 'Werkwijze', description: 'Lees hoe u een eerste gesprek met Alaina Bouw Klusbedrijf kunt starten. Definitieve procesafspraken worden nog aangevuld.', kicker: 'Van eerste vraag naar helder plan', intro: 'Een goed begin is een duidelijke vraag. Dit is de voorgestelde route op deze website; praktische afspraken worden bevestigd zodra u contact heeft.' },
  '/over-ons': { title: 'Over Alaina Bouw', description: 'Alaina Bouw Klusbedrijf: bedrijfsinformatie volgt na verificatie. Ontdek hoe u een vraag kunt voorleggen.', kicker: 'Een kennismaking', intro: 'We willen dat u vooraf weet met wie en waarover u contact opneemt. De gecontroleerde bedrijfsinformatie wordt hier aangevuld zodra die beschikbaar is.' },
  '/werkgebied': { title: 'Werkgebied: heel Nederland', description: 'Alaina Bouw Klusbedrijf werkt in heel Nederland. De projectplaats helpt bij de praktische afstemming; beschikbaarheid wordt per aanvraag besproken.', kicker: 'Landelijk werkgebied', intro: 'Alaina Bouw Klusbedrijf werkt in heel Nederland. Er is geen voorkeursregio; uw projectplaats helpt alleen bij de praktische afstemming van de aanvraag.' },
  '/contact': { title: 'Contact', description: 'Neem contact op met Alaina Bouw Klusbedrijf via het aanvraagformulier. Telefoon- en adresgegevens volgen na verificatie.', kicker: 'Vertel waar u aan denkt', intro: 'Gebruik het formulier om uw vraag rustig uiteen te zetten. Telefoonnummer, e-mailadres en bezoekadres van het bedrijf zijn nog niet geverifieerd.' },
  '/offerte-aanvragen': { title: 'Offerte aanvragen', description: 'Beschrijf uw klus in enkele stappen. Uw aanvraag wordt pas bevestigd na succesvolle opslag.', kicker: 'Een aanvraag begint met uw verhaal', intro: 'Deel de hoofdlijnen van uw plannen. Na verzending ziet u hier alleen een bevestiging als de aanvraag daadwerkelijk is opgeslagen.' },
  '/privacy': { title: 'Privacyverklaring', description: 'Lees hoe gegevens via deze website worden verwerkt. Definitieve verantwoordelijke gegevens moeten nog worden ingevuld.', kicker: 'Privacy', intro: 'Deze pagina bevat algemene informatie voor deze website. De verantwoordelijke bedrijfsgegevens en definitieve bewaartermijnen moeten nog door Alaina Bouw worden bevestigd.' },
  '/cookies': { title: 'Cookiebeleid', description: 'Informatie over cookies op deze website. Controleer het beleid na definitieve inrichting van analytics en toestemmingsbeheer.', kicker: 'Cookies', intro: 'Deze website gebruikt functionele techniek die nodig is om pagina’s en formulieren te laten werken. Eventuele aanvullende cookies en meetdiensten moeten nog worden geïnventariseerd.' },
  '/algemene-voorwaarden': { title: 'Algemene voorwaarden', description: 'Voorlopige informatie over voorwaarden. Dit is geen juridisch vastgesteld document; voorwaarden moeten worden aangeleverd.', kicker: 'Afspraken', intro: 'Er zijn nog geen door het bedrijf bevestigde algemene voorwaarden aangeleverd. Onderstaande uitleg is geen vervanging voor juridisch vastgestelde voorwaarden.' },
};

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return <header style={{ background: '#FAF9F7', borderBottom: '1px solid #e4e1dc' }}>
    <div className="wrap" style={{ minHeight: 88, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 26 }}>
      <Link href="/" aria-label="Alaina Bouw Klusbedrijf — naar home" data-testid="link-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Alaina Bouw Klusbedrijf" width={92} height={68} style={{ height: 68, width: 92, objectFit: 'cover', objectPosition: 'center', mixBlendMode: 'multiply' }} />
        <span style={{ display: 'grid', lineHeight: 1.15, marginLeft: 8 }}><strong className="serif" style={{ fontSize: 18, letterSpacing: '.02em' }}>ALAINA BOUW</strong><small style={{ letterSpacing: '.22em', color: '#706c67', fontSize: 9, marginTop: 5 }}>KLUSBEDRIJF</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie" style={{ display: 'flex', gap: 25, alignItems: 'center' }}>
        {navItems.map(([text, href]) => <Link key={href} href={href} className="nav-link" aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${href.split('/').pop()}`}>{text}</Link>)}
      </nav>
      <Link href="/offerte-aanvragen" className="btn desktop-nav" data-testid="link-offerte-header" style={{ minHeight: 43, padding: '0 16px', fontSize: 13 }}>Bespreek uw plannen <ArrowRight size={15} /></Link>
      <button className="mobile-menu" type="button" aria-expanded={open} aria-label={open ? 'Menu sluiten' : 'Menu openen'} onClick={() => setOpen(!open)} data-testid="button-mobile-menu" style={{ background: 'none', border: 0, padding: 10 }}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav aria-label="Mobiele navigatie" style={{ display: 'grid', padding: '4px 18px 20px', gap: 3, background: '#FAF9F7' }}>
      {[...navItems, ['Contact', '/contact']].map(([text, href]) => <Link key={href} href={href} className="nav-link" onClick={() => setOpen(false)} style={{ padding: 12, borderTop: '1px solid #e4e1dc' }}>{text}</Link>)}
      <Link href="/offerte-aanvragen" onClick={() => setOpen(false)} className="btn" style={{ marginTop: 10 }}>Bespreek uw plannen <ArrowRight size={15} /></Link>
    </nav>}
  </header>;
}

function Footer() {
  return <footer style={{ background: '#191817', color: '#f7f4ef', padding: '64px 0 28px' }}>
    <div className="wrap">
      <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 42, paddingBottom: 52 }}>
        <div><p className="eyebrow" style={{ color: '#d98687' }}>ALAINA BOUW KLUSBEDRIJF</p><h2 className="serif" style={{ fontWeight: 500, fontSize: 30, lineHeight: 1.15, maxWidth: 300 }}>Goed werk begint met een goed gesprek.</h2><p style={{ fontSize: 13, color: '#bdb8b1', lineHeight: 1.7, maxWidth: 340 }}>Uw plannen bespreken? Vertel ons wat u voor ogen heeft via de aanvraag.</p><Link className="btn" href="/offerte-aanvragen" data-testid="link-offerte-footer">Naar aanvraag <ArrowRight size={15} /></Link></div>
        <div><h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: '#d98687' }}>Ontdek</h3>{[['Diensten','/diensten'],['Projecten','/projecten'],['Werkwijze','/werkwijze'],['Over ons','/over-ons']].map(([t,h])=><Link key={h} href={h} style={{ display:'block', color:'#e7e2dc', textDecoration:'none', fontSize:13, marginTop:14 }}>{t}</Link>)}</div>
        <div><h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: '#d98687' }}>Informatie</h3>{[['Werkgebied','/werkgebied'],['Contact','/contact'],['Privacy','/privacy'],['Cookies','/cookies']].map(([t,h])=><Link key={h} href={h} style={{ display:'block', color:'#e7e2dc', textDecoration:'none', fontSize:13, marginTop:14 }}>{t}</Link>)}</div>
        <div><h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.14em', color: '#d98687' }}>Contact</h3><p style={{ color:'#e7e2dc',fontSize:13,lineHeight:1.7 }}>Bedrijfscontactgegevens zijn nog niet geverifieerd.<br />Stel uw vraag via het aanvraagformulier.</p><Link href="/contact" style={{ color:'#fff',fontSize:13 }}>Contactpagina <ArrowRight size={13} /></Link></div>
      </div>
      <div className="rule" style={{ background: '#403d3a' }} />
      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16, paddingTop:20, color:'#a6a09a', fontSize:11 }}><span>© {new Date().getFullYear()} Alaina Bouw Klusbedrijf</span><Link href="/algemene-voorwaarden" style={{ color:'inherit' }}>Algemene voorwaarden</Link><span>Bedrijfsgegevens worden aangevuld na verificatie.</span></div>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    const route = pages[location];
    const title = location === '/' ? 'Alaina Bouw Klusbedrijf | Ruimte voor uw plannen' : `${route?.title ?? 'Pagina niet gevonden'} | Alaina Bouw Klusbedrijf`;
    const description = location === '/' ? 'Stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en laminaat leggen in heel Nederland. Bespreek uw klus met Alaina Bouw.' : route?.description ?? 'Deze pagina is niet gevonden. Bekijk de diensten of neem contact op met Alaina Bouw Klusbedrijf.';
    document.title = title;
    const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    const pageUrl = new URL(window.location.pathname, window.location.origin).href;
    const logoUrl = new URL(logo, window.location.origin).href;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', logoUrl);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', logoUrl);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;
  }, [location]);
  return <><a href="#main" style={{ position:'absolute',left:-1000,top:10,padding:10,background:'#fff',zIndex:30 }} onFocus={(e)=>{e.currentTarget.style.left='10px';}} onBlur={(e)=>{e.currentTarget.style.left='-1000px';}}>Ga naar inhoud</a><Header /><main id="main">{children}</main><Footer /><div className="mobile-action-bar" role="group" aria-label="Snelle acties"><Link href="/contact" className="btn secondary" data-testid="link-mobile-contact">Contact</Link><Link href="/offerte-aanvragen" className="btn" data-testid="link-mobile-offerte">Offerte aanvragen <ArrowRight size={15}/></Link></div></>;
}

function ServiceCards() {
  return <div className="columns-3" style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:14}}>
    {serviceItems.map((service,index)=><Link key={service.slug} href={`/diensten/${service.slug}`} className="card" data-testid={`card-service-${service.slug}`} style={{padding:'28px 26px',textDecoration:'none',minHeight:205,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div>
        <span className="eyebrow">{String(index+1).padStart(2,'0')} / DIENST</span>
        <h3 className="serif" style={{fontSize:27,fontWeight:500,margin:'14px 0 8px'}}>{service.title}</h3>
        <p style={{color:'#706c67',fontSize:13,lineHeight:1.6,margin:0}}>{service.summary}</p>
      </div>
      <span style={{color:'#A90F14',fontSize:12,marginTop:20}}>Bekijk dienst <ArrowRight size={14} style={{verticalAlign:'middle'}}/></span>
    </Link>)}
  </div>;
}

function Home() {
  return <>
    <section className="wrap hero-grid" style={{ display:'grid', gridTemplateColumns:'1.02fr .98fr', minHeight:590, alignItems:'center', gap:50, paddingTop:42, paddingBottom:46 }}>
      <div style={{ padding:'42px 0' }}>
        <p className="eyebrow">ALAINA BOUW KLUSBEDRIJF · UW PLANNEN, EERST</p>
        <h1 className="serif" style={{ fontSize:'clamp(46px,6vw,78px)', lineHeight:.99, fontWeight:500, margin:'22px 0 24px', maxWidth:640 }}>Een huis dat weer <em style={{ color:'#A90F14', fontStyle:'normal' }}>bij u past.</em></h1>
        <p style={{ maxWidth:480, color:'#625d58', fontSize:17, lineHeight:1.75 }}>Van stukadoorswerk en schilderwerk tot tuinwerk, tegelwerk en laminaat leggen. Vertel wat u wilt laten doen; beschikbaarheid stemmen we per aanvraag af.</p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:30 }}><Link href="/offerte-aanvragen" className="btn" data-testid="link-hero-aanvraag">Bespreek uw plannen <ArrowRight size={17}/></Link><Link href="/diensten" className="btn secondary" data-testid="link-hero-diensten">Bekijk mogelijkheden</Link></div>
        <p style={{ color:'#706c67',fontSize:11,marginTop:22 }}>Werkgebied: heel Nederland. Beschikbaarheid wordt per aanvraag afgestemd.</p>
      </div>
      <div className="hero-art" style={{ height:480, minHeight:380 }}>
        <img src={projectPhotos[0].src} alt={projectPhotos[0].alt} width={1000} height={1333} fetchPriority="high" />
        <div style={{ position:'absolute', top:24,left:24,background:'#FAF9F7',padding:'16px 20px',maxWidth:190 }}>
          <span className="eyebrow" style={{ fontSize:9 }}>EERST LUISTEREN</span><p className="serif" style={{ fontSize:19,margin:'8px 0 0' }}>Wat wilt u anders zien?</p>
        </div>
        <div style={{ position:'absolute', right:22,bottom:38,background:'#A90F14',color:'#fff',padding:'17px 20px',width:150 }}>
          <span style={{ fontSize:10,letterSpacing:'.12em' }}>UW WONING</span><div style={{ fontSize:30,fontFamily:'var(--app-font-serif)',marginTop:4 }}>Uw plan.</div>
        </div>
      </div>
    </section>
    <section style={{ background:'#F1EFEB',padding:'23px 0' }}><div className="wrap" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap' }}><span className="eyebrow">ECHT WERK, IN BEELD</span><span style={{ fontSize:13,color:'#706c67' }}>Foto’s van echte projecten; aanvullende projectdetails worden alleen vermeld als ze bevestigd zijn.</span></div></section>
    <section className="section-pad"><div className="wrap">
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:70,alignItems:'end',marginBottom:42 }} className="columns-2"><div><p className="eyebrow">ONZE DIENSTEN</p><h2 className="serif" style={{fontSize:'clamp(34px,4vw,52px)',fontWeight:500,margin:'15px 0'}}>Wat wilt u laten doen?</h2></div><p style={{color:'#706c67',lineHeight:1.8,maxWidth:530}}>Stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en laminaat leggen. Staat uw klus er niet bij? U kunt die ook voorleggen; de mogelijkheden stemmen we per aanvraag af.</p></div>
      <ServiceCards/>
    </div></section>
    <section style={{background:'#1b1a19',color:'#f9f7f4'}} className="section-pad"><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'.8fr 1.2fr',gap:80,alignItems:'center'}}><div><p className="eyebrow" style={{color:'#d98687'}}>GEEN GISSEN, WEL GOED AFSTEMMEN</p><h2 className="serif" style={{fontSize:'clamp(36px,5vw,60px)',fontWeight:500,lineHeight:1.08,margin:'18px 0'}}>Uw eerste stap mag klein zijn.</h2><Link href="/werkwijze" style={{color:'#fff',fontSize:13}}>Zo werkt een aanvraag <ArrowRight size={14}/></Link></div><div style={{display:'grid',gap:0}}>{[['01','Vertel wat u wilt aanpakken','Deel uw idee, vraag of aandachtspunt.'],['02','Geef wat context','Planning, plaats en budget helpen om de vraag te begrijpen.'],['03','We bekijken de vervolgstap','Uw aanvraag wordt bevestigd zodra deze succesvol is opgeslagen.']].map(([n,t,d])=><div key={n} style={{display:'grid',gridTemplateColumns:'48px 1fr',gap:16,padding:'20px 0',borderTop:'1px solid #45413e'}}><span style={{color:'#dc8c8d',fontSize:12}}>{n}</span><div><h3 style={{fontWeight:500,fontSize:17,margin:'0 0 6px'}}>{t}</h3><p style={{color:'#b9b3ad',fontSize:13,margin:0,lineHeight:1.6}}>{d}</p></div></div>)}</div></div></section>
    <section className="section-pad"><div className="wrap"><div className="columns-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:50,alignItems:'end',marginBottom:28}}><div><p className="eyebrow">PROJECTFOTO’S</p><h2 className="serif" style={{fontSize:44,fontWeight:500,lineHeight:1.08,margin:'12px 0'}}>Een indruk van echt werk.</h2></div><div><p style={{color:'#706c67',lineHeight:1.8}}>De beelden zijn aangeleverd van echte projecten. We noemen geen klantnamen, locaties of projectresultaten die niet afzonderlijk zijn bevestigd.</p><Link href="/projecten" className="btn secondary">Bekijk de projectfoto’s <ArrowRight size={15}/></Link></div></div><div className="home-project-grid">{projectPhotos.filter(photo=>photo.featured).map(photo=><ProjectPhotoCard key={photo.src} photo={photo} />)}</div></div></section>
    <section style={{background:'#f1efeb',padding:'75px 0'}}><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:25,alignItems:'center'}}><div><p className="eyebrow">BEGIN BIJ UW VRAAG</p><h2 className="serif" style={{fontSize:'clamp(32px,4vw,48px)',fontWeight:500,margin:'10px 0'}}>Wat wilt u veranderen?</h2><p style={{color:'#706c67',margin:0}}>Een paar regels zijn genoeg om een gesprek te beginnen.</p></div><Link href="/offerte-aanvragen" className="btn">Start uw aanvraag <ArrowRight size={16}/></Link></div></section>
  </>;
}

function ProjectPhotoCard({ photo }: { photo: (typeof projectPhotos)[number] }) {
  return <figure className="project-photo-card" style={{ margin: 0 }}>
    <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
    <figcaption>{photo.caption}</figcaption>
  </figure>;
}

function RequestForm() {
  const [step,setStep] = useState(1);
  const requestedService = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('service') ?? '';
  const validServiceValues = [...serviceItems.map((service) => service.slug), 'anders'];
  const [values,setValues] = useState({ service:validServiceValues.includes(requestedService) ? requestedService : '', description:'', timeline:'', city:'', postalCode:'', budget:'', name:'', phone:'', email:'', contactPreference:'email', privacyConsent:false, website:'' });
  const [validation,setValidation] = useState('');
  const mutation = useCreateLead();
  const change = (key: keyof typeof values, value: string | boolean) => setValues(v=>({...v,[key]:value}));
  const validateStep = (target:number) => {
    if(target===1 && (!values.service || values.description.trim().length<10)) return 'Kies een dienst en beschrijf uw plannen in minimaal 10 tekens.';
    if(target===2 && (values.timeline==='' || values.city.trim().length<2)) return 'Kies een planning en vul uw plaats in.';
    if(target===3 && (values.name.trim().length<2 || values.phone.trim().length<6 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.privacyConsent)) return 'Controleer uw naam, telefoonnummer, e-mailadres en privacytoestemming.';
    return '';
  };
  const next = () => { const err=validateStep(step); if(err){setValidation(err);return;} setValidation('');setStep(s=>Math.min(s+1,3)); };
  const submit = (e:FormEvent) => {
    e.preventDefault(); const err=validateStep(3); if(err){setValidation(err);setStep(3);return;} setValidation('');
    const utmSource = entryParams.get('utm_source') ?? undefined;
    const utmMedium = entryParams.get('utm_medium') ?? undefined;
    const utmCampaign = entryParams.get('utm_campaign') ?? undefined;
    mutation.mutate({data:{
      service:values.service,description:values.description.trim(),timeline:values.timeline as 'asap'|'within_month'|'one_to_three_months'|'three_to_six_months'|'exploring',
      city:values.city.trim(),...(values.postalCode.trim()?{postalCode:values.postalCode.trim()}:{}),
      ...(values.budget?{budget:values.budget as 'under_2500'|'2500_5000'|'5000_10000'|'10000_25000'|'over_25000'|'undecided'}:{}),
      name:values.name.trim(),phone:values.phone.trim(),email:values.email.trim(),contactPreference:values.contactPreference as 'phone'|'email'|'whatsapp',
      privacyConsent:true,...(values.website?{website:values.website}:{}),
      ...(utmSource?{utmSource}:{}),...(utmMedium?{utmMedium}:{}),...(utmCampaign?{utmCampaign}:{})
    }});
  };
  if(mutation.isSuccess) return <section className="card" aria-live="polite" data-testid="status-lead-success" style={{padding:'34px 30px',maxWidth:650,margin:'0 auto'}}><span style={{display:'grid',placeItems:'center',width:42,height:42,borderRadius:'50%',background:'#e7eee6',color:'#305a35'}}><Check/></span><p className="eyebrow" style={{marginTop:22}}>AANVRAAG OPGESLAGEN</p><h2 className="serif" style={{fontSize:36,fontWeight:500,margin:'8px 0 12px'}}>Dank u, {values.name}.</h2><p style={{color:'#625d58',lineHeight:1.75}}>Uw aanvraag is door het systeem bevestigd als opgeslagen{mutation.data?.reference ? ` (referentie ${mutation.data.reference})` : ''}. De vervolgstap en contactmoment worden nog niet toegezegd; bedrijfscontactgegevens zijn nog niet geverifieerd.</p><p style={{fontSize:12,color:'#706c67'}}>Bewaar deze bevestiging voor uw eigen administratie.</p></section>;
  const selectClass='field';
  return <form onSubmit={submit} noValidate data-testid="form-lead">
    <div role="progressbar" aria-label={`Stap ${step} van 3`} aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} style={{display:'flex',gap:8,marginBottom:26}}>{[1,2,3].map(i=><div key={i} aria-hidden="true" style={{height:3,flex:1,background:i<=step?'#A90F14':'#ddd9d2'}} />)}</div>
    <p className="eyebrow" data-testid="text-form-step">STAP {step} VAN 3</p>
    {step===1&&<div style={{display:'grid',gap:19}}>
      <h2 className="serif" style={{fontSize:30,fontWeight:500,margin:'0 0 2px'}}>Waar gaat uw plan over?</h2>
      <label className={selectClass}>Dienst <select required value={values.service} onChange={e=>change('service',e.target.value)} data-testid="select-service"><option value="">Kies een dienst</option>{serviceItems.map(service=><option key={service.slug} value={service.slug}>{service.title}</option>)}<option value="anders">Overige klus</option></select><small>Kies de dienst die het beste past. Voor een andere klus kiest u “Overige klus”.</small></label>
      <label className={selectClass}>Omschrijving <textarea required minLength={10} maxLength={4000} value={values.description} onChange={e=>change('description',e.target.value)} placeholder="Wat wilt u aanpakken? Wat is voor u belangrijk?" data-testid="textarea-description"/><small>{values.description.length}/4000 tekens · minimaal 10 tekens</small></label>
    </div>}
    {step===2&&<div style={{display:'grid',gap:19}}>
      <h2 className="serif" style={{fontSize:30,fontWeight:500,margin:'0 0 2px'}}>Waar en wanneer?</h2>
      <label className={selectClass}>Gewenste planning <select required value={values.timeline} onChange={e=>change('timeline',e.target.value)} data-testid="select-timeline"><option value="">Kies een indicatie</option><option value="asap">Zo snel mogelijk</option><option value="within_month">Binnen een maand</option><option value="one_to_three_months">Binnen 1–3 maanden</option><option value="three_to_six_months">Binnen 3–6 maanden</option><option value="exploring">Ik ben me nog aan het oriënteren</option></select></label>
      <div className="columns-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><label className={selectClass}>Plaats van het project <input required value={values.city} onChange={e=>change('city',e.target.value)} placeholder="Plaats in Nederland" data-testid="input-city"/></label><label className={selectClass}>Postcode <input value={values.postalCode} onChange={e=>change('postalCode',e.target.value)} maxLength={10} placeholder="Bijv. 1234 AB" data-testid="input-postal-code"/><small>Optioneel; handig voor de praktische afstemming.</small></label></div>
      <label className={selectClass}>Budgetindicatie <select value={values.budget} onChange={e=>change('budget',e.target.value)} data-testid="select-budget"><option value="">Liever nog niet aangeven</option><option value="under_2500">Minder dan € 2.500</option><option value="2500_5000">€ 2.500 – € 5.000</option><option value="5000_10000">€ 5.000 – € 10.000</option><option value="10000_25000">€ 10.000 – € 25.000</option><option value="over_25000">Meer dan € 25.000</option><option value="undecided">Nog onbekend</option></select><small>Een indicatie, geen prijsopgave.</small></label>
    </div>}
    {step===3&&<div style={{display:'grid',gap:17}}>
      <h2 className="serif" style={{fontSize:30,fontWeight:500,margin:'0 0 2px'}}>Hoe kunnen we u bereiken?</h2>
      <div className="columns-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><label className={selectClass}>Naam <input required maxLength={120} value={values.name} onChange={e=>change('name',e.target.value)} autoComplete="name" data-testid="input-name"/></label><label className={selectClass}>Telefoonnummer <input required type="tel" maxLength={40} value={values.phone} onChange={e=>change('phone',e.target.value)} autoComplete="tel" data-testid="input-phone"/></label></div>
      <label className={selectClass}>E-mailadres <input required type="email" maxLength={254} value={values.email} onChange={e=>change('email',e.target.value)} autoComplete="email" data-testid="input-email"/></label>
      <label className={selectClass}>Voorkeur voor contact <select value={values.contactPreference} onChange={e=>change('contactPreference',e.target.value)} data-testid="select-contact-preference"><option value="email">E-mail</option><option value="phone">Telefoon</option><option value="whatsapp">WhatsApp</option></select><small>Contactgegevens van het bedrijf zijn nog niet geverifieerd.</small></label>
      <label style={{display:'flex',alignItems:'start',gap:10,fontSize:13,lineHeight:1.55}}><input type="checkbox" checked={values.privacyConsent} onChange={e=>change('privacyConsent',e.target.checked)} required data-testid="checkbox-privacy-consent" style={{marginTop:3,accentColor:'#A90F14'}}/><span>Ik ga akkoord met de verwerking van mijn gegevens zoals beschreven in de <Link href="/privacy" style={{color:'#8f1418'}}>privacyverklaring</Link>.</span></label>
      <label aria-hidden="true" style={{position:'absolute',left:'-10000px',width:1,height:1,overflow:'hidden'}}>Laat dit veld leeg<input tabIndex={-1} autoComplete="off" value={values.website} onChange={e=>change('website',e.target.value)} data-testid="input-website-honeypot"/></label>
    </div>}
    {validation&&<p role="alert" data-testid="status-validation-error" style={{background:'#fbefee',color:'#851116',padding:'12px 14px',fontSize:13,lineHeight:1.5,marginTop:18}}>{validation}</p>}
    {mutation.isError&&<div role="alert" data-testid="status-submit-error" style={{background:'#fbefee',color:'#851116',padding:'13px 14px',fontSize:13,lineHeight:1.6,marginTop:16}}><strong>Uw aanvraag is niet bevestigd.</strong><br/>De gegevens zijn bewaard in het formulier. Controleer uw verbinding en probeer opnieuw.</div>}
    <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:25}}>
      {step>1?<button type="button" className="btn secondary" onClick={()=>{setValidation('');setStep(s=>s-1);}} data-testid="button-previous-step"><ArrowLeft size={15}/> Vorige</button>:<span/>}
      {step<3?<button type="button" className="btn" onClick={next} data-testid="button-next-step">Verder <ArrowRight size={15}/></button>:<button type="submit" className="btn" disabled={mutation.isPending} data-testid="button-submit-lead">{mutation.isPending?'Aanvraag wordt opgeslagen…':'Aanvraag versturen'} <ArrowRight size={15}/></button>}
    </div>
    <p style={{fontSize:11,color:'#706c67',lineHeight:1.6,marginTop:18}}>Foto’s kunt u hier niet uploaden. Beschrijf zo goed mogelijk wat u wilt bespreken; er worden geen afbeeldingen meegestuurd.</p>
  </form>;
}

function RequestPage() {
  const p=pages['/offerte-aanvragen'];
  return <><div className="wrap page-head" style={{padding:'94px 0 60px'}}><p className="eyebrow">{p.kicker}</p><h1 className="serif" style={{fontSize:'clamp(42px,6vw,70px)',fontWeight:500,lineHeight:1.04,maxWidth:800,margin:'18px 0'}}>{p.title}</h1><p style={{fontSize:17,lineHeight:1.7,color:'#625d58',maxWidth:700}}>{p.intro}</p></div><section style={{background:'#f1efeb',padding:'44px 0 88px'}}><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'minmax(0,1.25fr) minmax(230px,.75fr)',gap:38,alignItems:'start'}}><div className="card" style={{padding:'clamp(22px,4vw,42px)'}}><RequestForm/></div><aside style={{padding:'16px 0'}}><span className="eyebrow">VOOR U VERZENDT</span><h2 className="serif" style={{fontSize:28,fontWeight:500,margin:'12px 0'}}>Een transparante start.</h2><p style={{fontSize:14,color:'#706c67',lineHeight:1.75}}>Uw aanvraag bevat genoeg om uw vraag te begrijpen. Een verzendbevestiging verschijnt uitsluitend wanneer de opslag is bevestigd.</p><div className="rule" style={{margin:'24px 0'}}/><p style={{fontSize:13,color:'#706c67',lineHeight:1.7}}>Alaina Bouw werkt in heel Nederland. Beschikbaarheid, planning en mogelijke vervolgstappen worden per aanvraag afgestemd.</p></aside></div></section></>;
}

function GenericPage({path}:{path:string}) {
  const p=pages[path];
  if(path==='/offerte-aanvragen') return <RequestPage/>;
  if(path==='/contact') return <><PageIntro p={p}/><section style={{background:'#f1efeb',padding:'56px 0 88px'}}><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'1fr .8fr',gap:55,alignItems:'start'}}><div><p className="eyebrow">CONTACT VIA FORMULIER</p><h2 className="serif" style={{fontSize:38,fontWeight:500}}>Een vraag of plan?</h2><p style={{color:'#706c67',lineHeight:1.75}}>Beschrijf uw vraag via de aanvraag. Telefoon, e-mail en bezoekadres van het bedrijf worden hier pas getoond zodra ze geverifieerd zijn.</p><Link href="/offerte-aanvragen" className="btn">Naar het aanvraagformulier <ArrowRight size={15}/></Link></div><div className="card" style={{padding:28}}><p className="eyebrow">BEDRIJFSGEGEVENS</p><h3 className="serif" style={{fontSize:25,fontWeight:500}}>Nog ter bevestiging</h3><p style={{fontSize:13,color:'#706c67',lineHeight:1.7}}>Telefoonnummer, e-mailadres, vestigingsadres, KvK- en btw-gegevens zijn niet aangeleverd. We vullen ze pas in na verificatie.</p></div></div></section></>;
  if(path==='/diensten') return <><PageIntro p={p}/><ServicesIndex/></>;
  if(path.startsWith('/diensten/')) return <><PageIntro p={p}/><ServicePage path={path}/></>;
  return <><PageIntro p={p}/><InformationSections path={path}/></>;
}
function PageIntro({p}:{p:typeof pages[string]}) {
  return <section className="page-head" style={{background:'#f1efeb',padding:'90px 0 70px'}}><div className="wrap"><p className="eyebrow">{p.kicker}</p><h1 className="serif" style={{fontSize:'clamp(44px,6vw,72px)',fontWeight:500,lineHeight:1.02,maxWidth:900,margin:'18px 0 22px'}}>{p.title}</h1><p style={{fontSize:18,lineHeight:1.75,color:'#625d58',maxWidth:760}}>{p.intro}</p></div></section>;
}
function ServicesIndex() {
  return <section className="section-pad"><div className="wrap">
    <div className="project-gallery-intro" style={{marginBottom:42}}>
      <p className="eyebrow">STUKADOORSWERK · SCHILDERWERK · TUINWERK · TEGELWERK · LAMINAAT LEGGEN</p>
      <h2 className="serif" style={{fontSize:'clamp(34px,4vw,48px)',fontWeight:500,margin:'12px 0'}}>Diensten voor uw woning</h2>
      <p style={{color:'#706c67',lineHeight:1.8,maxWidth:720}}>Kies de dienst die bij uw klus past. Alaina Bouw werkt in heel Nederland; de plaats en gewenste planning helpen bij de praktische afstemming.</p>
    </div>
    <ServiceCards/>
    <div className="project-gallery-cta">
      <p className="eyebrow">ANDERE KLUS?</p>
      <h2 className="serif" style={{fontSize:32,fontWeight:500,margin:'8px 0 12px'}}>Staat uw klus er niet bij?</h2>
      <p style={{color:'#625d58',lineHeight:1.7,maxWidth:650}}>Kies in het aanvraagformulier voor “Overige klus” en beschrijf wat u wilt laten doen. De mogelijkheden worden per aanvraag afgestemd.</p>
      <Link href="/offerte-aanvragen?service=anders" className="btn">Leg uw klus voor <ArrowRight size={15}/></Link>
    </div>
  </div></section>;
}
function ServicePage({path}:{path:string}) {
  const service = serviceItems.find((item) => `/diensten/${item.slug}` === path);
  if(!service) return <NotFound/>;
  return <>
    <section className="section-pad">
      <div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'1fr .9fr',gap:56,alignItems:'center'}}>
        <div>
          <p className="eyebrow">{service.kicker}</p>
          <h2 className="serif" style={{fontSize:40,fontWeight:500,lineHeight:1.12}}>Vertel wat u wilt laten doen.</h2>
          <p style={{color:'#706c67',lineHeight:1.8}}>{service.requestHint} Vermeld ook de plaats en gewenste planning.</p>
          <Link href={`/offerte-aanvragen?service=${service.slug}`} className="btn">Vraag deze dienst aan <ArrowRight size={15}/></Link>
        </div>
        <div className="national-service-card">
          <span className="eyebrow" style={{color:'#e7a1a2'}}>WERKGEBIED</span>
          <p className="serif">Heel Nederland</p>
          <div className="rule" style={{background:'#5a5450'}}/>
          <p>Beschikbaarheid en planning worden per aanvraag afgestemd.</p>
        </div>
      </div>
    </section>
    <section style={{background:'#f1efeb',padding:'70px 0'}}>
      <div className="wrap">
        <p className="eyebrow">EEN DUIDELIJKE AANVRAAG</p>
        <h2 className="serif" style={{fontSize:36,fontWeight:500}}>Zo bespreekt u uw klus.</h2>
        <div className="columns-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,marginTop:30}}>
          {[
            ['01','Beschrijf uw klus','Vertel wat u wilt laten doen en om welke ruimte of onderdelen het gaat.'],
            ['02','Geef de context','Vul de plaats en gewenste planning in; postcode en budget zijn optioneel.'],
            ['03','Verstuur uw aanvraag','U ziet een bevestiging zodra de aanvraag succesvol is opgeslagen.'],
          ].map(([number,title,description])=><div key={number} style={{borderTop:'1px solid #b9b3ad',paddingTop:18}}>
            <span className="eyebrow">{number}</span>
            <h3 style={{fontSize:17,fontWeight:600}}>{title}</h3>
            <p style={{color:'#706c67',fontSize:13,lineHeight:1.7}}>{description}</p>
          </div>)}
        </div>
      </div>
    </section>
  </>;
}
function InformationSections({path}:{path:string}) {
  if(path==='/projecten') return <section className="section-pad"><div className="wrap"><div className="project-gallery-intro"><p className="eyebrow">Echt werk, in beeld</p><h2 className="serif" style={{fontSize:'clamp(34px,4vw,48px)',fontWeight:500,margin:'12px 0'}}>Foto’s van echte projecten.</h2><p style={{color:'#706c67',lineHeight:1.8,maxWidth:720}}>Deze beelden zijn aangeleverd van echte projecten en tonen verschillende ruimtes en werkzaamheden. We noemen geen klantnamen, locaties of projectresultaten die niet afzonderlijk zijn bevestigd.</p></div><div className="project-gallery">{projectPhotos.map(photo=><ProjectPhotoCard key={photo.src} photo={photo}/>)}</div><div className="project-gallery-cta"><p className="eyebrow">WERKGEBIED: HEEL NEDERLAND</p><h2 className="serif" style={{fontSize:32,fontWeight:500,margin:'8px 0 20px'}}>Heeft u een plan voor uw woning?</h2><Link href="/offerte-aanvragen" className="btn">Bespreek uw plannen <ArrowRight size={15}/></Link></div></div></section>;
  if(path==='/werkwijze') return <section className="section-pad"><div className="wrap"><div style={{maxWidth:700,marginBottom:46}}><p className="eyebrow">VOORGESTELDE ROUTE</p><h2 className="serif" style={{fontSize:42,fontWeight:500}}>Van eerste vraag naar passende vervolgstap.</h2><p style={{color:'#706c67',lineHeight:1.8}}>Dit is een overzicht van de aanvraagflow op deze website. De concrete werkwijze van het bedrijf moet nog worden bevestigd.</p></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 60px'}} className="columns-2">{[['01','Uw vraag delen','Beschrijf het werk en de aanleiding. U kunt uw plannen rustig formuleren.'],['02','Context toevoegen','Vul planning en plaats in; postcode en budget zijn optioneel.'],['03','Gegevens achterlaten','Kies hoe u bij voorkeur bereikbaar bent en geef toestemming voor verwerking.'],['04','Opslag bevestigd','Na een succesvolle API-bevestiging ziet u een ontvangststatus. Er wordt geen reactie- of starttermijn toegezegd.']].map(([a,b,c])=><div key={a} style={{borderTop:'1px solid #d8d3cc',padding:'24px 0',display:'grid',gridTemplateColumns:'52px 1fr',gap:15}}><span className="eyebrow">{a}</span><div><h3 style={{fontSize:18,margin:'0 0 8px'}}>{b}</h3><p style={{color:'#706c67',fontSize:13,lineHeight:1.7,margin:0}}>{c}</p></div></div>)}</div><Link href="/offerte-aanvragen" className="btn" style={{marginTop:25}}>Begin uw aanvraag <ArrowRight size={15}/></Link></div></section>;
  if(path==='/werkgebied') return <section className="section-pad"><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:50,alignItems:'center'}}><div><p className="eyebrow">Landelijk werkgebied</p><h2 className="serif" style={{fontSize:40,fontWeight:500}}>Alaina Bouw werkt in heel Nederland.</h2><p style={{color:'#706c67',lineHeight:1.8}}>Er is geen voorkeursregio: projecten kunnen overal in Nederland worden voorgelegd. De plaats en eventueel postcode helpen bij de praktische afstemming; beschikbaarheid en planning worden per aanvraag besproken.</p><Link href="/offerte-aanvragen" className="btn">Bespreek uw project <ArrowRight size={15}/></Link></div><div className="national-service-card"><span className="eyebrow" style={{color:'#e7a1a2'}}>WERKGEBIED</span><p className="serif">Heel Nederland</p><div className="rule" style={{background:'#5a5450'}}/><p>Geen voorkeursregio. Deel de plaats van uw project voor de praktische afstemming.</p></div></div></section>;
  if(path==='/over-ons') return <><section className="section-pad"><div className="wrap columns-2" style={{display:'grid',gridTemplateColumns:'.85fr 1.15fr',gap:56,alignItems:'start'}}><div><p className="eyebrow">ALAINA BOUW KLUSBEDRIJF</p><h2 className="serif" style={{fontSize:42,fontWeight:500,lineHeight:1.1}}>Een naam, een kennismaking — zonder ingevulde aannames.</h2></div><div><p style={{fontSize:16,lineHeight:1.8,color:'#625d58'}}>De merknaam is bekend. Verdere bedrijfsinformatie zoals team, oprichtingsjaar, ervaring, werkwijze, vestigingsplaats en contactgegevens is nog niet geverifieerd. We vullen deze pagina pas aan wanneer de informatie is bevestigd.</p><div className="card" style={{padding:22,marginTop:25}}><span className="eyebrow">WAT WEL VASTSTAAT</span><p style={{marginBottom:0,lineHeight:1.65}}>Alaina Bouw biedt stukadoorswerk, schilderwerk, tuinwerk, tegelwerk en het leggen van laminaat. Werkgebied: heel Nederland.</p></div></div></div></section><section style={{background:'#f1efeb',padding:'60px 0'}}><div className="wrap"><p className="eyebrow">EERST HELDERHEID</p><h2 className="serif" style={{fontSize:34,fontWeight:500}}>Stel een concrete vraag.</h2><Link href="/contact" className="btn secondary">Contact en bedrijfsinformatie <ArrowRight size={15}/></Link></div></section></>;
  return <LegalPage path={path}/>;
}

function LegalPage({path}:{path:string}) {
  const p=pages[path];
  const sections:Record<string,[string,string][]> = {
    '/privacy':[
      ['Wie verwerkt uw gegevens?','De juridische naam, vestigingsadres en contactgegevens van de verwerkingsverantwoordelijke moeten door Alaina Bouw nog worden bevestigd. Dit is een duidelijk gemarkeerde conceptuele informatiepagina en geen definitieve privacyverklaring.'],
      ['Welke gegevens kunt u insturen?','De aanvraag vraagt naar werksoort, omschrijving, planning, plaats, eventueel postcode en budget, naam, telefoonnummer, e-mailadres, contactvoorkeur en toestemming. Vermeld geen bijzondere of onnodige persoonsgegevens in de omschrijving.'],
      ['Waarom en hoe lang?','Gegevens zijn bedoeld om uw aanvraag te ontvangen en te kunnen behandelen. Grondslag, concrete bewaartermijnen, eventuele verwerkers en procedure voor inzage, correctie of verwijdering moeten vóór ingebruikname worden gecontroleerd en vastgesteld.'],
      ['Uw rechten en vragen','De definitieve contactroute voor privacyvragen is nog niet beschikbaar. Neem voor ingebruikname contact op met de websitebeheerder om verantwoordelijke gegevens en rechtenprocedure aan te vullen.'],
    ],
    '/cookies':[
      ['Noodzakelijke werking','De site gebruikt technische clienttoestand om navigatie en formulierinvoer te ondersteunen. Server-side cookies, analytics, advertentiepixels of andere externe meetdiensten zijn niet bevestigd.'],
      ['Toestemming en instellingen','Als aanvullende cookies of meetdiensten worden toegevoegd, moet vóór plaatsing worden vastgesteld welke toestemming en instellingen nodig zijn. Er is op dit moment geen claim dat dergelijke diensten actief zijn.'],
      ['Vragen','De bedrijfscontactgegevens zijn nog niet geverifieerd. Werk dit beleid bij na een volledige cookie-inventarisatie en vóór publicatie.'],
    ],
    '/algemene-voorwaarden':[
      ['Status van deze pagina','Alaina Bouw heeft nog geen algemene voorwaarden aangeleverd. Deze tekst is uitsluitend een melding dat voorwaarden ontbreken en is geen juridisch bindende set voorwaarden.'],
      ['Offertes en opdrachten','Prijzen, betaling, planning, annulering, uitvoering, aansprakelijkheid en eventuele garanties zijn niet bevestigd. Baseer geen opdracht of overeenkomst op voorbeeldtekst op deze website.'],
      ['Voor ingebruikname','Laat definitieve voorwaarden aanleveren en juridisch controleren. Vermeld daarbij de juiste bedrijfsnaam, registratiegegevens en toepasselijke contactgegevens.'],
    ],
  };
  return <section className="section-pad"><div className="wrap columns-2 legal-layout" style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:70,alignItems:'start'}}>
    <aside className="card legal-sidebar" style={{padding:24}}>
      <span className="eyebrow">DOCUMENTSTATUS</span>
      <p style={{fontSize:14,lineHeight:1.65}}>Informatieve conceptpagina. Gegevens en definitieve tekst moeten nog worden bevestigd.</p>
      <Link href="/contact" style={{color:'#A90F14',fontSize:13}}>Contact <ArrowRight size={13}/></Link>
    </aside>
    <article style={{maxWidth:760}}>
      <p style={{padding:'14px 16px',background:'#f4e8e6',color:'#751015',fontSize:13,lineHeight:1.6}}>Let op: deze pagina is niet juridisch vastgesteld. De verantwoordelijke bedrijfsgegevens ontbreken nog.</p>
      {sections[path]?.map(([h,t],i)=><section key={h} style={{padding:'18px 0',borderBottom:'1px solid #dedad4'}}>
        <span className="eyebrow">0{i+1}</span>
        <h2 className="serif" style={{fontSize:24,fontWeight:500,margin:'8px 0'}}>{h}</h2>
        <p style={{color:'#625d58',fontSize:14,lineHeight:1.8,margin:0}}>{t}</p>
      </section>)}
    </article>
  </div></section>;
}

function NotFound() {
  return <section style={{minHeight:500,display:'grid',placeItems:'center',textAlign:'center',padding:30}}><div><p className="eyebrow">404 · PAGINA NIET GEVONDEN</p><h1 className="serif" style={{fontSize:'clamp(40px,8vw,64px)',fontWeight:500,margin:'12px 0'}}>Hier loopt het pad dood.</h1><p style={{color:'#706c67',maxWidth:480,lineHeight:1.7}}>De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar het begin of bekijk de diensten.</p><div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginTop:25}}><Link href="/" className="btn">Naar home <ArrowRight size={15}/></Link><Link href="/diensten" className="btn secondary">Naar diensten</Link></div></div></section>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Shell><Switch>
    <Route path="/" component={Home}/>
    {routes.filter(x=>x!=='/').map(path=><Route key={path} path={path} component={()=> <GenericPage path={path}/>}/>)}
    <Route component={NotFound}/>
  </Switch></Shell></ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;