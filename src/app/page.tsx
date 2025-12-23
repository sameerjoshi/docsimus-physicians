"use client";

import { Button, Card, CardContent } from "@/src/components/ui";
import {
  Stethoscope,
  DollarSign,
  Calendar,
  Video,
  LayoutDashboard,
  ShieldCheck,
  Lock,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleUp,
} from "@/src/lib/animations";
import Link from "next/link";

const benefits = [
  {
    icon: DollarSign,
    title: "Flexible Earnings",
    description:
      "Set your own rates and earn on your terms. Get paid securely for every consultation.",
  },
  {
    icon: Calendar,
    title: "Set Your Own Schedule",
    description:
      "Work when it suits you. Full control over your availability and time slots.",
  },
  {
    icon: Video,
    title: "Video Consultation Platform",
    description:
      "State-of-the-art telemedicine tools. Conduct seamless video consultations from anywhere.",
  },
  {
    icon: LayoutDashboard,
    title: "Patient Management Dashboard",
    description:
      "Comprehensive tools to manage patients, records, prescriptions, and appointments.",
  },
];

const trustIndicators = [
  { icon: ShieldCheck, label: "HIPAA Compliant" },
  { icon: Lock, label: "256-bit Encryption" },
  { icon: Award, label: "Verified Physicians" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full primary-gradient">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Docsimus</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/doctor-onboarding/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/doctor-onboarding/auth/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Trusted by 10,000+ Healthcare Professionals
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Join Our Network of{" "}
            <span className="gradient-text">Healthcare Professionals</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Connect with patients worldwide, grow your practice, and deliver
            exceptional care through our secure telemedicine platform.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/doctor-onboarding/auth/signup">
              <Button variant="gradient" size="xl" className="group">
                Start Registration
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
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
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Join <span className="gradient-text">Docsimus</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to build and grow your telemedicine practice
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} variants={staggerItem}>
                <Card hover gradient className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] primary-gradient mb-4">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of physicians already using our platform
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                step: "01",
                title: "Create Your Account",
                description:
                  "Sign up with your email and verify your identity to get started.",
              },
              {
                step: "02",
                title: "Complete Your Profile",
                description:
                  "Add your credentials, specializations, and upload verification documents.",
              },
              {
                step: "03",
                title: "Start Consulting",
                description:
                  "Once verified, set your availability and begin accepting consultations.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={staggerItem}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleUp}
        >
          <Card className="overflow-hidden">
            <div className="primary-gradient p-8 sm:p-12 text-center text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join our network today and start connecting with patients who
                need your expertise.
              </p>
              <Link href="/doctor-onboarding/auth/signup">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Start Registration
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full primary-gradient">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Docsimus Physicians</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact Support
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
