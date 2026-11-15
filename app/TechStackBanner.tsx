
const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB Atlas",
  "Vercel",
  "GitHub",
  "ElevenLabs",
  "Gemini",
  "Claude",
  "ChatGPT"
];

export default function TechStackBanner() {
  return (
    <section className="tech-stack-section">
      <h2>POWERED BY MODERN TECHNOLOGY</h2>
      <p>Built for the next generation of creators</p>

      <div className="tech-stack-marquee">
        <div className="tech-stack-track">
          {[...technologies, ...technologies].map((tech, index) => (
            <span className="tech-stack-item" key={`${tech}-${index}`}>
              <span className="tech-stack-star" aria-hidden="true">✦</span>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
