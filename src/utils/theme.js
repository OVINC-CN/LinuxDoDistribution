export const isDark = () => {
  const theme = localStorage.getItem('linux-do.theme');
  if (theme) {
    return theme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const changeTheme = () => {
  if (isDark()) {
    localStorage.setItem('linux-do.theme', 'light');
  } else {
    localStorage.setItem('linux-do.theme', 'dark');
  }
  window.location.reload();
};
