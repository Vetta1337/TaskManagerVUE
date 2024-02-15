<template>
    <div class="container mt-5">
        <div class="card border-0 shadow-sm">
            <div class="card-header text-white">
                <h1>Opprett oppgave</h1>
            </div>
            <div class="card-body">
                <form @submit.prevent="createTask">
                    <div class="mb-3">
                        <label for="taskName" class="form-label">Oppgavenavn</label>
                        <input type="text" class="form-control" id="taskName" v-model="task.taskName" required>
                    </div>
                    <div class="mb-3">
                        <label for="taskDescription" class="form-label">Beskrivelse</label>
                        <textarea class="form-control" id="taskDescription" v-model="task.description"
                            required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="taskDueDate" class="form-label">Frist</label>
                        <VueDatePicker v-model="task.Deadline" id="taskDueDate" required></VueDatePicker>
                    </div>
                    <div class="mb-3">
                        <label for="taskCategory" class="form-label">Kategori</label>
                        <select class="form-select" id="taskCategory" v-model="task.categoryID" required>
                            <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">
                                {{ category.categoryName }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="taskPriority" class="form-label">Prioritet</label>
                        <select class="form-select" id="taskPriority" v-model="task.priority" required>
                            <option v-for="(priority, index) in config.priority" :key="index" :value="priority">
                                {{ translateText(priority) }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="taskStatus" class="form-label">Status</label>
                        <select class="form-select" id="taskStatus" v-model="task.status" required>
                            <option v-for="(status, index) in config.status" :key="index" :value="status">
                                {{ translateText(status) }}
                            </option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Opprett oppgave</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import axios from 'axios';
import config from '../assets/js/config.json';

export default {
    name: 'MakeTask',
    components: {
        VueDatePicker
    },
    data() {
        return {
            task: {},
            subtasks: {},
            categories: {},
            config: config
        };
    },
    methods: {
        createTask() {
            console.log('Creating task:', this.task);
            axios.post(`${config.tsApiUrl}/tasks`, this.task)
                .then(response => {
                    console.log('Task created:', response.data);
                    this.$router.push('/makeSubTask/' + response.data.taskID);
                })
                .catch(error => {
                    console.error('Error creating task:', error);
                });
        },
        fetchCategories() {
            axios.get(`${config.tsApiUrl}/categories`)
                .then(response => {
                    console.log('Categories fetched:', response.data);
                    this.categories = response.data;
                    if (this.$route.params.id) {
                        this.task.categoryID = this.$route.params.id;
                    }
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
        },
        translateText(data) {
            return config.translations[data];
        }
    },
    mounted() {
        console.log('MakeTask component has been mounted!');
        console.log(`$route.params:`, this.$route.params.id);
        this.task.status = 'Not Started';
        this.fetchCategories();
    },
};
</script>

<style scoped>

</style>
