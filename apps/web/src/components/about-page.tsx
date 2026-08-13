"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";

const AboutPage: React.FC = () => (
  <div className="bg-primary min-h-screen pt-40 md:pt-48">
    {/* Back Navigation */}
    <div className="mx-auto max-w-screen-xl px-6 md:px-12">
      <div>
        <a
          className="text-secondary hover:text-primary inline-flex items-center gap-2 text-sm transition-colors duration-200 ease-out"
          href="/"
        >
          <HugeiconsIcon
            color="currentColor"
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={1.5}
          />
          Back to Home
        </a>
      </div>
    </div>

    {/* Hero Section */}
    <section className="pt-8 pb-20 md:pt-12 md:pb-32">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <div className="flex flex-col gap-12">
          <h1 className="text-primary text-6xl font-bold tracking-tighter md:text-8xl lg:text-9xl">
            About Me
          </h1>
          <p className="text-secondary max-w-2xl text-xl leading-relaxed md:text-2xl">
            I&apos;m a full-stack developer who cares about SEO and
            infrastructure. My journey started after winning a scholarship to
            learn a tech skill for a year, choosing development because
            I&apos;ve always been curious about how computers work. Now, as the
            Founding Engineer at{" "}
            <a
              className="text-primary decoration-subtle hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
              href="https://welupdigital.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Welup Digital
            </a>
            , I build sites that look good and actually work well.
          </p>
        </div>
      </div>
    </section>

    {/* Professional Journey */}
    <section className="py-20">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <div>
            <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
              Professional Journey
            </h2>
            <div className="flex flex-col gap-12 pt-12">
              <div className="flex flex-col gap-4">
                <h3 className="text-primary text-xl font-medium">
                  Full-Stack Development
                </h3>
                <p className="text-secondary text-base leading-relaxed">
                  I build web applications that handle real traffic. Clean code
                  that&apos;s easy to maintain and doesn&apos;t fall over when
                  things get busy.
                </p>
                <ul className="text-muted flex flex-col gap-2 font-mono text-sm">
                  <li>— Built applications for high-traffic sites</li>
                  <li>— Developed real-time analytics dashboards</li>
                  <li>— Created microservices to reduce server costs</li>
                  <li>— Implemented CI/CD pipelines</li>
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-primary text-xl font-medium">
                  SEO Optimization
                </h3>
                <p className="text-secondary text-base leading-relaxed">
                  I&apos;ve helped businesses rank higher in Google. One client
                  saw their traffic grow{" "}
                  <span className="text-primary">285%</span> over 12 months
                  using standard white-hat techniques.
                </p>
                <ul className="text-muted flex flex-col gap-2 font-mono text-sm">
                  <li>— Improved Core Web Vitals for 20+ websites</li>
                  <li>— Got an e-commerce client&apos;s traffic up 400%</li>
                  <li>— Built SEO automation tools to speed up audits</li>
                  <li>— Recovered 5+ websites from Google penalties</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Expertise */}
          <div>
            <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
              Technical Expertise
            </h2>
            <div className="flex flex-col gap-12 pt-12">
              <div className="flex flex-col gap-6">
                <h4 className="text-primary font-medium">Cloud & DevOps</h4>
                <ul className="text-secondary grid grid-cols-2 gap-y-2 text-sm">
                  <li>AWS/GCP architecture</li>
                  <li>Docker & Kubernetes</li>
                  <li>Infrastructure as Code</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="text-primary font-medium">Performance</h4>
                <ul className="text-secondary grid grid-cols-2 gap-y-2 text-sm">
                  <li>Database optimization</li>
                  <li>Redis / CDN Caching</li>
                  <li>Load balancing</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="text-primary font-medium">Technical SEO</h4>
                <ul className="text-secondary grid grid-cols-2 gap-y-2 text-sm">
                  <li>Core Web Vitals</li>
                  <li>Schema markup</li>
                  <li>Technical audits</li>
                  <li>International SEO</li>
                </ul>
              </div>

              <div className="border-subtle border-t pt-12">
                <div className="flex flex-col gap-6">
                  <h4 className="text-primary font-medium">Global Context</h4>
                  <ul className="text-secondary flex flex-col gap-2 text-sm">
                    <li>
                      Based in{" "}
                      <span className="text-primary font-medium">Nigeria</span>
                    </li>
                    <li>
                      Working in{" "}
                      <span className="text-primary font-medium">GMT+1</span>{" "}
                      (Available for global syncs)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy */}
    <section className="py-20 pb-32">
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">
        <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
          Philosophy
        </h2>
        <div className="grid grid-cols-1 gap-12 pt-12 md:grid-cols-2">
          <p className="text-primary text-2xl leading-tight font-medium md:text-3xl">
            I like figuring out how things work and making them work better.
            That curiosity keeps me learning and pushing for better solutions.
          </p>
          <div className="flex flex-col items-start justify-end gap-8 md:items-end">
            <a
              className="border-primary text-primary hover:border-muted hover:text-muted border-b pb-1 text-lg transition-colors"
              href="/projects"
            >
              View My Work
            </a>
            <a
              className="border-primary text-primary hover:border-muted hover:text-muted border-b pb-1 text-lg transition-colors"
              href="/contact"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
