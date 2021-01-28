<template>
  <v-container>
    <v-row>
      <v-col class="mb-10" cols="12" md="12" lg="12">
        <br />
        <v-row align="center" justify="space-around">
          <!-- <v-btn text @click="addNew"> <v-icon>add</v-icon> Content </v-btn>
          <v-btn text @click="addImage"> <v-icon>add</v-icon> Image </v-btn>
          <v-btn text @click="addEmbed"> <v-icon>add</v-icon> Embed </v-btn>
          <v-btn text @click="addCodeBlock">
            <v-icon>add</v-icon> Code block
          </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn text @click="publish"> <v-icon>save</v-icon> Publish </v-btn>
        </v-row>

        <br />
        <div v-for="(block, idx) in content" :key="idx" class="mt-5">
          <div
            @mouseover="hoverDiv(idx)"
            @mouseout="mouseOutDiv"
            v-bind:class="[
              draftMode && mouseOverIdx === idx ? 'blockDivHover' : 'blockDiv',
            ]"
          >
            <div style="padding: 15px; margin: 5px">
              <br />
              <input
                class="titleEditable"
                v-model="block.title"
                placeholder="Title"
                v-if="draftMode"
              />
              <div v-if="!draftMode" class="titleEditable">
                {{ block.title }}
              </div>
              <!-- <vue-editor v-model="content[idx].body"></vue-editor> -->
              <!-- vue-editor docs: https://www.npmjs.com/package/vue2-editor -->
              <div v-if="block.codeEditorBlock">
                <div class="editor">
                  <editor-content
                    class="editor__content"
                    :editor="block.codeEditor"
                  />
                </div>
              </div>

              <div v-if="block.embedBlock">
                <div
                  v-show="block.embedContent.length"
                  v-html="block.embedContent"
                ></div>
                <div>
                  <input
                    type="text"
                    v-model="block.embedContent"
                    placeholder="Paste embed content"
                    v-if="draftMode"
                    class="iframe__input"
                  />
                </div>
              </div>

              <div v-if="block.imageContent">
                <div class="my-8">
                  <image-uploader
                    :preview="true"
                    :className="[
                      'fileinput',
                      { 'fileinput--loaded': content[idx].hasImage },
                    ]"
                    capture="environment"
                    :debug="1"
                    doNotResize="gif"
                    :autoRotate="true"
                    outputFormat="verbose"
                    @input="setImage($event, idx)"
                    :id="idx.toString()"
                  >
                    <label :for="idx" slot="upload-label">
                      <figure v-if="draftMode">
                        <v-icon x-large>insert_photo</v-icon>
                      </figure>
                      <span v-if="draftMode" class="upload-caption">{{
                        content[idx].hasImage ? "Replace" : "Click to upload"
                      }}</span>
                    </label>
                  </image-uploader>
                </div>
              </div>
              <div v-if="!block.imageContent">
                <editor-menu-bar
                  v-if="draftMode"
                  :editor="block.editor"
                  v-slot="{ commands, isActive, focused }"
                >
                  <div
                    class="menubar is-hidden"
                    :class="{ 'is-focused': focused }"
                  >
                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.bold() }"
                      @click="commands.bold"
                    >
                      <v-icon small>format_bold</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.italic() }"
                      @click="commands.italic"
                    >
                      <v-icon small>format_italic</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.strike() }"
                      @click="commands.strike"
                    >
                      <v-icon small>format_strikethrough</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.underline() }"
                      @click="commands.underline"
                    >
                      <v-icon small>format_underline</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.code() }"
                      @click="commands.code"
                    >
                      <v-icon small>code</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                      @click="commands.heading({ level: 1 })"
                    >
                      H1
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                      @click="commands.heading({ level: 2 })"
                    >
                      H2
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                      @click="commands.heading({ level: 3 })"
                    >
                      H3
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.bullet_list() }"
                      @click="commands.bullet_list"
                    >
                      <v-icon small>format_list_bulleted</v-icon>
                    </v-btn>

                    <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.ordered_list() }"
                      @click="commands.ordered_list"
                    >
                      <v-icon small>format_list_numbered</v-icon>
                    </v-btn>

                    <!-- <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.blockquote() }"
                      @click="commands.blockquote"
                    >
                      <v-icon small>format_quote</v-icon>
                    </v-btn> -->

                    <!-- <v-btn
                      text
                      class="menubar__v-btn"
                      :class="{ 'is-active': isActive.code_block() }"
                      @click="commands.code_block"
                    >
                      c b
                    </v-btn> -->
                  </div>
                </editor-menu-bar>

                <editor-content
                  class="editor__content"
                  :editor="block.editor"
                />
              </div>

              <!-- Editor menu bar: -->
              <v-btn
                @click="deleteBlock(idx)"
                style="float: right"
                text
                rounded
                small
                color="gray"
                ><v-icon small>delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
      <hr />
      <v-col> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
