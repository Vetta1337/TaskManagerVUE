<template>
    <div class="container mt-4">
      <div v-for="category in categories" :key="category.categoryID" class="my-3">
        <h2 class="text-primary">{{ category.categoryName }} - {{ category.categoryID }}</h2>
        <div class="table-responsive">
          <table class="table table-bordered table-hover table-fixed">
            <thead class="thead-light">
              <tr>
                <th>taskName</th>
                <th>taskDescription</th>
                <th>taskPriority</th>
                <th>categoryID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in filteredTasks(category.categoryID)" :key="task.taskID">
                <td>{{ task.taskName }}</td>
                <td class="task-description">{{ task.description }}</td>
                <td>{{ task.priority }}</td>
                <td>{{ task.categoryID }}</td>
                <td><router-link :to="{ name: 'TaskDetail', params: {id: task.taskID}}">Details</router-link> </td>
              </tr>
            </tbody>
          </table>
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
        SubTasks: [] 
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
        return this.tasks.filter(task => task.categoryID === categoryID)
      }
    }
  };
  </script>
  
  <style scoped>
  .table-fixed {
    table-layout: fixed;
    width: 100%; /* Ensures the table spans the full container width */
  }
  
  .task-description {
    max-width: 250px; /* or any other fixed value */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Assign widths to other columns as needed to ensure a balanced look */
  th, td {
    word-wrap: break-word; /* Ensures content wraps within the fixed column width */
  }
  
  </style>
  