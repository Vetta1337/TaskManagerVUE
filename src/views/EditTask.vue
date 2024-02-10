<template>
    <div class="container mt-5" v-if="task">
        <div class="card border-0 shadow-sm" style="margin-bottom: 1rem;">
            <div class="card-header text-white">
                <h3 class="mb-0"><strong>Redigerer</strong> {{ task.taskName }}</h3>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateTask">
                    <div class="form-group">
                        <label for="taskName">Oppgavenavn</label>
                        <input type="text" class="form-control" id="taskName" v-model="task.taskName">
                    </div>
                    <div class="form-group">
                        <label for="description">Oppgave beskrivelse</label>
                        <textarea class="form-control" id="description" v-model="task.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="priority">Prioritet</label>
                        <select class="form-control" id="priority" v-model="task.priority">
                            <option v-for="(priorityValue, index) in config.priority" :key="index" :value="priorityValue">{{
                                translateText(priorityValue) }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="deadline">Deadline</label>
                        <VueDatePicker v-model="task.deadline" format="dd.MM.yyyy HH:mm" class="form-control" id="deadline">
                        </VueDatePicker>
                    </div>
                    <div class="form-group">
                        <label for="category">Kategori</label>
                        <select class="form-control" id="category" v-model="task.categoryID">
                            <option v-for="category in categories" :key="category.categoryID" :value="category.categoryID">
                                {{
                                    category.categoryName }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select class="form-control" id="status" v-model="task.status">
                            <option v-for="(statusValue, index) in config.status" :key="index" :value="statusValue">{{
                                translateText(statusValue) }}</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Oppdater oppgave</button>
                </form>
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
                                <th scope="col">Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="subtask in task.subtasks" :key="subtask.subtaskID">
                                <td>
                                    <input type="text" class="form-control" v-model="subtask.subTaskName">
                                </td>
                                <td>
                                    <input type="text" class="form-control" v-model="subtask.description">
                                </td>
                                <td>
                                    <select class="form-control" v-model="subtask.status">
                                        <option v-for="(statusValue, index) in config.status" :key="index"
                                            :value="statusValue">{{ translateText(statusValue) }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <button class="btn"
                                        :class="{ 'btn-primary': !recentlyUpdatedSubtasks.includes(subtask.subtaskID), 'btn-success': recentlyUpdatedSubtasks.includes(subtask.subtaskID) }"
                                        @click="updateSubTask(subtask)">
                                        Oppdater
                                    </button>
                                    <button class="btn btn-danger" @click="deleteSubTask(subtask)">
                                        Slett
                                    </button>
                                </td>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



export default {
    name: 'EditTask',
    components: {
        VueDatePicker
    },
    data() {
        return {
            task: {},
            subtasks: {},
            categories: {},
            recentlyUpdatedSubtasks: [],
            config: config
        };
    },
    mounted() {
        console.log('TaskDetail component has been mounted!');
        this.fetchTaskDetails(this.$route.params.id);
        this.fetchCategories();
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
        updateTask() {
            console.log('Updating task:', this.task)
            axios.put(`${config.tsApiUrl}/tasks/${this.task.taskID}`, this.task)
                .then(respone => {
                    console.log('Task updated:', respone.data);
                    this.$router.push({ name: 'TaskDetail', params: { id: this.task.taskID } });
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                    console.log(error.response)
                });
        },
        updateSubTask(subtask) {
            console.log('Updating subtask:', subtask)
            axios.put(`${config.tsApiUrl}/subtasks/${subtask.subTaskID}`, subtask)
                .then(response => {
                    console.log("Subtask updated:", response.data)
                })
                .catch(error => {
                    console.error('Error updating subtask:', error);
                    console.log(error.response)
                });
        },
        deleteSubTask(subtask) {
            console.log('Deleting subtask:', subtask)
            axios.delete(`${config.tsApiUrl}/subtasks/${subtask.subTaskID}`)
                .then(response => {
                    console.log("Subtask deleted:", response.data)
                    this.task.subtasks = this.task.subtasks.filter(item => item.subtaskID !== subtask.subtaskID);
                    // refresh the subtasks list
                    this.fetchTaskDetails(this.task.taskID);
                })
                .catch(error => {
                    console.error('Error deleting subtask:', error);
                    console.log(error.response)
                });
        },
        translateText(data) {
            return config.translations[data];
        }
    },
    computed: {
    },
}
</script>

<style scoped></style>

