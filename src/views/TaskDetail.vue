<template>
    <div class="task-detail" v-if="task">
        <h2>{{ task.taskName }}</h2>
        <h4>{{ task.categoryName }}</h4>
        <p><strong>Beskrivelse:</strong> {{ task.description }}</p>
        <p><strong>Prioritering:</strong> {{ task.priority }}</p>
        <p><strong>Deadline:</strong> {{ formattedDeadline }}</p>
        <p><strong>Kategori:</strong> {{ task.categoryID }}</p>
        <p><strong>Status:</strong> {{ task.status }}</p>

        <h3>Underoppgaver</h3>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="thead-light">
                    <tr>
                        <th>Underoppgave</th>
                        <th>Beskrivelse</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subtask in task.subtasks" :key ="subtask.subtaskID">
                        <td>{{ subtask.subTaskName }}</td>
                        <td>{{ subtask.description }}</td>
                        <td>{{ subtask.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import config from '../assets/js/config.json';
import axios from 'axios';

export default {
    name: 'TaskDetail',
    data() {
        return {
            task: {}
        };
    },
    mounted() {
        console.log('TaskDetail component has been mounted!');
        this.fetchTaskDetails(this.$route.params.id);
    },
    methods: {
        fetchTaskDetails(id) {
            axios.get(`${config.tsApiUrl}/tasks/${id}`)
            .then(response => {
                console.log('Task:', response.data);
                this.task = response.data;
                return axios.get(`${config.tsApiUrl}/categories/${this.task.categoryID}`);
            })
            .then (CategoryResponse => {
                console.log('Category:', CategoryResponse.data);
                this.task.categoryName = CategoryResponse.data.categoryName;
                return axios.get(`${config.tsApiUrl}/subtasks/task/${this.task.taskID}`);
            })
            .then(SubTaskResponse => {
                console.log('SubTasks:', SubTaskResponse.data);
                this.task.subtasks = SubTaskResponse.data;
            })
            .catch(error => {
                console.error('Error fetching task:', error);
            })
        }
    },
    computed : {
        formattedDeadline() {
            if (!this.task || !this.task.deadline) return '';

            const deadlineDate = new Date(this.task.deadline);
            const day = deadlineDate.getDate().toString().padStart(2, '0');
            const month = (deadlineDate.getMonth() + 1).toString().padStart(2, '0');
            const year = deadlineDate.getFullYear();
            const hours = deadlineDate.getHours().toString().padStart(2, '0');
            const minutes = deadlineDate.getMinutes().toString().padStart(2, '0');

            return `${day}.${month}.${year} | ${hours}:${minutes}`;
        }
    },
}
</script>

<style scoped>
.task-detail {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
