import React from "react";
import Link from "next/link";
import { ArrowRight, Layout, Zap, Smartphone, Globe, Code, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Bookin Studio | Build Your Clinical Website",
  description: "The professional website builder for clinics and medical practices.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Layout size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Bookin Studio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#templates" className="text-sm font-medium text-gray-600 hover:text-gray-900">Templates</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all active:scale-95"
            >
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-8 border border-red-100">
            <Zap size={14} /> Next-Generation Builder
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl leading-[1.1] mb-6">
            Create a professional clinical website without code.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-medium">
            Bookin Studio provides web designers and clinic owners with a drag-and-drop canvas, pre-built medical components, and native booking integration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link 
              href="/login?signup=true" 
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-red-600 rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
            >
              Start for free <ArrowRight size={18} />
            </Link>
            <Link 
              href="/demo" 
              className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all active:scale-95"
            >
              Watch Demo
            </Link>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-20 w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50">
            <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 px-4 py-1.5 rounded-md bg-gray-100 text-xs font-medium text-gray-500 flex-1 max-w-md text-center mx-auto">
                studio.bookin.com/editor
              </div>
            </div>
            {/* Visual representation of the builder */}
            <div className="pt-12 flex h-[500px]">
              <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-4 border-b border-gray-100"><div className="h-6 bg-gray-100 rounded w-1/2"></div></div>
                <div className="p-4 space-y-3">
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-200 border-dashed"></div>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <Layout size={32} className="text-red-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">Drag & Drop Canvas</div>
                </div>
              </div>
              <div className="w-72 bg-white border-l border-gray-200 hidden lg:block">
                <div className="p-4 border-b border-gray-100"><div className="h-6 bg-gray-100 rounded w-1/3"></div></div>
                <div className="p-4 space-y-4">
                  <div>
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-50 border border-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                    <div className="h-20 bg-gray-50 border border-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">Bookin Studio combines enterprise-grade performance with the simplicity of a drag-and-drop editor.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Code size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No-Code Freedom</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Design custom headers, footers, and complex clinical layouts without writing a single line of CSS.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                <Globe size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Publishing</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Hit publish and your site is compiled into lightning-fast static HTML, instantly deployed to our global CDN.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6">
                <Smartphone size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Perfectly Responsive</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Toggle between Desktop, Tablet, and Mobile views to ensure your clinic looks perfect on every device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <Layout size={12} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">Bookin Studio</span>
          </div>
          <p className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Bookin Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
