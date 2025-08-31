import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff', // cyan neon
            light: '#66f7ff',
            dark: '#00b2cc',
            contrastText: '#0a0f14',
        },
        secondary: {
            main: '#ff4da6', // magenta neon
            light: '#ff80c7',
            dark: '#cc1a75',
            contrastText: '#ddf3ff',
        },
        success: {
            main: '#8bffb0',
            light: '#b7ffc7',
            dark: '#5ccc7f',
        },
        warning: {
            main: '#ffd166',
            light: '#ffe199',
            dark: '#cca733',
        },
        error: {
            main: '#ff6b6b',
            light: '#ff9999',
            dark: '#cc3333',
        },
        background: {
            default: '#0a0f14', // deep blue-black
            paper: 'rgba(20, 28, 40, 0.55)', // glass effect
        },
        text: {
            primary: '#ddf3ff',
            secondary: '#8aa3b9',
        },
        divider: '#1d2736',
    },
    typography: {
        fontFamily: '"Oxanium", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.125rem',
            fontWeight: 600, // SemiBold
            color: '#ddf3ff',
            textShadow: '0 0 20px rgba(0,229,255,0.3)',
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#ddf3ff',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#ddf3ff',
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#ddf3ff',
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 500,
            color: '#ddf3ff',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            color: '#ddf3ff',
        },
    },
    shape: {
        borderRadius: 14,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `
                        radial-gradient(1200px 800px at 80% 10%, rgba(0,229,255,.05), transparent 60%),
                        radial-gradient(1000px 700px at 10% 90%, rgba(255,77,166,.05), transparent 60%),
                        repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0, rgba(255,255,255,.04) 1px, transparent 1px, transparent 24px),
                        #0a0f14
                    `,
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 0,
                        opacity: 0.05,
                        mixBlendMode: 'soft-light',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(180deg, rgba(20, 28, 40, 0.55), rgba(14, 20, 30, 0.7))',
                    borderBottom: '1px solid #1d2736',
                    backdropFilter: 'blur(10px) saturate(130%)',
                    boxShadow: '0 6px 20px rgba(0,0,0,.35)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'transparent',
                    border: '2px solid',
                    borderColor: 'rgba(19, 210, 235, 0.9)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    backdropFilter: 'blur(10px) saturate(120%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(10px) saturate(120%) brightness(1.1)',
                    boxShadow: `
                        0 8px 32px rgba(138, 17, 175, 0.3),
                        0 0 0 1px rgba(24, 150, 235, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.05)
                    `,
                    borderRadius: 16,
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        backdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
                        WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
                        boxShadow: `
                            0 12px 40px rgba(161, 161, 161, 0.4),
                            0 0 0 1px rgba(255, 255, 255, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.25),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.08),
                            0 0 20px rgba(0, 229, 255, 0.15)
                        `,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'transparent',
                    border: '2px solid transparent',
                    backgroundImage: `
                        linear-gradient(transparent, transparent),
                        linear-gradient(135deg, #00e5ff 0%, #ff4da6 50%, #00e5ff 100%)
                    `,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                    boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.05)
                    `,
                    borderRadius: 16,
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        backdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
                        WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
                        boxShadow: `
                            0 10px 36px rgba(0, 0, 0, 0.35),
                            0 0 0 1px rgba(255, 255, 255, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.25),
                            inset 0 -1px 0 rgba(255, 255, 255, 0.08),
                            0 0 15px rgba(0, 229, 255, 0.12)
                        `,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    textTransform: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: '0 0 0 3px rgba(0, 229, 255, 0.25)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #00e5ff, #00b2cc)',
                    color: '#0a0f14',
                    fontWeight: 600,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #66f7ff, #00e5ff)',
                        boxShadow: '0 0 0 1px rgba(0,229,255,.25), 0 0 24px rgba(0,229,255,.25)',
                    },
                },
                outlined: {
                    borderColor: '#00e5ff',
                    color: '#00e5ff',
                    '&:hover': {
                        borderColor: '#66f7ff',
                        background: 'rgba(0,229,255,0.1)',
                        boxShadow: '0 0 0 1px rgba(0,229,255,.15), 0 0 14px rgba(0,229,255,.2)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        background: 'rgba(20, 28, 40, 0.3)',
                        borderRadius: 14,
                        '& fieldset': {
                            borderColor: '#1d2736',
                        },
                        '&:hover fieldset': {
                            borderColor: '#00e5ff',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00e5ff',
                            boxShadow: '0 0 0 1px rgba(0,229,255,.25)',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1d2736',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00e5ff',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00e5ff',
                        boxShadow: '0 0 0 1px rgba(0,229,255,.25)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    background: 'rgba(0,229,255,0.1)',
                    color: '#00e5ff',
                    border: '1px solid rgba(0,229,255,0.3)',
                    '&.MuiChip-colorSecondary': {
                        background: 'rgba(255,77,166,0.1)',
                        color: '#ff4da6',
                        border: '1px solid rgba(255,77,166,0.3)',
                    },
                    '&.MuiChip-colorSuccess': {
                        background: 'rgba(139,255,176,0.1)',
                        color: '#8bffb0',
                        border: '1px solid rgba(139,255,176,0.3)',
                    },
                    '&.MuiChip-colorWarning': {
                        background: 'rgba(255,209,102,0.1)',
                        color: '#ffd166',
                        border: '1px solid rgba(255,209,102,0.3)',
                    },
                    '&.MuiChip-colorError': {
                        background: 'rgba(255,107,107,0.1)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(255,107,107,0.3)',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(180deg, rgba(20, 28, 40, 0.55), rgba(14, 20, 30, 0.7))',
                    borderRight: '1px solid #1d2736',
                    backdropFilter: 'blur(10px) saturate(130%)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    margin: '4px 8px',
                    '&:hover': {
                        background: 'rgba(0,229,255,0.1)',
                    },
                    '&.Mui-selected': {
                        background: 'rgba(0,229,255,0.15)',
                        color: '#00e5ff',
                        '&:hover': {
                            background: 'rgba(0,229,255,0.2)',
                        },
                    },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(29, 39, 54, 0.5)',
                    borderRadius: 8,
                },
                bar: {
                    background: 'linear-gradient(90deg, #00e5ff, #ff4da6)',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #00e5ff, #00b2cc)',
                    color: '#0a0f14',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #66f7ff, #00e5ff)',
                        boxShadow: '0 0 0 1px rgba(0,229,255,.25), 0 0 24px rgba(0,229,255,.25)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(180deg, rgba(20, 28, 40, 0.55), rgba(14, 20, 30, 0.7))',
                    border: '1px solid #1d2736',
                    backdropFilter: 'blur(10px) saturate(130%)',
                    borderRadius: 18,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    background: 'linear-gradient(180deg, rgba(20, 28, 40, 0.55), rgba(14, 20, 30, 0.7))',
                    border: '1px solid #1d2736',
                    backdropFilter: 'blur(10px) saturate(130%)',
                    borderRadius: 14,
                },
            },
        },
    },
});
