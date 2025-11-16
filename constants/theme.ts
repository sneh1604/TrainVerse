/**
 * RailVerse - Comprehensive theme colors for light and dark mode
 */

import { Platform } from 'react-native';

const tintColorLight = '#1976D2';
const tintColorDark = '#64B5F6';

export const Colors = {
  light: {
    // Base colors
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#FAFAFA',
    
    // Brand colors
    primary: '#1976D2',
    primaryLight: '#E3F2FD',
    primaryDark: '#0D47A1',
    
    // Feature colors
    liveStatus: '#1976D2',
    liveStatusBg: '#E3F2FD',
    trainsByStation: '#E85D04',
    trainsByStationBg: '#FFF3E0',
    liveStation: '#673AB7',
    liveStationBg: '#F3E5F5',
    fareEnquiry: {
      header: '#FF6F00',
      headerText: '#FFF3E0',
      class: {
        A1: '#8E44AD',
        A2: '#2980B9',
        A3: '#27AE60',
        SL: '#F39C12',
        S2: '#D35400',
        CC: '#C0392B',
        EC: '#7F8C8D',
        E3: '#16A085',
      },
      sample: {
        background: '#FFF3E0',
        border: '#FF9800',
        text: '#E65100',
      },
      info: {
        background: '#E3F2FD',
        border: '#2196F3',
        title: '#0D47A1',
      },
    },
    seatAvailability: {
      header: '#009688',
      headerText: '#E0F2F1',
      class: {
        '1A': '#8E44AD',
        '2A': '#2980B9',
        '3A': '#27AE60',
        'SL': '#F39C12',
        '2S': '#D35400',
        'CC': '#C0392B',
        'EC': '#7F8C8D',
        '3E': '#16A085',
      },
      sample: {
        background: '#E0F2F1',
        border: '#009688',
        text: '#004D40',
      },
      info: {
        background: '#E3F2FD',
        border: '#2196F3',
        title: '#0D47A1',
      },
      status: {
        cnfBg: '#E8F5E9',
        cnfText: '#1B5E20',
        wlBg: '#FFF3E0',
        wlText: '#E65100',
        regretBg: '#FFEBEE',
        regretText: '#B71C1C',
      }
    },
    seatAvailabilityBg: '#E0F2F1',
    pnrStatus: '#D32F2F',
    pnrStatusBg: '#FFEBEE',
    explore: '#00897B',
    exploreBg: '#E0F2F1',
    
    // UI colors
    tint: tintColorLight,
    icon: '#666666',
    iconActive: '#1976D2',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    
    // Status colors
    success: '#4CAF50',
    successBg: '#E8F5E9',
    warning: '#FF9800',
    warningBg: '#FFF3E0',
    error: '#F44336',
    errorBg: '#FFEBEE',
    info: '#2196F3',
    infoBg: '#E3F2FD',
    
    // Border & Divider
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    divider: '#EEEEEE',
    
    // Card & Shadow
    card: '#FFFFFF',
    cardHover: '#F9F9F9',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Input
    inputBg: '#F9F9F9',
    inputBorder: '#DDDDDD',
    placeholder: '#AAAAAA',
    
    // Button
    buttonPrimary: '#1976D2',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#F5F5F5',
    buttonSecondaryText: '#1A1A1A',
  },
  dark: {
    // Base colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2A2A2A',
    
    // Brand colors
    primary: '#64B5F6',
    primaryLight: '#1E3A5F',
    primaryDark: '#90CAF9',
    
    // Feature colors
    liveStatus: '#64B5F6',
    liveStatusBg: '#1A2332',
    trainsByStation: '#FFB74D',
    trainsByStationBg: '#2A1F0F',
    liveStation: '#BA68C8',
    liveStationBg: '#2A1A2E',
    fareEnquiry: {
      header: '#FFB74D',
      headerText: '#2A1F0F',
      class: {
        A1: '#D7BDE2',
        A2: '#A9CCE3',
        A3: '#A3E4D7',
        SL: '#FAD7A0',
        S2: '#EDBB99',
        CC: '#F5B7B1',
        EC: '#D5DBDB',
        E3: '#A2D9CE',
      },
      sample: {
        background: '#2A2410',
        border: '#FFA726',
        text: '#FFD54F',
      },
      info: {
        background: '#1A2832',
        border: '#42A5F5',
        title: '#90CAF9',
      },
    },
    seatAvailability: {
      header: '#4DB6AC',
      headerText: '#1A2826',
      class: {
        '1A': '#D7BDE2',
        '2A': '#A9CCE3',
        '3A': '#A3E4D7',
        'SL': '#FAD7A0',
        '2S': '#EDBB99',
        'CC': '#F5B7B1',
        'EC': '#D5DBDB',
        '3E': '#A2D9CE',
      },
      sample: {
        background: '#1A2826',
        border: '#4DB6AC',
        text: '#A7FFEB',
      },
      info: {
        background: '#1A2832',
        border: '#42A5F5',
        title: '#90CAF9',
      },
      status: {
        cnfBg: '#1B3A1E',
        cnfText: '#A5D6A7',
        wlBg: '#2A2410',
        wlText: '#FFD54F',
        regretBg: '#2A1A1A',
        regretText: '#EF9A9A',
      }
    },
    seatAvailabilityBg: '#1A2826',
    pnrStatus: '#EF5350',
    pnrStatusBg: '#2A1A1A',
    explore: '#4DB6AC',
    exploreBg: '#1A2826',
    
    // UI colors
    tint: tintColorDark,
    icon: '#B0B0B0',
    iconActive: '#64B5F6',
    tabIconDefault: '#808080',
    tabIconSelected: tintColorDark,
    
    // Status colors
    success: '#66BB6A',
    successBg: '#1B3A1E',
    warning: '#FFA726',
    warningBg: '#2A2410',
    error: '#EF5350',
    errorBg: '#2A1A1A',
    info: '#42A5F5',
    infoBg: '#1A2832',
    
    // Border & Divider
    border: '#333333',
    borderLight: '#2A2A2A',
    divider: '#262626',
    
    // Card & Shadow
    card: '#1E1E1E',
    cardHover: '#252525',
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Input
    inputBg: '#2A2A2A',
    inputBorder: '#404040',
    placeholder: '#666666',
    
    // Button
    buttonPrimary: '#64B5F6',
    buttonPrimaryText: '#000000',
    buttonSecondary: '#2A2A2A',
    buttonSecondaryText: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
