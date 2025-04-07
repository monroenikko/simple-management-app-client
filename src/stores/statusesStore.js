import { defineStore } from 'pinia';

export const useStatusStore = defineStore('statusesStore', {
  state: () => {
    return {
      errors: {},
      statuses: [],
    };
  },
  actions: {
    async getAllStatuses() {
      const res = await fetch('/api/statuses', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      console.log(data);

      this.statuses = data.results;
    },
  },
});
