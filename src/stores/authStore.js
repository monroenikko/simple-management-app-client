import { defineStore } from 'pinia';

export const useAuthStore = defineStore('counter', {
  state: () => {
    return {
      user: null,
      errors: {},
    };
  },
  actions: {
    async getUser() {
      if (localStorage.getItem('token')) {
        const res = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.user = data.results.user.first_name;
        }
      }
    },
    async authenticate(apiRoute, formData) {
      const res = await fetch(`/api/${apiRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      try {
        if (data.errors) {
          this.errors = data.errors;
        } else {
          if (data.results.token !== undefined) {
            this.errors = {};
            localStorage.setItem('token', data.results.token);
          }
          const { user } = data.results;
          this.user = user.first_name;
          this.router.push({ name: 'home' });
        }
      } catch (error) {
        this.errors = data;
      }
    },
    async logout() {
      const res = await fetch('/api/logout', {
        method: 'post',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem('token');
        this.router.push({ name: 'login' });
      }
    },
  },
});
