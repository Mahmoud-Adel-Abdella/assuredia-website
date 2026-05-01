import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Activity, Zap, BarChart3, CheckCircle2 } from "lucide-react";
import logoUrl from "@assets/e2a4684a-979c-4de9-be72-c3624b6dcb8c_1777651437482.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Assuredia" className="h-8 w-auto object-contain" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Assuredia</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:flex text-slate-600 hover:text-slate-900">Log In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Detect. Inform. Action.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Always On. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">Quality Assured.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            The high-stakes command center for engineering teams. Monitor test executions, catch regressions instantly, and ship with absolute confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                Start Monitoring <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
              View Documentation
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Precision Monitoring</h2>
              <p className="text-lg text-slate-600">Everything you need to maintain impeccable quality standards across all your environments.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Monitoring</h3>
                <p className="text-slate-600 leading-relaxed">Continuous execution tracking across all your critical flows. Never miss a flaky test or silent failure again.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Notifications</h3>
                <p className="text-slate-600 leading-relaxed">Real-time alerts routed directly to your team via Slack, Discord, or webhook the moment a regression is detected.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Insights</h3>
                <p className="text-slate-600 leading-relaxed">Automatically identify patterns in module failures and isolate root causes faster with intelligent aggregation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Scalable & Reliable Pricing</h2>
            <p className="text-lg text-slate-600">Built for teams that treat quality as a feature, not an afterthought.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border border-slate-200 rounded-3xl p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
              <p className="text-slate-500 mb-6">For growing engineering teams.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">$299</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Up to 50 monitored clients", "Real-time Slack/Discord alerts", "30-day data retention", "Standard support"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 text-base" variant="outline">Start Free Trial</Button>
            </div>

            <div className="border-2 border-primary rounded-3xl p-8 bg-slate-900 text-white relative shadow-xl">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-6">For mission-critical deployments.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-white">$899</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Unlimited monitored clients", "Custom webhook integrations", "1-year data retention", "Dedicated success manager", "SSO & Advanced Security"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white border-0">Contact Sales</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <img src={logoUrl} alt="Assuredia" className="h-6 w-auto" />
            <span className="font-bold text-lg text-slate-900">Assuredia</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 Assuredia QA Monitoring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
