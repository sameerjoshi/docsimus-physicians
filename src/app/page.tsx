"use client";

import { Button, Card } from "@/src/components/ui";
import {
  Stethoscope,
  Calendar,
  Video,
  Users,
  Shield,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  FileText,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleUp,
} from "@/src/lib/animations";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const features = [
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description:
      "Set your availability and work when it suits you. Full control over your consultation hours.",
  },
  {
    icon: Video,
    title: "Telemedicine Ready  ",
    description:
      "Conduct seamless video consultations with built-in tools for prescriptions and patient records.",
  },
  {
    icon: DollarSign,
    title: "Transparent Earnings",
    description:
      "Set your consultation fees. Get paid securely with transparent payment tracking.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Comprehensive dashboard to manage patient records, appointments, and medical history.",
  },
];

const trustIndicators = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Award, label: "Verified Doctors Only" },
  { icon: Clock, label: "24/7 Platform Access" },
];

const steps = [
  {
    number: "01",
    title: "Sign Up & Verify",
    description:
      "Create your account and upload your medical license and credentials for verification.",
  },
  {
    number: "02",
    title: "Complete Profile",
    description:
      "Add your specialization, experience, and set your consultation fees and availability.",
  },
  {
    number: "03",
    title: "Start Consulting",
    description:
      "Once verified (24-48 hours), start accepting instant consultations and scheduled appointments.",
  },
];

const stats = [
  { value: "5,000+", label: "Active Doctors" },
  { value: "50,000+", label: "Consultations/Month" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "15+", label: "Specialties" },
];

export default function Home() {
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/favicon.png" alt="Logo" width={36} height={36} className="group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold hidden sm:inline">
                Docsimus <span className="text-primary">Doctors</span>
              </span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Join Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full viewport height with vertical centering */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 via-background to-background pt-16">
        <motion.div
          className="max-w-4xl mx-auto text-center py-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Trusted by 5,000+ Healthcare Professionals
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            Expand Your Practice,{" "}
            <span className="text-primary">Digitally</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            Join India's fastest-growing telemedicine platform. Connect with patients nationwide, manage consultations seamlessly, and grow your practice on your terms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/signup">
              <Button size="lg" className="group w-full sm:w-auto">
                Start Registration
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {trustIndicators.map((indicator) => (
              <div
                key={indicator.label}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <indicator.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{indicator.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Right Column - Stats Card */}
          {/* <motion.div variants={fadeInUp}>
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

                <div className="relative">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Platform Highlights
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm"
                      >
                        <div className="text-3xl font-bold text-primary mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Average doctor earns ₹50,000-₹2,00,000/month
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div> */}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for healthcare professionals in India
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Get Started in{" "}
              <span className="text-primary">3 Simple Steps</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your journey from registration to your first consultation
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="relative"
              >
                <Card className="p-8 h-full text-center relative overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleUp}
        >
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative bg-primary p-8 sm:p-12 lg:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

              <div className="relative">
                <Heart className="h-16 w-16 mx-auto mb-6 text-white/90" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Ready to Transform Healthcare?
                </h2>
                <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of doctors who are already making healthcare more accessible. Start your journey today.
                </p>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-lg group"
                  >
                    Register Now
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="Logo" width={32} height={32} />
              <span className="font-semibold text-lg">
                Docsimus <span className="text-primary">Doctors</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 Docsimus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
