# CUTEILS 🌟
**Tiny Tools, Mighty Impact**

CUTEILS is a collection of simple yet powerful utilities designed to make your daily tasks easier. From JSON to CSV converters to JSON diffing and more, we’ve got you covered. Built with **Next.js**, **TailwindCSS**, and **shadcn UI**, CUTEILS combines performance with sleek, intuitive design.

---

## 🚀 Features
- **JSON Tools**: Convert, diff, and validate JSON effortlessly.
- **CSV Utilities**: Simplify data management with CSV converters.
- **Encoding Tools**: Inspect and rebuild URLs, encode URL components, and convert UTF-8 text with Base64 or Base64URL.
- **Text Tools**: Compare text by line, test JavaScript regex captures, and preview replacements.
- **Time & Auth**: Convert timestamps and durations, preview cron schedules by timezone, decode JWTs, and generate TOTP codes.
- **Clean Design**: User-friendly UI powered by TailwindCSS and shadcn UI.
- **Fast & Lightweight**: Built with Next.js for optimal performance.

---

## 🛠️ Technologies
- **Next.js**: Server-side rendering and static site generation.
- **TailwindCSS**: Highly customizable utility-first CSS framework.
- **shadcn UI**: Modern, accessible components for React.

---

## 📦 Installation
Want to explore the code? Clone the repo and get started!

```bash
git clone https://github.com/siddhardha123/cuteils.git
cd cuteils
npm ci
npm run dev
```

Open `http://localhost:3000`. If that port is already in use, run `npm run dev -- --port 3001` and open `http://localhost:3001`.

### Checks

```bash
npm run lint
npm test
npm run build
```

The regression tests use Node's built-in test runner and TypeScript stripping, tested with Node 24.

All 14 tools process inputs in the browser. Cron previews support five-field schedules, an optional seconds field, and common aliases. The Regex Playground runs patterns in a separate worker, stops slow patterns after one second, and displays up to 500 matches.

### Adding a tool

Create a page under `app/tools/` and add its title, description, route, and category to `lib/tools.ts`. The shared tools layout supplies the page title and navigation. Use `ToolPanel`, `ToolOutput`, `ToolError`, and `CopyButton` from `components/ToolWorkspace.tsx` to keep inputs, results, errors, and clipboard feedback consistent. Process tool inputs in the browser and avoid saving secrets or tokens.

## 🤝 Contributing
We welcome contributions! Here’s how you can help:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## 📄 License
CUTEILS is open-source and available under the MIT License.

---

## ❤️ Acknowledgments
- Built with love using **Next.js**, **TailwindCSS**, and **shadcn UI**.
- Inspired by the need for lightweight, accessible tools for everyone.

---

Enjoy using **CUTEILS**! 🌈  
