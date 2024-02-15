<template>
  <div class="container mt-5">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1>Opprett Underoppgaver for "{{ task.taskName }}"</h1>
      </div>
      <div class="card-body">
        <div v-for="subtask in subtasks" :key="subtask.SubTaskID" class="mb-3 p-2 bg-light border">
          <h5>{{ subtask.subTaskName }}</h5>
          <p>Beskrivelse:{{ subtask.description }}</p>
          <p>Prioritet: {{ subtask.priority }}</p>
          <p>Status: {{ subtask.status }}</p>
        </div>
        <div v-for="(newSubtask, index) in newSubtasks" :key="`new-${index}`">
          <div class="mb-3">
            <label :for="`subtaskName-${index}`" class="form-label">Underoppgave Navn</label>
            <input type="text" :id="`subtaskName-${index}`" class="form-control" v-model="newSubtask.SubTaskName"
              required>
          </div>
          <div class="mb-3">
            <label :for="`subtaskDescription-${index}`" class="form-label">Beskrivelse</label>
            <textarea :id="`subtaskDescription-${index}`" class="form-control" v-model="newSubtask.Description"
              required></textarea>
          </div>
          <div class="mb-3">
            <label :for="`subtaskPriority-${index}`" class="form-label">Prioritet</label>
            <select :id="`subtaskPriority-${index}`" class="form-select" v-model="newSubtask.Priority" required>
              <option disabled value="">Velg en prioritet</option>
              <option v-for="(priority, index) in config.priority" :key="index" :value="priority">
                {{ translateText(priority) }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label :for="`subtaskStatus-${index}`" class="form-label">Status</label>
            <select :id="`subtaskStatus-${index}`" class="form-select" v-model="newSubtask.Status" required>
              <option disabled value="">Velg en status</option>
              <option v-for="(status, index) in config.status" :key="index" :value="status">
                {{ translateText(status) }}
              </option>
            </select>
          </div>
          <button type="button" class="btn btn-danger mb-3" @click="removeSubtask(index)">Fjern Underoppgave</button>
        </div>
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="addNewSubTask">+ Legg til ny underoppgave</button>
          <button type="button" class="btn btn-primary" @click="createSubTasks">Lagre Alle Underoppgaver</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import config from '../assets/js/config.json';

export default {
  name: 'EditSubTask',
  components: {
  },
  data() {
    return {
      task: {},
      subtasks: [],
      newSubtasks: [], // to handle multiple new subtasks
      categories: {},
      config: config
    };
  },

  methods: {
    fetchCategories() {
      axios.get(`${config.tsApiUrl}/categories`)
        .then(response => {
          console.log('Categories fetched:', response.data);
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    fetchTask(id) {
      axios.get(`${config.tsApiUrl}/tasks/${id}`)
        .then(response => {
          console.log('Task:', response.data);
          this.task = response.data;
        })
        .catch(error => {
          console.error('Error fetching task:', error);
        });
    },
    fetchSubTasks() {
      axios.get(`${config.tsApiUrl}/subtasks/task/${this.$route.params.id}`)
        .then(response => {
          console.log('Subtasks:', response.data);
          this.subtasks = response.data;
        })
        .catch(error => {
          console.error('Error fetching subtasks:', error);
        });
    },
    addNewSubTask() {
      this.newSubtasks.push({
        SubTaskName: '',
        Description: '',
        Priority: '',
        Status: '',
        TaskID: this.$route.params.id
      });
    },
    createSubTasks() {
      Promise.all(this.newSubtasks.map(subtask => {
        console.log('Creating subtask:', subtask);
        return axios.post(`${config.tsApiUrl}/subtasks`, subtask);
      }))
        .then(responses => {
          console.log('All subtasks created:', responses);
          this.$router.push('/task/' + this.$route.params.id);
        })
        .catch(error => {
          console.error('Error creating subtasks:', error);
        });
    },
    translateText(data) {
      return config.translations[data];
    }
  },
  mounted() {
    console.log('EditSubTask component has been mounted: ' + this.$route.params.id);
    this.fetchCategories();
    this.fetchSubTasks();
    this.fetchTask(this.$route.params.id);
  }
};

</script>

<style scoped>
/* Add your component styles here */
</style>
