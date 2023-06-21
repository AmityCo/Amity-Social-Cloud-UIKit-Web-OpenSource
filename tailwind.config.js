/** @type {import('tailwindcss').Config} */
const path = require('path');

const colors = require('tailwindcss/colors');
//
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [],
  darkMode: 'class',
  theme: {
    fontFamily: {
      ivy: ['IvyJournal', 'sans-serif'],
      mon: ['Montserrat', 'sans-serif'],
      ter: ['Termina', 'sans-serif'],
    },
    fontSize: {
      '3xs': ['0.5rem'],
      '2xs': ['0.625rem'],
      xs: ['.75rem'],
      sm: ['.875rem'],
      base: ['1rem'],
      lg: ['1.125rem'],
      xl: ['1.25rem'],
      '1.5xl': ['1.375rem'],
      '2xl': ['1.5rem'],
      '2.5xl': ['1.625rem'], // 26px (not 27px)
      '3xl': ['1.875rem'],
      '4xl': ['2.25rem'],
      '5xl': ['3rem'],
      '6xl': ['4rem'],
    },
    colors: {
      ...colors,
      cym: {
        // primary
        // not #6C834A
        DEFAULT: '#697E47',

        offwhite: '#FDFAF5',
        beige: '#FAF2E4',
        black: '#222222',
        // secondary
        grey: '#909090',
        placeholdergrey: '#767676',
        placeholdergrey2: '#E7E7E7',
        lightgrey: '#D9D9D9',
        lightergrey: '#F5F5F5',
        teal: '#005850',
        darkteal: '#003C34',
        lightgreen: '#E3EBAF',
        lightergreen: '#EFF2E1',
        savings: '#DFE4C3',
        imagebg: '#E8E8E8',
        // state
        pressed: '#4D5E35',
        success: '#0C8B2F',
        error: '#B91C1C',
      },
    },
    extend: {
      zIndex: {
        1001: '1001',
      },
      gridTemplateColumns: {
        'sub-grid': '63px auto',
      },
      rotate: {
        270: '270deg',
      },
      lineHeight: {
        5.5: '1.375rem',
        6.5: '1.625rem',
      },
      aspectRatio: {
        '2/1': '2 / 1',
        '3/1': '3 / 1',
        '3/2': '3 / 2',
        '4/3': '4 / 3', // 1.333
        '5/4': '5 / 4', // 1.25
        '16/10': '16 / 10', // 1.6
      },
      spacing: {
        1.25: '0.3215rem',
        1.75: '0.4375rem',
        2.5: '0.625rem',
        3.5: '0.875rem',
        4.5: '1.125rem', // 18px
        5.5: '1.375rem', // 22px
        6.5: '1.625rem', // 26px
        7.5: '1.875rem', // 30px
        8.5: '2.125rem',
        9: '2.25rem',
        9.5: '2.375rem',
        10: '2.5rem',
        11: '2.75rem',
        12.5: '3.125rem',
        15: '3.75rem',
        17: '4.25rem',
        17.5: '4.375rem',
        18: '4.5rem',
        20.5: '5.125rem',
        25: '6.25rem',
        26: '6.5rem',
        42: '10.5rem',
        46: '11.5rem',
      },
      width: {
        pic: '251px',
        sample: '130px',
      },
      height: {
        pic: '251px',
        sample: '100px',
      },
    },
    screens: {
      xs: '320px',
      sm: '420px',
      md: '768px',
      lg: '960px',
      xl: '1240px',
      '2xl': '1512px', // stretch goal
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        md: '2.25rem',
        lg: '2.5rem',
      },
    },
    utilities: {
      '.rotate-180': {
        transform: 'rotate(180deg)',
      },
    },
  },
};
