/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#ECAE55',
    textSecondary: '#EC4C7D',     
    textButton: '#ECEDEE',
    buttonText: '#FFE4E9',        
    background: '#C5E3FF',
    buttonBackground: '#20285D',
    inputBackground: '#20285D',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#000000',
    textSecondary: '#CCCCCC',      
    textButton: '#ECEDEE',
    buttonText: '#151718',         
    background: '#20285D',
    buttonBackground: '#C5E3FF',
    inputBackground: '#C5E3FF',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
