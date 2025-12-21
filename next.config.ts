import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      // Old doctor-onboarding routes → new top-level routes
      {
        source: "/doctor-onboarding/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/doctor-onboarding/auth/signup",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/doctor-onboarding/auth/verify-email",
        destination: "/verify-email",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/personal",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/address",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/medical",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/documents",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/availability",
        destination: "/registration",
        permanent: true,
      },
      {
        source: "/doctor-onboarding-new/review",
        destination: "/registration",
        permanent: true,
      },
      // Old doctor dashboard routes → new routes
      {
        source: "/doctor/dashboard",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/doctor/profile",
        destination: "/profile",
        permanent: true,
      },
      {
        source: "/doctor/registration",
        destination: "/onboarding",
        permanent: true,
      },
      {
        source: "/doctor-onboarding/dashboard",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/doctor-onboarding/pending",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
