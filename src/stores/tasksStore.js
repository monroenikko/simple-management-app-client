import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { useAlertStore } from './alertStore';

export const useTasksStore = defineStore('tasksStore', {
  state: () => {
    return {
      errors: {},
      tasks: [],
      pagination: {},
      notificationMessage: '',
      notificationType: '',
      notificationVisible: false,
    };
  },

  actions: {
    async getAllTasks(page = 1, params) {
      let query = new URLSearchParams({ page });

      if (params) {
        if (params.keyword) query.append('keyword', params.keyword);
        if (params.status_id) query.append('status_id', params.status_id);
        if (params.per_page) query.append('per_page', params.per_page);
        if (params.field) query.append('field', params.field);
        if (params.ordering) query.append('ordering', params.ordering);
      }

      const res = await fetch(`/api/tasks?${query.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();

      this.tasks = data.results.data;

      this.pagination = data.results.pagination;
      this.currentPage = data.results.pagination.current_page;
    },

    async getTask(task) {
      const res = await fetch(`/api/tasks/${task}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();

      return data.results;
    },

    async createTask(data) {
      const alertStore = useAlertStore();

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status_id', data.status_id);
      formData.append('is_published', data.enabled === true ? 1 : 0);
      formData.append('is_draft', data.enabled === true ? 0 : 1);

      data.images.forEach((image) => {
        formData.append('images[]', image.file);
      });

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const dataRes = await res.json();

      if (dataRes.errors) {
        this.errors = dataRes.errors;
      } else {
        alertStore.showAlert({
          message: dataRes.message,
          type: 'success',
          visible: true,
          duration: 5000,
        });
        this.router.push({ name: 'home' });
        this.errors = {};
      }
    },

    async markTaskStatus(task, formData) {
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      if (authStore.user.id === task.user_id) {
        const res = await fetch(`/api/tasks/${task.id}/mark-status`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          alertStore.showAlert({
            message: data.message,
            type: 'success',
            visible: true,
            duration: 5000,
          });

          this.getAllTasks();
          this.router.push({ name: 'home' });
          this.errors = {};
        }
      }
    },

    async deleteTask(post) {
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`/api/tasks/${post.id}`, {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          alertStore.showAlert({
            message: data.message,
            type: 'success',
            visible: true,
            duration: 5000,
          });
          this.router.push({ name: 'home' });
        }
      }
    },

    async updateTask(task, data) {
      const authStore = useAuthStore();
      const alertStore = useAlertStore();
      if (authStore.user.id === task.user_id) {
        try {
          const formData = new FormData();

          formData.append('_method', 'PUT');
          formData.append('title', String(data.title));
          formData.append('content', String(data.content));
          formData.append('status_id', String(data.status_id));
          formData.append('is_published', data.enabled ? '1' : '0');
          formData.append('is_draft', data.enabled ? '0' : '1');

          if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
              if (image.file) {
                formData.append('images[]', image.file);
              }
            });
          }

          const res = await fetch(`/api/tasks/${task.id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });

          const dataRes = await res.json();

          if (dataRes.errors) {
            this.errors = dataRes.errors;

            return false;
          } else {
            alertStore.showAlert({
              message: dataRes.message,
              type: 'success',
              visible: true,
              duration: 5000,
            });
            this.router.push({ name: 'home' });
            this.errors = {};
            return true;
          }
        } catch (error) {
          this.errors = {
            general: ['An unexpected error occurred. Please try again.'],
          };

          alertStore.showAlert({
            message: 'An unexpected error occurred. Please try again.',
            type: 'error',
            visible: true,
            duration: 5000,
          });
          return false;
        }
      }
    },
  },
});
