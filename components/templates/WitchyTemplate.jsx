"use client";
import { GallerySection } from "./SharedSections";

export default function WitchyTemplate({ site }) {
  const { content, name, profession, logo, gallery, gallery_position, socials, activeSocials, profilePhoto, servicesData } = site;
  const c = content;
  const phone = (c.contact?.phone || "").replace(/\D/g, "");
  const waLink = phone ? `https://wa.me/55${phone}?text=${encodeURIComponent(c.contact?.whatsapp_message || "Olá!")}` : null;
  const igHandle = (c.contact?.instagram || "").replace("@", "");
  const igLink = igHandle ? `https://instagram.com/${igHandle}` : null;
  const ttHandle = (c.contact?.tiktok || "").replace("@", "");
  const ttLink = ttHandle ? `https://tiktok.com/@${ttHandle}` : null;
  const primaryLink = waLink || igLink || ttLink || "#";
  const schema = { "@context": "https://schema.org", "@type": "LocalBusiness", "name": c.seo?.schema_name || name, "description": c.seo?.schema_description || "", "telephone": c.seo?.schema_phone || "" };

  const total = c.services.length;
  const hasOrphan = total % 3 === 1 && total > 3;

  function ServiceCard({ s, full }) {
    const waService = waLink ? `${waLink.split("?text=")[0]}?text=${encodeURIComponent(`Olá! Tenho interesse em: ${s.title}`)}` : null;
    return (
      <div style={{ padding: full ? "32px 48px" : "40px 32px", border: "1px solid rgba(140,40,120,0.18)", transition: "all 0.3s ease", cursor: "default", display: full ? "flex" : "block", alignItems: full ? "center" : "flex-start", gap: full ? 40 : 0, background: "transparent" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(120,30,100,0.12)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ fontSize: full ? 44 : 32, marginBottom: full ? 0 : 20, flexShrink: 0 }}>{s.icon}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: full ? 24 : 20, fontWeight: 400, color: "#e8c0f0", marginBottom: 10, fontStyle: "italic" }}>{s.title}</h3>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: "rgba(237,224,247,0.55)", lineHeight: 1.85, fontWeight: 300, marginBottom: s.price ? 16 : 0 }}>{s.description}</p>
          {s.price && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, fontWeight: 500, color: "#c080d0" }}>{s.price}</span>
              {waService && (
                <a href={waService} target="_blank" rel="noreferrer" style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "#fff", background: "#7a1f68", padding: "6px 16px", borderRadius: 99, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s" }}>
                  Consultar
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function ServicesGrid() {
    if (total <= 3) return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${total}, 1fr)`, gap: 2 }}>
        {c.services.map((s, i) => <ServiceCard key={i} s={s} />)}
      </div>
    );
    if (hasOrphan) {
      const main = c.services.slice(0, total - 1);
      const last = c.services[total - 1];
      return (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 2 }}>
            {main.map((s, i) => <ServiceCard key={i} s={s} />)}
          </div>
          <ServiceCard s={last} full />
        </>
      );
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {c.services.map((s, i) => <ServiceCard key={i} s={s} />)}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#100818", color: "#ede0f7", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        .wt-btn-main:hover{background:#5c1a4a!important;transform:translateY(-2px);box-shadow:0 12px 40px rgba(140,40,120,0.45)!important}
        .wt-social:hover{background:rgba(140,40,120,0.3)!important;border-color:#8c2878!important}
        .wt-consult:hover{background:#5c1a4a!important}
        @media(max-width:768px){
          .wt-hero{grid-template-columns:1fr!important}
          .wt-hero-right{min-height:280px!important}
          .wt-hero-left{padding:100px 28px 60px!important}
          .wt-about{grid-template-columns:1fr!important;gap:40px!important}
          .wt-about-right{border-left:none!important;padding-left:0!important;border-top:1px solid rgba(140,40,120,0.2);padding-top:32px}
          .wt-testi{grid-template-columns:1fr!important}
          .wt-section{padding:60px 24px!important}
          .wt-nav{padding:16px 24px!important}
          .wt-footer{padding:28px 24px!important;flex-direction:column!important;gap:12px!important}
          .wt-services-grid{grid-template-columns:1fr!important}
          .wt-about-photo{width:120px!important;height:120px!important}
        }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* NAV */}
      <nav className="wt-nav" style={{ position: "fixed", top: 0, width: "100%", background: "rgba(16,8,24,0.93)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(140,40,120,0.2)", zIndex: 100, padding: "18px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
        {logo
          ? <img src={logo} alt={name} style={{ height: 38, maxWidth: 160, objectFit: "contain" }} />
          : <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, letterSpacing: 2, color: "#e8c0f0" }}>{name}</span>
        }
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {igLink && <a href={igLink} target="_blank" rel="noreferrer" className="wt-social" style={{ color: "#c080d0", fontSize: 18, textDecoration: "none", padding: "8px 12px", border: "1px solid rgba(140,40,120,0.3)", borderRadius: 8, transition: "all 0.2s" }}>📸</a>}
          {ttLink && <a href={ttLink} target="_blank" rel="noreferrer" className="wt-social" style={{ color: "#c080d0", fontSize: 18, textDecoration: "none", padding: "8px 12px", border: "1px solid rgba(140,40,120,0.3)", borderRadius: 8, transition: "all 0.2s" }}>🎵</a>}
          {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="wt-btn-main" style={{ fontFamily: "'Jost',sans-serif", background: "#7a1f68", color: "#fff", padding: "10px 24px", borderRadius: 99, fontSize: 13, textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.3s ease" }}>Agendar</a>}
        </div>
      </nav>

      {/* HERO */}
      <section className="wt-hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", paddingTop: 76 }}>
        <div className="wt-hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 56px" }}>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "#8c2878", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 24, height: 1, background: "#8c2878" }} />{profession}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 300, lineHeight: 1.15, color: "#f0dcff", marginBottom: 16, fontStyle: "italic" }}>{c.hero.headline}</h1>

          {/* Starting price */}
          {c.hero.starting_price && (
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, color: "rgba(192,128,208,0.8)", marginBottom: 20, fontWeight: 400 }}>
              a partir de <span style={{ color: "#c080d0", fontWeight: 600 }}>{c.hero.starting_price}</span>
            </p>
          )}

          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 16, color: "rgba(237,224,247,0.6)", lineHeight: 1.9, marginBottom: 36, maxWidth: 420, fontWeight: 300 }}>{c.hero.subheadline}</p>

          {/* Micro social proof */}
          {c.about.session_count && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
              <div style={{ display: "flex", gap: -4 }}>
                {["💜","💜","💜"].map((h,i) => <span key={i} style={{ fontSize: 14 }}>{h}</span>)}
              </div>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: "rgba(192,128,208,0.7)", fontWeight: 400 }}>{c.about.session_count} realizadas</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
            {c.differentials.map((d, i) => (
              <div key={i} style={{ fontFamily: "'Jost',sans-serif", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(237,224,247,0.65)", fontWeight: 300 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8c2878", flexShrink: 0 }} />{d.text}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={primaryLink} target="_blank" rel="noreferrer" className="wt-btn-main" style={{ fontFamily: "'Jost',sans-serif", display: "inline-block", background: "#7a1f68", color: "#fff", padding: "15px 36px", borderRadius: 99, fontSize: 14, fontWeight: 400, textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.3s ease" }}>
              {c.hero.cta}
            </a>
            {igLink && <a href={igLink} target="_blank" rel="noreferrer" className="wt-social" style={{ fontFamily: "'Jost',sans-serif", display: "inline-flex", alignItems: "center", gap: 8, color: "#c080d0", padding: "15px 24px", border: "1px solid rgba(140,40,120,0.35)", borderRadius: 99, fontSize: 13, textDecoration: "none", transition: "all 0.2s" }}>📸 Instagram</a>}
            {ttLink && <a href={ttLink} target="_blank" rel="noreferrer" className="wt-social" style={{ fontFamily: "'Jost',sans-serif", display: "inline-flex", alignItems: "center", gap: 8, color: "#c080d0", padding: "15px 24px", border: "1px solid rgba(140,40,120,0.35)", borderRadius: 99, fontSize: 13, textDecoration: "none", transition: "all 0.2s" }}>🎵 TikTok</a>}
          </div>
        </div>

        {/* Hero right */}
        <div className="wt-hero-right" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(145deg,#1e0a2e 0%,#150520 50%,#1a0818 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%,rgba(120,30,100,0.3) 0%,transparent 65%)", zIndex: 1 }} />
          {gallery && gallery.length > 0
            ? <img src={gallery[0]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.85, position: "relative", zIndex: 0 }} />
            : logo
              ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", position: "relative", zIndex: 2, padding: 60 }}>
                  <img src={logo} alt={name} style={{ maxWidth: "70%", maxHeight: "60%", objectFit: "contain", filter: "brightness(1.1) drop-shadow(0 0 40px rgba(140,40,120,0.5))" }} />
                </div>
              : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", position: "relative", zIndex: 2 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 120, lineHeight: 1, color: "rgba(140,40,120,0.2)", userSelect: "none" }}>✦</div>
                    <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "rgba(140,40,120,0.45)", marginTop: 20 }}>
                      {c.contact.is_online ? "Atendimento Online" : c.contact.city}
                    </p>
                  </div>
                </div>
          }
        </div>
      </section>

      {/* ABOUT */}
      <section className="wt-section wt-about" style={{ padding: "100px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", borderTop: "1px solid rgba(140,40,120,0.15)" }}>
        <div>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "#8c2878", marginBottom: 20 }}>Sobre</p>
          {/* Profile photo + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
            {profilePhoto && (
              <img className="wt-about-photo" src={profilePhoto} alt={name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(140,40,120,0.4)", flexShrink: 0, filter: "brightness(1.05)" }} />
            )}
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 300, fontStyle: "italic", color: "#f0dcff", lineHeight: 1.2 }}>{c.about.title}</h2>
          </div>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, color: "rgba(237,224,247,0.65)", lineHeight: 2, fontWeight: 300, marginBottom: c.about.session_count ? 20 : 0 }}>{c.about.text}</p>
          {c.about.session_count && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(140,40,120,0.1)", border: "1px solid rgba(140,40,120,0.25)", borderRadius: 99, padding: "8px 20px", marginTop: 8 }}>
              <span style={{ fontSize: 16 }}>✦</span>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, color: "#c080d0", fontWeight: 400 }}>{c.about.session_count} realizadas</span>
            </div>
          )}
        </div>
        <div className="wt-about-right" style={{ borderLeft: "1px solid rgba(140,40,120,0.2)", paddingLeft: 56 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, color: "rgba(140,40,120,0.2)", lineHeight: 1, marginBottom: -10 }}>❝</div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: "italic", color: "rgba(237,224,247,0.5)", lineHeight: 1.75, fontWeight: 300 }}>{c.testimonials[0]?.text}</p>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#8c2878", marginTop: 20 }}>— {c.testimonials[0]?.name}{c.testimonials[0]?.city ? `, ${c.testimonials[0].city}` : ""}</p>
        </div>
      </section>

      {gallery_position === "after_about" && gallery && gallery.length > 1 && <GallerySection gallery={gallery.slice(1)} theme="witchy" />}

      {/* SERVICES */}
      <section className="wt-section" style={{ padding: "100px 56px", background: "rgba(100,20,80,0.06)", borderTop: "1px solid rgba(140,40,120,0.15)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "#8c2878", marginBottom: 14 }}>O que ofereço</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 300, fontStyle: "italic", color: "#f0dcff" }}>Serviços</h2>
            </div>
            <div style={{ height: 1, flex: 1, maxWidth: 200, background: "linear-gradient(90deg,rgba(140,40,120,0.4),transparent)", alignSelf: "center" }} />
          </div>
          <ServicesGrid />
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section style={{ padding: "60px 56px", borderTop: "1px solid rgba(140,40,120,0.1)", textAlign: "center", background: "rgba(140,40,120,0.04)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,3vw,32px)", fontStyle: "italic", color: "rgba(240,220,255,0.7)", marginBottom: 24, fontWeight: 300 }}>
          Pronta para começar sua jornada?
        </p>
        <a href={primaryLink} target="_blank" rel="noreferrer" className="wt-btn-main" style={{ fontFamily: "'Jost',sans-serif", display: "inline-block", background: "transparent", color: "#c080d0", padding: "13px 36px", borderRadius: 99, fontSize: 13, fontWeight: 400, textDecoration: "none", letterSpacing: 2, textTransform: "uppercase", border: "1px solid rgba(140,40,120,0.5)", transition: "all 0.3s ease" }}>
          {c.hero.cta}
        </a>
      </section>

      {gallery_position === "after_services" && gallery && gallery.length > 1 && <GallerySection gallery={gallery.slice(1)} theme="witchy" />}

      {/* TESTIMONIALS */}
      <section className="wt-section" style={{ padding: "100px 56px", borderTop: "1px solid rgba(140,40,120,0.15)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "#8c2878", marginBottom: 14, textAlign: "center" }}>Depoimentos</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 300, fontStyle: "italic", color: "#f0dcff", textAlign: "center", marginBottom: 64 }}>Vozes do Universo</h2>
          <div className="wt-testi" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, background: "rgba(140,40,120,0.08)" }}>
            {c.testimonials.map((t, i) => (
              <div key={i} style={{ background: "#100818", padding: "36px 28px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, color: "rgba(140,40,120,0.3)", lineHeight: 1, marginBottom: 4 }}>❝</div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: "italic", color: "rgba(237,224,247,0.65)", lineHeight: 1.85, marginBottom: 24 }}>{t.text}</p>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 500, color: "#e8c0f0" }}>{t.name}</p>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "rgba(140,40,120,0.7)", marginTop: 4 }}>{t.role}{t.city ? ` · ${t.city}` : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {c.faq && c.faq.length > 0 && (
        <section className="wt-section" style={{ padding: "100px 56px", background: "rgba(100,20,80,0.06)", borderTop: "1px solid rgba(140,40,120,0.15)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "#8c2878", marginBottom: 14, textAlign: "center" }}>Dúvidas</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 300, fontStyle: "italic", color: "#f0dcff", textAlign: "center", marginBottom: 52 }}>Perguntas Frequentes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {c.faq.map((f, i) => (
                <div key={i} style={{ padding: "24px 28px", background: "rgba(140,40,120,0.06)", borderLeft: "2px solid rgba(140,40,120,0.35)" }}>
                  <h3 style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, fontWeight: 500, color: "#e8c0f0", marginBottom: 8 }}>{f.question}</h3>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, color: "rgba(237,224,247,0.55)", lineHeight: 1.8, fontWeight: 300 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery_position === "before_cta" && gallery && gallery.length > 1 && <GallerySection gallery={gallery.slice(1)} theme="witchy" />}

      {/* FINAL CTA */}
      <section className="wt-section" style={{ padding: "120px 56px", textAlign: "center", borderTop: "1px solid rgba(140,40,120,0.15)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(120,30,100,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: "rgba(140,40,120,0.3)", marginBottom: 20 }}>✦</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(30px,5vw,54px)", fontWeight: 300, fontStyle: "italic", color: "#f0dcff", marginBottom: 16, lineHeight: 1.2 }}>{c.cta_section.headline}</h2>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 16, color: "rgba(237,224,247,0.5)", maxWidth: 460, margin: "0 auto 48px", fontWeight: 300, lineHeight: 1.8 }}>{c.cta_section.text}</p>
          <a href={primaryLink} target="_blank" rel="noreferrer" className="wt-btn-main" style={{ fontFamily: "'Jost',sans-serif", display: "inline-block", background: "#7a1f68", color: "#fff", padding: "17px 44px", borderRadius: 99, fontSize: 14, fontWeight: 400, textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.3s ease" }}>
            {c.cta_section.button}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wt-footer" style={{ borderTop: "1px solid rgba(140,40,120,0.15)", padding: "32px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 12, letterSpacing: 1 }}>
        <span style={{ fontFamily: "'Jost',sans-serif", textTransform: "uppercase", letterSpacing: 3, color: "rgba(237,224,247,0.4)" }}>
          {name}{!c.contact.is_online && c.contact.city ? ` · ${c.contact.city}` : ""}
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {igLink && <a href={igLink} target="_blank" rel="noreferrer" style={{ fontFamily: "'Jost',sans-serif", color: "rgba(140,40,120,0.5)", textDecoration: "none", fontSize: 13 }}>{c.contact.instagram}</a>}
          {ttLink && <a href={ttLink} target="_blank" rel="noreferrer" style={{ fontFamily: "'Jost',sans-serif", color: "rgba(140,40,120,0.5)", textDecoration: "none", fontSize: 13 }}>{c.contact.tiktok}</a>}
          {c.contact.email && <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "rgba(140,40,120,0.4)" }}>{c.contact.email}</span>}
        </div>
      </footer>

      {waLink && <a href={waLink} target="_blank" rel="noreferrer" style={{ position: "fixed", bottom: 28, right: 28, background: "#25d366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, textDecoration: "none", boxShadow: "0 4px 24px rgba(37,211,102,0.4)", zIndex: 999 }}>��</a>}
    </div>
  );
}
