import { createTheme } from '@mui/material/styles';
import colors from './assets/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,        // '#C82828' - Deep red
      light: '#E57373',            // Lighter red
      dark: '#B71C1C',             // Darker red
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.accent1,        // '#E68228' - Orange
      light: colors.accent5,       // '#F0A078' - Peach
      dark: colors.accent4,        // '#DC5028' - Red-orange
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: colors.background,    // '#FFFFFF'
    },
    text: {
      primary: colors.text,        // '#222222'
      secondary: '#757575',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: colors.accent6,        // '#F0A028' - Golden orange
      light: colors.accent1,       // '#E68228' - Orange
      dark: colors.accent3,        // '#E65A28' - Deep orange
    },
    error: {
      main: colors.primary,        // '#C82828' - Deep red
      light: '#E57373',
      dark: '#B71C1C',
    },
    info: {
      main: colors.accent2,        // '#E66E28' - Orange-brown
      light: colors.accent5,       // '#F0A078' - Peach
      dark: colors.accent4,        // '#DC5028' - Red-orange
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: `0 2px 8px rgba(200, 40, 40, 0.15)`, // Red shadow
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: `0 4px 16px rgba(200, 40, 40, 0.25)`, // Red shadow
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary} 0%, #B71C1C 100%)`, // Red gradient
          '&:hover': {
            background: `linear-gradient(135deg, #B71C1C 0%, #8B0000 100%)`, // Darker red gradient
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(200, 40, 40, 0.04)', // Red hover background
          },
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: colors.primary, // Red border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary, // Red border when focused
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#757575',
            fontWeight: 500,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: colors.primary, // Red indicator
            height: 3,
            borderRadius: 2,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minWidth: 120,
          '&.Mui-selected': {
            color: colors.primary, // Red text when selected
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(200, 40, 40, 0.04)', // Red hover background
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
        },
      },
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    '0 24px 48px rgba(0,0,0,0.35), 0 20px 14px rgba(0,0,0,0.22)',
    '0 29px 58px rgba(0,0,0,0.40), 0 25px 16px rgba(0,0,0,0.22)',
    '0 34px 68px rgba(0,0,0,0.45), 0 30px 18px rgba(0,0,0,0.22)',
    '0 39px 78px rgba(0,0,0,0.50), 0 35px 20px rgba(0,0,0,0.22)',
    '0 44px 88px rgba(0,0,0,0.55), 0 40px 22px rgba(0,0,0,0.22)',
    '0 49px 98px rgba(0,0,0,0.60), 0 45px 24px rgba(0,0,0,0.22)',
    '0 54px 108px rgba(0,0,0,0.65), 0 50px 26px rgba(0,0,0,0.22)',
    '0 59px 118px rgba(0,0,0,0.70), 0 55px 28px rgba(0,0,0,0.22)',
    '0 64px 128px rgba(0,0,0,0.75), 0 60px 30px rgba(0,0,0,0.22)',
    '0 69px 138px rgba(0,0,0,0.80), 0 65px 32px rgba(0,0,0,0.22)',
    '0 74px 148px rgba(0,0,0,0.85), 0 70px 34px rgba(0,0,0,0.22)',
    '0 79px 158px rgba(0,0,0,0.90), 0 75px 36px rgba(0,0,0,0.22)',
    '0 84px 168px rgba(0,0,0,0.95), 0 80px 38px rgba(0,0,0,0.22)',
    '0 89px 178px rgba(0,0,0,1.00), 0 85px 40px rgba(0,0,0,0.22)',
    '0 94px 188px rgba(0,0,0,1.00), 0 90px 42px rgba(0,0,0,0.22)',
    '0 99px 198px rgba(0,0,0,1.00), 0 95px 44px rgba(0,0,0,0.22)',
    '0 104px 208px rgba(0,0,0,1.00), 0 100px 46px rgba(0,0,0,0.22)',
    '0 109px 218px rgba(0,0,0,1.00), 0 105px 48px rgba(0,0,0,0.22)',
    '0 114px 228px rgba(0,0,0,1.00), 0 110px 50px rgba(0,0,0,0.22)',
  ],
});

export default theme; 