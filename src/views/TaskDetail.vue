<template>
    <div class="task-detail" v-if="task">
        <h2>Task Details</h2>
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
            })
            .catch(error => {
                console.error('Error fetching task:', error);
            })
        }
    }
}
</script>

<style scoped>
/* Your component styles go here */
</style>
