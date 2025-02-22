/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      'movil': '360px',
      'tablet': '640px',
      'desktop': '800px',
      'desktop-md':'1024px',
      'desktop-lg':'1280px',
      'desktop-xl':'1600px',

    },
    extend: {
      boxShadow: {
        'right-only-xs': '2px 0 2px rgba(0, 0, 0, 0.15)', // sombra solo hacia la derecha
        'right-only-md': '2px 0 4px rgba(0, 0, 0, 0.15)', // sombra solo hacia la derecha
        'right-only-lg': '4px 0 4px rgba(0, 0, 0, 0.15)', // sombra solo hacia la derecha
      },
      keyframes: {
        moveLeftDisappear: {
          '0%': { transform: 'translateX(0)', opacity: '1', color:'red' },
          '80%': { transform: 'translateX(8px)', opacity: '1', color:'green' }, // Mover a la derecha manteniendo la opacidad
          '100%': { transform: 'translateX(8px)', opacity: '0' }, // Al final, desaparecer
        },
        parpadeo: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'red' }, // Usa el color actual del borde
        },
      },
      animation: {
        'left-disappear': 'moveLeftDisappear 2s ease-in-out infinite',
        'parpadeoborde': 'parpadeo 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

