// tailwind.config.js

import daisyui from "daisyui";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                // “mobile” applies to any width ≤ 400px. That gives you a “mobile:” prefix you can use in your utility classes.
                xs: '480px', /* Custom small screen */
                'mobile': { max: '480px' },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
        },
    },
    daisyui: {
        themes: ["cupcake", "dark", "light", "bumblebee"],
    },
    plugins: [daisyui]
}
