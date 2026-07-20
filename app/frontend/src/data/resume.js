// Placeholder Senior IT Architect resume data. Edit values here to personalize. - Test
export const profile = {
  name: "Alexander J. Whitfield",
  title: "Senior IT Architect",
  tagline: " Enterprise Systems for Scale & Resilience",
  summary:
    "Cloud-native strategist with 15+ years shaping mission-critical platforms across banking, healthcare and retail. I translate complex business goals into pragmatic, high-availability architectures that ship — and stay shipped.",
  location: "London, United Kingdom",
  email: "alex.whitfield@architects.dev",
  phone: "+44 20 7946 0958",
  linkedin: "https://linkedin.com/in/alex-whitfield",
  github: "https://github.com/awhitfield",
  resumeUrl: "#",
};

export const metrics = [
  { label: "Years Experience", value: "15+" },
  { label: "Programs Managed", value: "$50M+" },
  { label: "Fortune 500 Clients", value: "10+" },
  { label: "Cloud Migrations", value: "40+" },
];

export const experience = [
  {
    role: "Principal IT Architect",
    company: "Meridian Global Bank",
    period: "2021 — Present",
    location: "London, UK",
    bullets: [
      "Led enterprise re-platforming to AWS across 6 business units — reduced infra cost 38% and cut release cycle from 6 weeks to 2 days.",
      "Designed event-driven microservices reference architecture adopted by 240+ engineers across 18 squads.",
      "Chaired the Architecture Review Board; approved 90+ high-impact designs against resilience & security guardrails.",
    ],
  },
  {
    role: "Lead Solutions Architect",
    company: "Northwind Health Systems",
    period: "2017 — 2021",
    location: "Boston, USA",
    bullets: [
      "Architected HIPAA-compliant data lake unifying 14 hospital sites — enabling real-time analytics for 2.1M patients.",
      "Delivered Azure migration for legacy claims platform, achieving 99.99% uptime and $12M annual savings.",
      "Mentored 22 engineers across 3 timezones; established internal architecture guild.",
    ],
  },
  {
    role: "Senior Cloud Architect",
    company: "Vertex Retail Group",
    period: "2013 — 2017",
    location: "Amsterdam, NL",
    bullets: [
      "Built omnichannel commerce platform on GCP handling 8M daily transactions during peak holiday load.",
      "Introduced Kubernetes + service mesh, reducing incident MTTR from 4h to 22 minutes.",
      "Led green-field API gateway design supporting 300+ third-party integrations.",
    ],
  },
  {
    role: "Software Architect",
    company: "Cognitum Consulting",
    period: "2010 — 2013",
    location: "Berlin, DE",
    bullets: [
      "Delivered SOA transformation for two Tier-1 telcos, decommissioning 60+ legacy systems.",
      "Authored architecture playbook adopted as internal standard across 400+ consultants.",
    ],
  },
];

export const skills = [
  {
    category: "Cloud Platforms",
    items: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Terraform", "Pulumi"],
  },
  {
    category: "Architecture Patterns",
    items: ["Microservices", "Event-Driven", "CQRS / Event Sourcing", "Hexagonal", "DDD", "Serverless"],
  },
  {
    category: "Languages",
    items: ["Java", "Python", "Go", "TypeScript", "Kotlin", "SQL"],
  },
  {
    category: "DevOps & SRE",
    items: ["GitHub Actions", "ArgoCD", "Prometheus", "Grafana", "OpenTelemetry", "Istio"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "Kafka", "Snowflake", "Redis", "Elasticsearch"],
  },
  {
    category: "Leadership",
    items: ["Architecture Governance", "Mentoring", "Roadmap Strategy", "Stakeholder Alignment"],
  },
];

export const certifications = [
  { name: "AWS Solutions Architect — Professional", issuer: "Amazon Web Services", year: "2024" },
  { name: "Azure Solutions Architect Expert", issuer: "Microsoft", year: "2023" },
  { name: "Google Cloud Professional Cloud Architect", issuer: "Google Cloud", year: "2023" },
  { name: "TOGAF 9 Certified", issuer: "The Open Group", year: "2019" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2022" },
  { name: "HashiCorp Terraform Associate", issuer: "HashiCorp", year: "2024" },
];

export const projects = [
  {
    title: "Global Payments Modernization",
    client: "Tier-1 European Bank",
    image:
      "https://images.pexels.com/photos/5203849/pexels-photo-5203849.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    problem:
      "Monolithic payments engine bottlenecking 4M daily transactions with 22-minute release windows and frequent outages.",
    solution:
      "Designed event-driven microservices platform on AWS with Kafka + Kubernetes; introduced zero-downtime deploys and chaos-tested resilience patterns.",
    stack: ["AWS", "Kafka", "EKS", "Java", "Terraform"],
    impact: "99.995% availability · 12x faster release cadence · $18M annual savings",
    span: "col-span-12 md:col-span-8",
  },
  {
    title: "Patient Data Unification",
    client: "US Regional Health Network",
    image:
      "https://images.pexels.com/photos/1313534/pexels-photo-1313534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    problem: "14 disconnected hospital EMRs blocking clinical analytics and regulatory reporting.",
    solution:
      "Architected HIPAA-aligned data lake on Azure Synapse with FHIR-based integration layer and role-based access.",
    stack: ["Azure", "Synapse", "FHIR", "Python"],
    impact: "2.1M patients unified · 6 → 0.5 days for reg reports",
    span: "col-span-12 md:col-span-4",
  },
  {
    title: "Omnichannel Retail Platform",
    client: "European Retail Group",
    image:
      "https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    problem: "Legacy monolith unable to handle Black Friday load; disjointed inventory across channels.",
    solution:
      "Built cloud-native platform on GCP with service mesh, edge caching and unified inventory API.",
    stack: ["GCP", "GKE", "Istio", "Go", "Redis"],
    impact: "8M peak daily tx · MTTR 4h → 22min",
    span: "col-span-12 md:col-span-6",
  },
  {
    title: "Zero-Trust Security Overhaul",
    client: "Confidential — Insurance",
    image:
      "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    problem: "Legacy VPN-based access model failing audits; sprawling identity landscape.",
    solution:
      "Designed zero-trust reference architecture with SSO, mTLS service-to-service, and continuous policy enforcement.",
    stack: ["Okta", "Istio", "OPA", "SPIFFE"],
    impact: "Audit-clean · Blast radius reduced by 84%",
    span: "col-span-12 md:col-span-6",
  },
];

export const testimonials = [
  {
    quote:
      "Alex is the rare architect who can hold a boardroom and a whiteboard with equal command. Our platform re-write only shipped because of his clarity.",
    name: "Priya Ranganathan",
    title: "CTO",
    company: "Meridian Global Bank",
  },
  {
    quote:
      "Every decision Alex made three years ago still holds up under load. He designs for the system you'll actually have, not the one on the slide.",
    name: "Markus Lindqvist",
    title: "VP Engineering",
    company: "Vertex Retail Group",
  },
  {
    quote:
      "He turned our messiest programme into the most predictable one in the portfolio. Recruiters, hire him yesterday.",
    name: "Dr. Elena Ross",
    title: "Chief Information Officer",
    company: "Northwind Health Systems",
  },
];
