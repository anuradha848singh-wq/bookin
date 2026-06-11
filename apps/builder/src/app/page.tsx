import React from "react";
import Link from "next/link";
import { Layout, Check, ArrowRight, Monitor, Edit3, Rocket, Layers, Sparkles, Zap } from "lucide-react";

export const metadata = {
  title: "Bookin Studio | Create a Website You're Proud Of",
  description: "The professional website builder for clinics and medical practices. Start from scratch or choose from over 500 designer-made templates.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:text-blue-400 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layout size={18} className="text-white" />
            </div>
            Bookin Studio
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#creation" className="hover:text-white transition-colors">Creation</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="hidden sm:block text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 sm:pt-40 sm:pb-24 lg:pb-32 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section id="creation" className="flex flex-col items-center text-center max-w-4xl mx-auto scroll-mt-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
            <Sparkles size={14} /> The Future of Clinic Websites
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Create a Website You're <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Proud Of</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover the platform that gives you the freedom to create, design, manage and develop your medical presence exactly the way you want.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 transition-all active:scale-95 text-lg">
              Start Building <ArrowRight size={20} />
            </Link>
            <span className="text-sm text-slate-500">No credit card required</span>
          </div>
        </section>

        {/* UI Showcase / Builder Mockup */}
        <section className="mt-20 sm:mt-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-2xl sm:rounded-[2rem] p-2 bg-gradient-to-b from-white/10 to-white/0 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm transition-transform duration-700 hover:scale-[1.02]">
            
            {/* Fake Browser Top */}
            <div className="h-12 bg-slate-900/80 border-b border-white/10 rounded-t-xl sm:rounded-t-[1.75rem] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="mx-auto px-4 py-1.5 rounded-md bg-slate-800/50 text-xs text-slate-400 flex items-center gap-2 w-1/3 min-w-[200px] border border-white/5">
                <Layout size={12} /> editor.bookin.com
              </div>
            </div>

            {/* Fake Builder UI */}
            <div className="bg-slate-900 rounded-b-xl sm:rounded-b-[1.75rem] h-[400px] sm:h-[600px] flex overflow-hidden">
              {/* Sidebar */}
              <div className="hidden md:flex w-64 border-r border-white/10 bg-slate-900/50 flex-col p-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 pl-2">Elements</div>
                <div className="flex flex-col gap-2">
                  {['Text Node', 'Image Block', 'Primary Button', 'Service Grid'].map((el, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-sm text-slate-300">
                      <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Layers size={14} />
                      </div>
                      {el}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Canvas Area */}
              <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-950/50 p-8 flex flex-col items-center justify-center relative">
                {/* Canvas Render */}
                <div className="w-full max-w-2xl h-full bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center p-8 transform transition-transform hover:scale-105 duration-500">
                  <div className="w-3/4 h-12 bg-slate-100 rounded-lg mb-6" />
                  <div className="w-1/2 h-6 bg-slate-100 rounded-full mb-10" />
                  <div className="w-32 h-12 bg-blue-600 rounded-full" />
                </div>
                {/* Floating Toolbar */}
                <div className="absolute bottom-6 bg-slate-800 border border-white/10 rounded-full px-6 py-3 flex gap-6 shadow-xl backdrop-blur-md">
                  <div className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer transition-colors" />
                  <div className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer transition-colors" />
                  <div className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-32 sm:mt-48 scroll-mt-32">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">The Freedom to Create Anything</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Build exactly what you envision with our powerful, intuitive toolset designed for modern clinics.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Edit3 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Intuitive Drag & Drop</h3>
              <p className="text-slate-400 leading-relaxed">
                Customize your site exactly the way you want with our visual builder. Absolutely no coding skills required to achieve a premium look.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Responsive by Default</h3>
              <p className="text-slate-400 leading-relaxed">
                Your website will look amazing on any device instantly. Switch to our mobile editor to fine-tune the mobile experience further.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Benefit from our globally distributed edge infrastructure. Your site will load in an instant, keeping your bounce rates incredibly low.
              </p>
            </div>
          </div>
        </section>

        {/* Templates Section (Added to fix the anchor link) */}
        <section id="templates" className="mt-32 sm:mt-48 py-20 border-t border-white/10 scroll-mt-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Start from 500+ Designer Templates</h2>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Don't want to start from scratch? Choose a template tailored for your specific medical practice, customize it with your brand, and go live in hours instead of weeks.
              </p>
              <ul className="flex flex-col gap-4 text-slate-300 text-lg mb-10 max-w-md mx-auto lg:mx-0 text-left">
                <li className="flex items-center gap-3"><Check className="text-emerald-400" size={24} /> Optimized for high conversion rates</li>
                <li className="flex items-center gap-3"><Check className="text-emerald-400" size={24} /> Built-in SEO best practices</li>
                <li className="flex items-center gap-3"><Check className="text-emerald-400" size={24} /> Automated appointment booking ready</li>
              </ul>
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-950 font-semibold hover:bg-slate-200 hover:scale-105 transition-all text-lg">
                Explore Templates
              </Link>
            </div>
            
            <div className="flex-1 relative w-full aspect-square max-w-lg">
               {/* Abstract visual for templates */}
               <div className="absolute inset-0 grid grid-cols-2 gap-4 transform rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/40 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                  <div className="bg-gradient-to-bl from-purple-500/20 to-pink-600/40 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm mt-8 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
                  <div className="bg-gradient-to-tr from-emerald-500/20 to-teal-600/40 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm -mt-8 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }} />
                  <div className="bg-gradient-to-tl from-orange-500/20 to-red-600/40 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
               </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Layout size={14} className="text-white" />
            </div>
            Bookin Studio
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Bookin Inc. The modern experience for clinics.
          </p>
        </div>
      </footer>
    </div>
  );
}
