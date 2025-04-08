import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alertStore', {
  state: () => {
    return {
      errors: {},
      alertMessage: '',
      alertType: '',
      alertVisible: false,
      alertDuratioin: 5000,
    };
  },

  actions: {
    showAlert(data) {
      this.alertMessage = data.message;
      this.alertType = data.type;
      this.alertVisible = data.visible;
      this.alertDuration = data.duration;
    },
    hide() {
      this.isVisible = false;
    },
  },
});
