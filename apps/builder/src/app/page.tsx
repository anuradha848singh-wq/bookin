import React from "react";
import Link from "next/link";
import { Layout, Check, ArrowRight, Monitor, Edit3, Rocket } from "lucide-react";

export const metadata = {
  title: "Bookin Studio | Create a Website You're Proud Of",
  description: "The professional website builder for clinics and medical practices. Start from scratch or choose from over 500 designer-made templates.",
};

export default function LandingPage() {
  return (
    <div className="wix-landing-container">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        
        .wix-landing-container {
          min-height: 100vh;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #ffffff;
          color: #111111;
        }

        /* Navigation */
        .wix-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 100;
        }

        .wix-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.5px;
          text-decoration: none;
          color: #000;
        }

        .wix-nav-links {
          display: flex;
          gap: 32px;
        }

        .wix-nav-links a {
          text-decoration: none;
          color: #333333;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .wix-nav-links a:hover {
          color: #0058FF;
        }

        .wix-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .wix-login-btn {
          text-decoration: none;
          color: #0058FF;
          font-weight: 500;
          font-size: 15px;
        }

        .wix-cta-btn {
          text-decoration: none;
          background: #0058FF;
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .wix-cta-btn:hover {
          background: #0045CC;
        }

        /* Hero Section */
        .wix-hero {
          padding: 140px 40px 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: #FAFAFA;
        }

        .wix-hero-title {
          font-size: 64px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -1.5px;
          max-width: 800px;
          margin: 0 0 24px 0;
          color: #111111;
        }

        .wix-hero-subtitle {
          font-size: 20px;
          color: #4B5563;
          max-width: 600px;
          margin: 0 0 40px 0;
          line-height: 1.5;
        }

        .wix-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0058FF;
          color: #ffffff;
          text-decoration: none;
          padding: 16px 40px;
          border-radius: 100px;
          font-size: 18px;
          font-weight: 600;
          transition: transform 0.2s, background 0.2s;
        }

        .wix-hero-cta:hover {
          background: #0045CC;
          transform: translateY(-2px);
        }

        .wix-hero-note {
          margin-top: 16px;
          font-size: 14px;
          color: #6B7280;
        }

        /* Image Showcase */
        .wix-showcase {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 40px 100px 40px;
          margin-top: -40px;
        }

        .wix-showcase-img {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid #E5E7EB;
        }

        /* Features Section */
        .wix-features {
          padding: 100px 40px;
          background: #ffffff;
          max-width: 1200px;
          margin: 0 auto;
        }

        .wix-section-title {
          font-size: 40px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          letter-spacing: -1px;
        }

        .wix-grid {
          display: grid;
          grid-template-cols: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .wix-card {
          padding: 40px;
          border-radius: 12px;
          background: #FAFAFA;
          border: 1px solid #F3F4F6;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .wix-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .wix-card-icon {
          width: 50px;
          height: 50px;
          background: #EBF3FF;
          color: #0058FF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .wix-card-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .wix-card-text {
          font-size: 16px;
          color: #4B5563;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer */
        .wix-footer {
          background: #111111;
          color: #ffffff;
          padding: 60px 40px;
          text-align: center;
        }

        .wix-footer p {
          margin: 0;
          color: #9CA3AF;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .wix-nav-links { display: none; }
          .wix-hero-title { font-size: 40px; }
          .wix-hero { padding-top: 100px; }
        }
      `}} />

      {/* Navigation */}
      <nav className="wix-nav">
        <div className="wix-logo">
          <Layout size={24} color="#0058FF" />
          Bookin Studio
        </div>
        
        <div className="wix-nav-links">
          <a href="#creation">Creation</a>
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
        </div>

        <div className="wix-nav-actions">
          <Link href="/login" className="wix-login-btn">Log In</Link>
          <Link href="/login" className="wix-cta-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="wix-hero">
        <h1 className="wix-hero-title">Create a Website You&apos;re Proud Of</h1>
        <p className="wix-hero-subtitle">
          Discover the platform that gives you the freedom to create, design, manage and develop your web presence exactly the way you want.
        </p>
        <Link href="/login" className="wix-hero-cta">
          Get Started <ArrowRight size={20} />
        </Link>
        <div className="wix-hero-note">No credit card required</div>
      </section>

      {/* Fake UI Showcase */}
      <section className="wix-showcase">
        <div style={{ background: '#EBF3FF', borderRadius: '12px', padding: '2px' }}>
          <div style={{ background: '#fff', borderRadius: '10px', height: '500px', display: 'flex', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: '240px', borderRight: '1px solid #E5E7EB', padding: '20px', background: '#FAFAFA' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '20px' }}>Add Elements</div>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{width: '16px', height: '16px', background: '#0058FF', borderRadius: '2px'}}></div>Text</div>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{width: '16px', height: '16px', background: '#0058FF', borderRadius: '50%'}}></div>Image</div>
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{width: '16px', height: '16px', background: '#0058FF', borderRadius: '2px'}}></div>Button</div>
              </div>
            </div>
            {/* Canvas */}
            <div style={{ flex: 1, padding: '40px', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80%', height: '60px', background: '#F3F4F6', borderRadius: '8px', marginBottom: '20px' }}></div>
              <div style={{ width: '60%', height: '40px', background: '#F3F4F6', borderRadius: '8px', marginBottom: '40px' }}></div>
              <div style={{ width: '120px', height: '40px', background: '#0058FF', borderRadius: '20px' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="wix-features">
        <h2 className="wix-section-title">The Freedom to Create Anything</h2>
        <div className="wix-grid">
          <div className="wix-card">
            <div className="wix-card-icon">
              <Edit3 size={24} />
            </div>
            <h3 className="wix-card-title">Intuitive Drag and Drop</h3>
            <p className="wix-card-text">
              Customize your site exactly the way you want with our intuitive drag and drop builder. No coding skills needed.
            </p>
          </div>
          <div className="wix-card">
            <div className="wix-card-icon">
              <Monitor size={24} />
            </div>
            <h3 className="wix-card-title">Responsive Design</h3>
            <p className="wix-card-text">
              Your website will look amazing on any device. Switch to mobile editor to personalize it further.
            </p>
          </div>
          <div className="wix-card">
            <div className="wix-card-icon">
              <Rocket size={24} />
            </div>
            <h3 className="wix-card-title">Lightning Fast Hosting</h3>
            <p className="wix-card-text">
              Benefit from our reliable, scalable, and free hosting. Your site will load in an instant.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="wix-footer">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Layout size={20} color="#0058FF" />
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Bookin Studio</span>
        </div>
        <p>© {new Date().getFullYear()} Bookin Inc. The Wix-style experience for clinics.</p>
      </footer>
    </div>
  );
}
