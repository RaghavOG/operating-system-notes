# Operating Systems Notes

> Comprehensive study notes for operating systems interviews at FAANG companies

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RaghavOG/operating-system-notes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A clean, readable documentation website built with Next.js 14, featuring comprehensive operating systems study materials organized into 20 progressive topics from OS philosophy to FAANG-level filter questions.

## ✨ Features

- 📚 **20 Comprehensive Topics**: From OS philosophy to FAANG filter questions
- 🔍 **Full-Text Search**: Search across all content instantly
- 🌓 **Dark/Light Mode**: Toggle between themes
- 📱 **Mobile Responsive**: Optimized for all devices
- 🎨 **Clean UI**: Documentation-style layout with sidebar navigation
- 🔗 **Auto-Generated TOC**: Table of contents with active section highlighting
- ⚡ **Fast Performance**: Static site generation for optimal speed
- 🔎 **SEO Optimized**: Sitemap, robots.txt, and meta tags included
- 💡 **Syntax Highlighting**: Beautiful code blocks with syntax highlighting
- 🔄 **Cross-Linking**: Easy navigation between related topics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RaghavOG/operating-system-notes.git
cd operating-system-notes

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
operating-system/
├── app/                    # Next.js App Router
│   ├── docs/              # Documentation routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt generation
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── MDXContent.tsx    # Markdown renderer
│   ├── SearchBar.tsx     # Search functionality
│   └── ...
├── content/               # Markdown content files
│   ├── topic-01-os-philosophy-design/
│   ├── topic-02-kernel-architecture/
│   └── ...
├── lib/                   # Utility functions
│   └── docs.ts           # Content loading utilities
└── scripts/              # Build scripts
```

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[Vercel Analytics](https://vercel.com/analytics)** - Analytics integration
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

## 📚 Content Structure

The content is organized into 20 progressive topics:

1. **OS Philosophy & Design** - Core concepts and design principles
2. **Kernel Architecture** - Monolithic, microkernel, hybrid, exokernel
3. **User Mode vs Kernel Mode** - Privilege levels and security
4. **System Calls & Context Transition** - System call mechanisms
5. **Process Management** - Processes, fork, exec, zombies
6. **Threads** - Thread models and concurrency
7. **CPU Scheduling** - Scheduling algorithms and CFS
8. **Concurrency Fundamentals** - Race conditions and atomicity
9. **Synchronization Primitives** - Mutex, semaphore, locks
10. **Deadlocks** - Detection, prevention, and recovery
11. **Memory Management** - Paging, segmentation, allocation
12. **Virtual Memory** - Demand paging and page replacement
13. **Caching & Memory Hierarchy** - Cache coherence and locality
14. **File Systems** - File abstraction and directory structures
15. **Disk & IO Systems** - Disk scheduling and IO techniques
16. **Security & Protection** - Access control and privilege escalation
17. **Virtualization & Containers** - VMs, containers, namespaces
18. **Modern OS Scenarios** - Real-world interview scenarios
19. **Comparison Questions** - Classic OS comparison questions
20. **FAANG Filter Questions** - Advanced philosophical questions

## 🎨 Customization

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Theme Customization

Edit `app/globals.css` to customize colors and styling.

### Adding Content

1. Add markdown files to `/content` directory
2. Follow the existing structure (topic folders)
3. Files are automatically discovered and routed

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy
4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SITE_URL` (optional, defaults to vercel.app URL)

The site will be live at `https://your-project.vercel.app`

### Build for Production

```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set these in your hosting platform's environment variable settings.

## 📖 Documentation

- All documentation content is in the `/content` directory
- Each markdown file supports frontmatter for metadata
- URLs are automatically generated from file paths

Example URL structure:
- `/docs/topic-01-os-philosophy-design/01-os-philosophy-overview`
- `/docs/topic-20-faang-filter-questions/01-philosophical-questions`

## 🧪 Development

### Prerequisites

- Node.js 20+ (use `.nvmrc` for version management)
- npm or yarn

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Quality

This project uses:
- **ESLint** for linting
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Husky** (optional) for git hooks

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `npm run lint` and `npm run type-check`
5. Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow the project's coding standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built for operating systems interview preparation
- Inspired by the need for comprehensive, well-organized study materials
- Thanks to all contributors who help improve this resource

## 📞 Contact

- **GitHub**: [@RaghavOG](https://github.com/RaghavOG)
- **Repository**: [operating-system-notes](https://github.com/RaghavOG/operating-system-notes)

---

**Happy Learning! 🚀**

