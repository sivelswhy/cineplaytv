# CinePlay Hub

## About

CinePlay Hub is your ultimate streaming companion that aggregates content from various streaming services. It provides a seamless interface to browse and watch your favorite movies and TV shows, powered by the TMDB API.

## Features

- 🎬 Browse movies and TV shows with a modern, responsive interface
- 🔍 Powerful search functionality across multiple content types
- 📱 Mobile-friendly design with touch gestures support
- 🎯 Category-based browsing for easy content discovery
- 💾 Personal watchlist to save your favorite content
- 📢 Configurable announcement banner for important updates
- 🌙 Beautiful UI with smooth animations and transitions
- ⚡ Fast and responsive performance with React and Vite

## Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- A TMDB API key ([Get one here](https://www.themoviedb.org/documentation/api))

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd cineplay-hub

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env and add your TMDB API key

# Step 5: Start the development server
npm run dev
```

### API Configuration

1. Get your TMDB API key from [TMDB's website](https://www.themoviedb.org/documentation/api)
2. Copy `.env.example` to `.env`
3. Replace `your_tmdb_api_key_here` with your actual API key

## Technologies Used

This project leverages modern web technologies for optimal performance and developer experience:

- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React](https://reactjs.org/)** - UI component library
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Query](https://tanstack.com/query)** - Data fetching and caching
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[React Router](https://reactrouter.com/)** - Client-side routing

## Deployment

The project can be deployed to various hosting platforms. Here are detailed instructions for popular options:

### Vercel (Recommended)
1. Fork this repository
2. Import your fork to Vercel
3. Set up environment variables
4. Deploy!

### Netlify
1. Fork this repository
2. Connect your fork to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set up environment variables
5. Deploy!

### GitHub Pages
1. Update `vite.config.ts` with your base URL
2. Run `npm run build`
3. Deploy the `dist` directory

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Managing Announcements

The site includes a configurable announcement banner that can be updated without redeploying the application. The banner configuration is stored in `public/config/announcement.json`:

```json
{
  "enabled": true,          // Set to false to hide the banner
  "message": "Your message here",
  "link": "/optional/url",  // Optional URL when banner is clicked
  "backgroundColor": "#2B8CBE",
  "textColor": "#FFFFFF"
}
```

To update the banner:
1. Edit `public/config/announcement.json` with your desired configuration
2. Deploy the changes to your hosting platform
3. Users will see the updated banner within 1 hour (configurable cache duration)

Note: Users can dismiss the banner by clicking the close button. The dismissal state is stored in their browser's local storage.

## Contributing

We welcome contributions to CinePlay Hub! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

Please make sure to:
- Follow the existing code style
- Add tests if applicable
- Update documentation as needed
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

### Development Guidelines

1. Use TypeScript for all new code
2. Follow the existing component structure
3. Use shadcn/ui components when possible
4. Add proper error handling
5. Keep bundle size in mind
6. Write meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

We are committed to fostering an open and welcoming environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) for details on our code of conduct and the process for submitting pull requests to us.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing problems
2. Review the [Documentation](../../wiki) (if available)
3. Create a new issue if your problem isn't already listed
4. Provide as much detail as possible:
   - Node.js version
   - npm version
   - Browser and version
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie and TV show data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- All our [contributors](../../contributors)
