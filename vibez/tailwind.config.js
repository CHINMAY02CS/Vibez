/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  blocklist: ["example_class"], //TODO Add restrictions for specific classes
  prefix: "",
  variants: {
    margin: ["first", "last"],
  },
  theme: {
    screens: {
      sm: { max: "500px" },
      // mobile => below 500px wide
      md: "768px",
      // tablet => (min-width: 768px) (max-width: 1024px)
      lg: "1024px",
      // laptop => (min-width: 1024px) (max-width: 1440px)
      xl: "1367px",
      // FHD screen => (min-width: 1440px) (max-width: 1536px)
      "2xl": "1537px",
    },
    container: {
      center: true,
      padding: "2rem",
    },

    extend: {
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        auth: "url('/background.jpg')",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        constructive: {
          DEFAULT: "hsl(var(--constructive))",
          foreground: "hsl(var(--constructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        15: "3.75rem", // 60px
        18: "4.5rem", // 72px - 1 rem = 4 tailwind units = 16 px
        22: "5.5rem", // 88px
        68: "17rem", // 272px
        76: "19rem", // 304px
        88: "22rem", // 352px
        90: "22.5rem", // 360px
        100: "25rem", // 400px
        104: "26rem", // 416px
        112: "28rem", // 448px
        120: "30rem", // 480px
        124: "31rem", // 496px
        128: "32rem", // 512px
        136: "34rem", // 544px
        144: "36rem", // 578px
        152: "38rem", // 600px
        160: "40rem", // 640px
        176: "44rem", // 704px
        192: "48rem", // 768px
        200: "50rem", // 800px
        208: "52rem", // 832px
        240: "60rem", // 960px
        272: "68rem", // 1088px
        300: "75rem", // 1200px
        304: "76rem", // 1216px
        336: "84rem", // 1344px
        368: "92rem", // 1472px
        400: "100rem", // 1600px
        432: "108rem", // 1728px
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(20%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marqueeEnd: {
          "0%": { transform: "translateX(300%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee 30s linear infinite",
        marqueeEnd: "marquee 30s linear infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
