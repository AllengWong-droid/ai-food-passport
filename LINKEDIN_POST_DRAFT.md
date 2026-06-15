# LinkedIn Post Draft -- AI Food Passport v0.2.0

> Use as-is or adapt to your personal style. Target audience: professional network (recruiters, peers, potential collaborators).

---

## Post Body

🚀 **Just shipped: AI Food Passport v0.2.0 Portfolio Demo Ready**

Over the past several weeks, I've been building a full-stack mobile project from scratch -- and today I'm sharing the public demo.

**What it does:**
AI Food Passport is a concept app that lets you save your dietary preferences (allergens like gluten, dairy, nuts, and dietary restrictions like vegetarian, vegan, halal), then mock-scan a restaurant menu to see which dishes match your needs. Every dish gets a personalized allergen warning badge so you can quickly spot what works for you.

**What I built:**
- Flutter (Dart) frontend with Riverpod state management, go_router navigation, and local persistence
- Node.js Express mock backend on Render, with a provider-routing architecture that separates mock and real OCR/AI adapters -- ready to swap in real providers when API keys are available
- Public web demo deployed on GitHub Pages so anyone can try it
- 97/97 Flutter tests passing; zero warnings on dart analyze

**What I learned:**
- End-to-end mobile + cloud architecture: Flutter → backend API boundary → Render deployment
- State management at scale with Riverpod and shared_preferences
- Provider-pattern design for interchangeable services (mock vs. real)
- Public deployment workflow: Flutter Web build, GitHub Pages, base-href routing, dart-define config
- Full release lifecycle: release notes, verification reports, demo scripts, manual QA, safety disclaimers

**Honest context:**
This is an MVP Alpha portfolio project. The OCR and AI analysis are mock-only -- no real providers are enabled, and the app is not a substitute for real allergy safety practices. It demonstrates architecture, engineering, and product thinking rather than production AI capabilities.

🔗 **Try the demo:** https://allengwong-droid.github.io/ai-food-passport/demo/
📦 **GitHub Release:** https://github.com/AllengWong-droid/ai-food-passport/releases/tag/v0.2.0-portfolio-demo-ready
📂 **Repo:** https://github.com/AllengWong-droid/ai-food-passport

Would love to hear your feedback! What would you build differently?

#Flutter #Dart #NodeJS #MobileDev #PortfolioProject #OpenSource #GitHubPages #Render #MVP

---

## Alternative: Shorter Version

🚀 Shipped my first full-stack mobile portfolio project: AI Food Passport v0.2.0

Flutter frontend • Node.js mock backend on Render • Public web demo on GitHub Pages • 97/97 tests

A concept app for scanning restaurant menus and getting personalized allergen warnings based on your dietary preferences. Mock-only MVP Alpha -- built to demonstrate architecture and engineering, not production AI.

Try it: https://allengwong-droid.github.io/ai-food-passport/demo/
GitHub: https://github.com/AllengWong-droid/ai-food-passport/releases/tag/v0.2.0-portfolio-demo-ready

#Flutter #NodeJS #PortfolioProject #OpenSource

---

## Posting Tips

- Attach a screenshot of the web demo (profile screen with dietary preferences, or result card with allergen warning)
- Tag relevant communities: Flutter, Dart, Node.js, Mobile Development
- Engage with comments honestly -- if someone asks about production readiness, be transparent about mock-only status
- Consider posting during weekday mornings (your local time) for better visibility
