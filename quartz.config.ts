import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: " 🛠️",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#E8F9FD", // Page background
          lightgray: "#025b61", // Borders
          gray: "#B2E0E6", // Heavier borders, graph links
          darkgray: "#3c3836", // Body text
          dark: "#05223f", // Header text, icons
          secondary: "#0e84b2", // Link color
          tertiary: "#4595b4", // Hover states
          highlight: "rgba(7, 102, 120, 0.1)", // Internal link bg, code line highlight
          textHighlight: "rgba(39, 38, 37, 0.25)", // Markdown ==highlight== bg
        },
        darkMode: {
          light: "#1a1d21",           // Rich dark background (from first image)
          lightgray: "#2d3338",       // Subtle dark borders
          gray: "#495057",            // Medium contrast in dark
          darkgray: "#adb5bd",        // Light text for readability
          dark: "#f8f9fa",            // White/light headers
          secondary: "#86C232",       // Bright green accent (from first image)
          tertiary: "#61892F",        // Darker green for visited/hover
          highlight: "rgba(134, 194, 50, 0.15)",  // Green highlight overlay
          textHighlight: "#61892F88", // Semi-transparent green for text highlights
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
