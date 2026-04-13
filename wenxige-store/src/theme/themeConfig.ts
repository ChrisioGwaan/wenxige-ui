import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2D5016',
    colorLink: '#2D5016',
    colorLinkHover: '#3d6b20',
    borderRadius: 8,
    fontFamily:
      'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      bodyBg: '#FDFBF7',
      footerBg: '#1A1A1A',
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(45, 80, 22, 0.1)',
      borderRadius: 20,
      controlHeight: 40,
      controlHeightLG: 48,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Menu: {
      horizontalItemSelectedColor: '#2D5016',
      horizontalItemHoverColor: '#3d6b20',
      itemBg: 'transparent',
    },
    Input: {
      controlHeight: 44,
      borderRadius: 8,
    },
  },
};

export default theme;
