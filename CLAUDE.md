SECURITY & CONSISTENCY RULES — apply to every change made in this project:
1. No secrets in code
Never hardcode API keys, tokens, or credentials. The only permitted client-side credentials in this project are the existing EmailJS values (service_vobl839, template_ea5tghs, public key 5FtKlbfKWIuJqIPPQ) which are intentionally public-facing by EmailJS design. Do not add any new credentials to any file without flagging it explicitly for review.
2. No new dependencies
Do not introduce npm packages, CDN scripts, or external libraries without explicitly stating what is being added and why. This is a zero-dependency vanilla project. Any proposed addition must be flagged as a deviation.
3. Style consistency
All new CSS must use existing custom properties (--gold, --glass-bg-mid, --glass-blur, --bg, --text, etc.). Never hardcode colour hex values that duplicate existing tokens. Never introduce new font families — stick to Libre Baskerville, Montserrat, Lora italic.
4. File structure integrity
Never move, rename or delete existing files. New files must follow the lowercase-hyphenated naming convention. The CNAME file must never be touched.
5. Asset path awareness
Root index.html uses assets/ prefix. All subdirectory pages use ../assets/. Never flatten or alter this convention.
6. Accessibility — never regress
Never remove aria- attributes, alt text, role attributes, or focus-visible styles that already exist. Every new interactive element must have appropriate aria-label or visible label.
7. Reduced motion — always respected
Every new animation or transition must be wrapped in or conditional on @media (prefers-reduced-motion: no-preference). Never add bare animations outside this guard.
8. Cross-page consistency
Any change to shared components (nav, footer, scroll-to-top, announcement bar) must be applied to all six pages: index.html, about/index.html, portfolio/index.html, services/index.html, contact/index.html, sound-design/index.html.
9. Before finishing any task
Confirm: no new <script src=""> tags pointing to unknown third parties, no inline style="" attributes that override custom properties, no !important added except where it already exists in the codebase.