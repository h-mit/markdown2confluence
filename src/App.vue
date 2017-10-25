<template lang="pug">
div#app
  markdown-editor
</template>

<script>
import MarkdownEditor from './components/MarkdownEditor'

export default {
  name: 'app',
  components: {
    MarkdownEditor
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
