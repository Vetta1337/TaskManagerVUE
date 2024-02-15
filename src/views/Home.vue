<template>
  <div class="container mt-4">
    <div v-for="category in categories" :key="category.categoryID" class="my-3">
      <div class="card border-0 shadow-sm">
        <div class="card-header text-white bg-primary d-flex justify-content-between align-items-center">
          <h3 class="mb-0">{{ category.categoryName }} - {{ category.categoryID }}</h3>
          <router-link :to="{ name: 'MakeTask', params: { id: category.categoryID } }" class="btn">
            <i class="fa-solid fa-plus" style="color:#ffffff; font-size: 1.35rem;"></i>
          </router-link>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-fixed table-bordered">
              <thead class="thead-light">
                <tr>
                  <th>Oppgave</th>
                  <th>Beskrivelse</th>
                  <th>Prioritet</th>
                  <th>Detaljer</th>
                  <th>Status</th>
                  <th>Fremgang</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in filteredTasks(category.categoryID)" :key="task.taskID">
                  <td>{{ task.taskName }}</td>
                  <td class="task-description">{{ task.description }}</td>
                  <td>{{ translateText(task.priority) }}</td>
                  <td><router-link :to="{ name: 'TaskDetail', params: { id: task.taskID } }">Detaljer</router-link> </td>
                  <td>
                    <div class="progress">
                      <div class="progress-bar" :style="{ width: calculateProgress(task.taskID) + '%' }">{{
                        calculateProgress(task.taskID).toFixed(0) }} %</div>
                    </div>
                  </td>
                  <td>{{ translateText(task.status) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import config from '../assets/js/config.json';

export default {
  name: 'MainTables',
  data() {
    return {
      categories: [],
      tasks: [],
      SubTasks: [],
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchTasks();
    this.fetchSubTasks();
  },
  methods: {
    fetchCategories() {
      axios.get(`${config.tsApiUrl}/categories`)
        .then(response => {
          console.log('Categories:', response.data);
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    fetchTasks() {
      axios.get(`${config.tsApiUrl}/tasks`)
        .then(response => {
          console.log('Tasks:', response.data);
          this.tasks = response.data;
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
    },
    fetchSubTasks() {
      axios.get(`${config.tsApiUrl}/subtasks`)
        .then(respone => {
          console.log('SubTasks:', respone.data);
          this.SubTasks = respone.data;
        })
        .catch(error => {
          console.error('Error fetching subtasks:', error);
        });
    },
    filteredTasks(categoryID) {
      return this.tasks
        .filter(task => task.categoryID === categoryID)
        .sort((a, b) => {
          return config.priorityOrder[a.priority] - config.priorityOrder[b.priority];
        });
    },
    calculateProgress(taskID) {
      const subtasks = this.SubTasks.filter(subtask => subtask.taskID === taskID);
      const completedSubtasks = subtasks.filter(subtask => subtask.status === 'Completed');
      // Return the percentage of completed subtasks and the number of subtasks
      return (completedSubtasks.length / subtasks.length) * 100;
    },
    translateText(data) {
      return config.translations[data];
    },

  }
};
</script>
  
<style scoped>
.table-fixed {
  table-layout: fixed;
  width: 100%;
  /* Ensures the table spans the full container width */
}

.task-description {
  max-width: 250px;
  /* or any other fixed value */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Assign widths to other columns as needed to ensure a balanced look */
th,
td {
  word-wrap: break-word;
  /* Ensures content wraps within the fixed column width */
}
</style>
  