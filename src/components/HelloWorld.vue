<template>
  <v-container>
    <v-row>
      <v-col class="mb-10">
        Text Editor
        <br />
        <v-btn @click="addNew" color="primary">Content </v-btn>
        <v-btn @click="addImage" color="primary">Image </v-btn>

        <br />
        <div v-for="(block, idx) in content" :key="idx" class="mt-5">
          <div class="">
            <br />
            <input
              class="titleEditable"
              v-model="block.title"
              placeholder="Title"
            />
            <!-- <vue-editor v-model="content[idx].body"></vue-editor> -->
            <!-- vue-editor docs: https://www.npmjs.com/package/vue2-editor -->
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
                    <figure>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                      >
                        <path
                          class="path1"
                          d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
                        ></path>
                      </svg>
                    </figure>
                    <span class="upload-caption">{{
                      content[idx].hasImage ? "Replace" : "Click to upload"
                    }}</span>
                  </label>
                </image-uploader>
              </div>
            </div>
            <div v-if="!block.imageContent">
              <editor-menu-bar
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
                    b
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.italic() }"
                    @click="commands.italic"
                  >
                    i
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.strike() }"
                    @click="commands.strike"
                  >
                    strike
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.underline() }"
                    @click="commands.underline"
                  >
                    u
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.code() }"
                    @click="commands.code"
                  >
                    code
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
                    ul
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.ordered_list() }"
                    @click="commands.ordered_list"
                  >
                    ol
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.blockquote() }"
                    @click="commands.blockquote"
                  >
                    q
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.code_block() }"
                    @click="commands.code_block"
                  >
                    c b
                  </v-btn>
                </div>
              </editor-menu-bar>

              <editor-content class="editor__content" :editor="block.editor" />
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
} from "tiptap-extensions";
export default {
  name: "HelloWorld",

  components: {
    VueEditor,
    EditorContent,
    EditorMenuBar,
  },

  data: () => ({
    // hasImage: false,
    // image: null,

    content: [
      {
        title: "first block",
        editor: new Editor({
          content: `<p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface`,
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
    showIdx(idx) {
      alert(idx);
    },
    addImage() {
      this.content.push({
        title: "",
        body: "",
        editor: null,
        imageContent: true,
        hasImage: false,
        image: null,
      });
    },
    setImage: function(output, idx) {
      this.content[idx].hasImage = true;
      this.content[idx].image = output;
    },
    deleteBlock(idx) {
      if (this.content[idx].editor !== null) {
        this.content[idx].editor.destroy();
      }
      this.content.splice(idx, 1);
      this.content = [...this.content];
    },
    addNew() {
      this.content.push({
        title: "",
        body: "",
        editor: new Editor({
          content: "Write something",
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
</style>
