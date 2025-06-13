import {getTCaptchaConfigAPI} from '@/api/tcaptcha';
import i18n from '@/locale';
import {Message} from '@arco-design/web-vue';

export const checkTCaptcha = (params, callback, denyCallback) => {
  getTCaptchaConfigAPI(params).then(
      (res) => {
        const captchaConfig = res.data;
        if (captchaConfig.is_forbidden) {
          Message.error(i18n.global.t('RequestForbiddenContactAdmin'));
          denyCallback();
          return;
        }
        if (captchaConfig.need_verify) {
          try {
            const tCaptchaClient = new TencentCaptcha(
                String(captchaConfig.app_id),
                callback,
                {
                  aidEncrypted: captchaConfig.aid_encrypted,
                  bizState: captchaConfig.biz_state,
                },
            );
            tCaptchaClient.show();
          } catch (e) {
            callback({ret: -1, message: String(e)});
          }
        } else {
          callback({ret: 0});
        }
      },
      (e) => {
        console.error(e);
        Message.error(i18n.global.t('InitTCaptchaFailed'));
        denyCallback();
      },
  );
};
