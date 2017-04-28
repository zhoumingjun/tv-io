<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  
  import 'bulma/css/bulma.css'

  export default {
    created () {
      window.addEventListener('dragover', function (e) {
        e = e || event
        if (e.target.tagName !== 'INPUT') { // check wich element is our target
          e.preventDefault()
        }
      }, false)
      window.addEventListener('drop', function (e) {
        e = e || event
        if (e.target.tagName !== 'INPUT') {  // check wich element is our target
          e.preventDefault()
        }
      }, false)
    }
  }
</script>

<style>
 
</style>