// import { Editor, EditorContent } from "tiptap";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Focus,
  Placeholder,
  CodeBlockHighlight,
} from "tiptap-extensions";

import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";

import { bus } from "../main";

export default {
  name: "HelloWorld",

  components: {
    VueEditor,
    EditorContent,
    EditorMenuBar,
  },

  mounted() {
    bus.$on("addNew", (type) => {
      console.log("type", type);
      if (type === "content") {
        this.addNew();
      } else if (type === "image") {
        this.addImage();
      } else if (type === "embed") {
        this.addEmbed();
      } else if (type === "codeblock") {
        this.addCodeBlock();
      }
    });
  },

  data: () => ({
    // hasImage: false,
    // image: null,
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard" },
      { title: "Photos", icon: "mdi-image" },
      { title: "About", icon: "mdi-help-box" },
    ],
    right: null,
    draftMode: true,
    mouseOverIdx: null,
    content: [
      {
        title: "",
        modelContent: "Write something",
        editor: new Editor({
          editable: true,
          onUpdate: ({ getJSON, getHTML }) => {
            console.log("getJSON", getJSON());
          },
          content: `Write something`,
          extensions: [
            new Blockquote(),
            new BulletList(),
            new CodeBlock(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Focus({
              className: "has-focus",
            }),
          ],
        }),
        imageContent: false,
        body: `<p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p><p>Hola</p>`,
      },
    ],
    content_editor: "<h1>Some initial content</h1>",
  }),

  methods: {
    hoverDiv(idx) {
      this.mouseOverIdx = idx;
    },
    mouseOutDiv() {
      this.mouseOverIdx = null;
    },
    publish() {
      this.draftMode = false;
      console.log("this.content", this.content);
    },
    addImage() {
      this.content.push({
        title: "",
        body: "",
        editor: null,
        codeEditor: null,
        imageContent: true,
        hasImage: false,
        image: null,
        modelContent: "",
      });
    },
    setImage: function(output, idx) {
      this.content[idx].hasImage = true;
      this.content[idx].image = output;
    },
    deleteBlock(idx) {
      if (this.content[idx].editor !== null) {
        this.content[idx].editor.destroy();
      } else if (this.content[idx].codeEditor !== null) {
        this.content[idx].codeEditor.destroy();
      }
      this.content.splice(idx, 1);
      this.content = [...this.content];
    },
    addEmbed() {
      this.content.push({
        title: "",
        body: "",
        editor: null,
        codeEditor: null,
        embedBlock: true,
        embedContent: ``,
        modelContent: "",
      });
    },
    addCodeBlock() {
      this.content.push({
        codeEditorBlock: true,
        embedBlock: false,
        editor: null,
        title: "",
        body: "",
        modelContent: "",
        codeEditor: new Editor({
          extensions: [
            new CodeBlockHighlight({
              languages: {
                javascript,
                css,
              },
            }),
            new Bold(),
            new Code(),
          ],
          content: `
            <pre><code></code><pre>
          `,
        }),
      });
    },
    addNew() {
      this.content.push({
        title: "",
        body: "",
        modelContent: "",
        codeEditor: null,
        editor: new Editor({
          content: "Write something",
          editable: true,
          extensions: [
            new Blockquote(),
            new BulletList(),
            new CodeBlock(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Focus({
              className: "has-focus",
            }),
            new Placeholder({
              emptyNodeText: (node) => {
                return "Placeholder text";
              },
            }),
          ],
        }),
      });
    },
  },
};
</script>

<style>
.menubar {
  margin-bottom: 1rem;
  -webkit-transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
}

.menubar.is-hidden {
  /* visibility: hidden; */
  /* opacity: 0; */
  display: none;
}

/* .menubar.is-hidden {
  visibility: visible;
  opacity: 1;
} */

/* .is-hidden {
  visibility: visible;
  opacity: 1;
} */

.is-focused {
  display: block !important;
  opacity: 1;
  visibility: visible;
}

.is-active {
  font-weight: 900 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.ProseMirror {
  padding: 15px !important;
}

#fileInput {
  display: none;
}

.fileinput {
  display: none;
}

.titleEditable {
  font-size: 25px;
  font-weight: 800;
  width: 100%;
}

.blockDiv {
  border: 1px dotted white;
}
.blockDivHover {
  border: 1px dotted #cfcfcf;
  /* border-style: solid; */
}
.iframe__input {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
}

.editor__content pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: 1.2rem;
  overflow-x: auto;
}

.img-preview {
  width: 75% !important;
}
</style>

<style lang="scss">
pre {
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>
