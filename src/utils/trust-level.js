import i18n from '../locale';

export const getTrustLevelName = (level) => {
  switch (level) {
    case 0:
      return i18n.global.t('New User');
    case 1:
      return i18n.global.t('Basic User');
    case 2:
      return i18n.global.t('User');
    case 3:
      return i18n.global.t('Active User');
    case 4:
      return i18n.global.t('Leader');
    default:
      return i18n.global.t('Unknown User Level');
  }
};
