<template>
  <v-container>
    <v-row>
      <v-col class="mb-10" cols="12" md="12" lg="12">
        <br />
        <v-row align="center" justify="space-around">
          <v-btn text @click="addNew"> <v-icon>add</v-icon> Content </v-btn>
          <v-btn text @click="addImage"> <v-icon>add</v-icon> Image </v-btn>
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
      }
      this.content.splice(idx, 1);
      this.content = [...this.content];
    },
    addNew() {
      this.content.push({
        title: "",
        body: "",
        modelContent: "",
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
</style>
