<template>
    <div class="container mt-5" v-if="task">
        <div class="card border-0 shadow-sm" style="margin-bottom: 1rem;">
            <div class="card-header text-white bg-primary d-flex justify-content-between align-items-center">
                <h3 class="mb-0">{{ task.taskName }}</h3>
                <router-link :to="{name: 'EditTask', params: {id: task.taskID}}" class="btn">
                    <i class="fa-solid fa-pen-to-square" style="color:#ffffff; font-size: 1.35rem;"></i>
                </router-link>
            </div>
            <div class="card-body">
                <h5 class="text-muted">{{ task.categoryName }}</h5>
                <div class="mt-3">
                    <p><strong>Beskrivelse:</strong> {{ task.description }}</p>
                    <p><strong>Prioritering:</strong> {{ translateText(task.priority) }}</p>
                    <p><strong>Deadline:</strong> {{ formattedDeadline }}</p>
                    <p><strong>Kategori:</strong> {{ task.categoryID }}</p>
                    <p><strong>Status:</strong> {{ translateText(task.status) }}</p>
                </div>
            </div>
        </div>
        <div class="card border-0 shadow-sm">
            <div class="card-header text-white">
                <h3 class="mb-0">Underoppgaver</h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table mb-0 table-hover table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">Oppgave</th>
                                <th scope="col">Beskrivelse</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="subtask in task.subtasks" :key="subtask.subtaskID">
                                <td>{{ subtask.subTaskName }}</td>
                                <td>{{ subtask.description }}</td>
                                <td>{{ translateText(subtask.status) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
                .then(CategoryResponse => {
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
        },
        translateText(data) {
            return config.translations[data];
        }
    },
    computed: {
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

<style scoped></style>

