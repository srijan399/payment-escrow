import {
  ArrowRight,
  Shield,
  Globe,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/Navbar";
import { CTA } from "@/components/ui/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">EduPay</span>
          </div>
          <Navbar />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            Powered by Blockchain Technology
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Cross-Border Education Payments Made{" "}
            <span className="text-emerald-600">Simple</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Send tuition fees and donations to universities worldwide using
            stablecoins. Fast, secure, and transparent payments with minimal
            fees.
          </p>
          <CTA />
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>USDC Stablecoin</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>On-Chain Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Global Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose EduPay?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Revolutionary blockchain technology meets educational finance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Send payments to any university worldwide without traditional
                  banking limitations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Instant Transfers</CardTitle>
                <CardDescription>
                  Complete transactions in minutes, not days. No more waiting
                  for international wire transfers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Low Fees</CardTitle>
                <CardDescription>
                  Save up to 90% on transaction fees compared to traditional
                  international transfers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Secure & Transparent</CardTitle>
                <CardDescription>
                  All transactions are recorded on the blockchain with admin
                  approval for added security
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Multi-Party Approval</CardTitle>
                <CardDescription>
                  Built-in approval system ensures payments are verified before
                  release to institutions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Stablecoin Powered</CardTitle>
                <CardDescription>
                  Uses USDC stablecoin to eliminate volatility and ensure
                  predictable payment amounts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and transparent payment process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Initiate Payment
              </h3>
              <p className="text-slate-600">
                Connect your wallet and select the university you want to pay.
                Enter the amount in USDC.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Secure Deposit
              </h3>
              <p className="text-slate-600">
                Your USDC is securely held in a smart contract until the payment
                is approved and verified.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Admin Approval
              </h3>
              <p className="text-slate-600">
                Our admin system verifies the payment details and releases funds
                to the university.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">$50M+</div>
              <div className="text-emerald-100">Total Payments Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Partner Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-emerald-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* For Institutions Section */}
      <section id="institutions" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                For Educational Institutions
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Join hundreds of universities already using EduPay to receive
                international payments seamlessly.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Instant Settlement
                    </h4>
                    <p className="text-slate-600">
                      Receive payments immediately after approval
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Compliance Ready
                    </h4>
                    <p className="text-slate-600">
                      Built-in KYC and AML compliance features
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      Easy Integration
                    </h4>
                    <p className="text-slate-600">
                      Simple API integration with your existing systems
                    </p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Partner With Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    University of Global Studies
                  </h4>
                  <p className="text-slate-600">International Education</p>
                </div>
              </div>
              <blockquote className="text-slate-700 italic mb-4">
                &quot;EduPay has revolutionized how we receive international
                tuition payments. What used to take weeks now happens in
                minutes, and our students love the transparency.&quot;
              </blockquote>
              <div className="flex text-emerald-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Education Payments?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students and hundreds of universities using EduPay
            for seamless cross-border payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3"
            >
              Start Sending Payments
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduPay</span>
              </div>
              <p className="text-slate-400">
                Revolutionizing cross-border education payments with blockchain
                technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 EduPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
