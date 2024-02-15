<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #76baea">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Oppgaveliste</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Hjem</router-link>
            </li>
            <li class="nav-item">
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Add global styles here */
</style>
