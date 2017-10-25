<template lang="pug">
div.markdown-editor
  textarea.editor(
    :value="input"
    @input="update"
  )
  textarea.preview(
    v-html="confluenceWiki"
    readonly
  )
  button.btn.copy(
    :data-clipboard-text="confluenceWiki"
  ) Copy
</template>

<script>
import _ from 'lodash'
import Clipboard from 'clipboard'
import md2cwm from './md2cwm'
import initialMarkdown from './initialMarkdown.md'

export default {
  name: 'MarkdownEditor',
  mounted () {
    this.clip = new Clipboard('.copy')
  },
  data () {
    return {
      input: initialMarkdown
    }
  },
  computed: {
    confluenceWiki () {
      return md2cwm(this.input, {
        codeStyling: {
          theme: 'RDark',
          linenumbers: false
        },
        codeCollapseAt: 500
      })
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
    }, 300)
  }
}
</script>

<style scoped lang="scss">
.markdown-editor {
  display: flex;
  height: 100%;
}

.editor,
.preview {
  flex: 1;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  vertical-align: top;
  border: none;
  resize: none;
  outline: none;
  font-family: 'Monaco';
  font-size: 14px;
}

.editor {
  border-right: 1px solid #ccc;
  background-color: rgb(40, 44, 52);
  color: rgb(171, 178, 191);
}

.copy {
  position: fixed;
  top: 10px;
  right: 27px;
}

.btn {
  border: 1px solid transparent;
  padding: .5rem .75rem;
  border-radius: .25rem;
  transition: all .15s ease-in-out;
  color: #fff;
  background-color: #42a5f5;
  border-color: #42a5f5;
  &:hover {
    background-color: #1e88e5;
    border-color: #1e88e5;
  }
}
</style>
