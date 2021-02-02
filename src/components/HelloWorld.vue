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
          <v-btn v-if="draftMode" text @click="publish">
            <v-icon>save</v-icon> Publish
          </v-btn>
          <v-btn v-if="!draftMode" text>
            <v-icon class="mr-2">mdi-twitter</v-icon> Tweet
          </v-btn>
          <v-btn v-if="!draftMode" text>
            <v-icon class="mr-2">link</v-icon> Get sharable link
          </v-btn>
          <v-btn v-if="!draftMode" text @click="setDraftMode">
            <v-icon class="mr-2">create</v-icon> Draft
          </v-btn>
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
                placeholder="Heading"
                v-if="draftMode"
                style="padding:10px"
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

                    <v-btn
                      text
                      class="menubar__v-btn"
                      @click="
                        commands.createTable({
                          rowsCount: 3,
                          colsCount: 3,
                          withHeaderRow: false,
                        })
                      "
                    >
                      <v-icon small>table_view</v-icon>
                      <!-- <icon name="table" /> -->
                    </v-btn>

                    <span v-if="isActive.table()">
                      <button
                        text
                        class="menubar__button ml-4 mr-3"
                        @click="commands.deleteTable"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z M12.2898787,17 L9,17 L9,22 L12.6736312,22 C13.0297295,22.7496048 13.515133,23.4258795 14.1010173,24 L5,24 C2.23857625,24 -1.43817996e-15,21.7614237 -1.77635684e-15,19 L-3.55271368e-15,5 C-3.89089055e-15,2.23857625 2.23857625,5.07265313e-16 5,-1.77635684e-15 L19,-1.77635684e-15 C21.7614237,-2.28362215e-15 24,2.23857625 24,5 L24,7.82313285 C24.0122947,7.88054124 24.0187107,7.93964623 24.0187107,8 C24.0187107,8.06035377 24.0122947,8.11945876 24,8.17686715 L24,14.1010173 C23.4258795,13.515133 22.7496048,13.0297295 22,12.6736312 L22,9 L17,9 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,9 L9,9 L9,15 L13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 Z M17,7 L22,7 L22,5 C22,3.34314575 20.6568542,2 19,2 L17,2 L17,7 Z M15,7 L15,2 L9,2 L9,7 L15,7 Z M7,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,7 L7,7 L7,2 Z M2,9 L2,15 L7,15 L7,9 L2,9 Z M2,17 L2,19 C2,20.6568542 3.34314575,22 5,22 L7,22 L7,17 L2,17 Z"
                          />
                        </svg>
                      </button>

                      <button
                        class="menubar__button ml-3 mr-3"
                        @click="commands.addColumnBefore"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M2,19 C2,20.6568542 3.34314575,22 5,22 C6.65685425,22 8,20.6568542 8,19 L8,5 C8,3.34314575 6.65685425,2 5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-2.7585502e-16,19 L5.81397739e-16,5 C-1.37692243e-16,2.23857625 2.23857625,0 5,0 C7.76142375,0 10,2.23857625 10,5 L10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 4.43234962e-16,21.7614237 -2.7585502e-16,19 Z"
                          />
                        </svg>
                      </button>

                      <button
                        class="menubar__button ml-3 mr-3"
                        @click="commands.addColumnAfter"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5,14 C7.76005315,14.0033061 9.99669388,16.2399468 10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 1.77635684e-15,21.7614237 1.77635684e-15,19 C1.77635684e-15,16.2385763 2.23857625,14 5,14 Z M7.5,19.9375 C8.01776695,19.9375 8.4375,19.517767 8.4375,19 C8.4375,18.482233 8.01776695,18.0625 7.5,18.0625 L6.25,18.0625 C6.07741102,18.0625 5.9375,17.922589 5.9375,17.75 L5.9375,16.5 C5.9375,15.982233 5.51776695,15.5625 5,15.5625 C4.48223305,15.5625 4.0625,15.982233 4.0625,16.5 L4.0625,17.75 C4.0625,17.922589 3.92258898,18.0625 3.75,18.0625 L2.5,18.0625 C1.98223305,18.0625 1.5625,18.482233 1.5625,19 C1.5625,19.517767 1.98223305,19.9375 2.5,19.9375 L3.75,19.9375 C3.92258898,19.9375 4.0625,20.077411 4.0625,20.25 L4.0625,21.5 C4.0625,22.017767 4.48223305,22.4375 5,22.4375 C5.51776695,22.4375 5.9375,22.017767 5.9375,21.5 L5.9375,20.25 C5.9375,20.077411 6.07741102,19.9375 6.25,19.9375 L7.5,19.9375 Z M16,19 C16,20.6568542 17.3431458,22 19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 C17.3431458,2 16,3.34314575 16,5 L16,19 Z M14,19 L14,5 C14,2.23857625 16.2385763,0 19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 Z"
                          />
                        </svg>
                      </button>

                      <button
                        class="menubar__button"
                        @click="commands.deleteColumn"
                      >
                        <icon name="delete_col" />
                      </button>

                      <button
                        text
                        class="menubar__button ml-3 mr-3"
                        @click="commands.addRowBefore"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M5,2 C3.34314575,2 2,3.34314575 2,5 C2,6.65685425 3.34314575,8 5,8 L19,8 C20.6568542,8 22,6.65685425 22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 Z M5,0 L19,0 C21.7614237,-5.07265313e-16 24,2.23857625 24,5 C24,7.76142375 21.7614237,10 19,10 L5,10 C2.23857625,10 3.38176876e-16,7.76142375 0,5 C-1.2263553e-15,2.23857625 2.23857625,5.07265313e-16 5,0 Z"
                          />
                        </svg>
                      </button>
                      <button
                        text
                        class="menubar__button ml-3 mr-3"
                        @click="commands.addRowAfter"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19,0 C21.7600532,0.00330611633 23.9966939,2.23994685 24,5 C24,7.76142375 21.7614237,10 19,10 C16.2385763,10 14,7.76142375 14,5 C14,2.23857625 16.2385763,0 19,0 Z M21.5,5.9375 C22.017767,5.9375 22.4375,5.51776695 22.4375,5 C22.4375,4.48223305 22.017767,4.0625 21.5,4.0625 L20.25,4.0625 C20.077411,4.0625 19.9375,3.92258898 19.9375,3.75 L19.9375,2.5 C19.9375,1.98223305 19.517767,1.5625 19,1.5625 C18.482233,1.5625 18.0625,1.98223305 18.0625,2.5 L18.0625,3.75 C18.0625,3.92258898 17.922589,4.0625 17.75,4.0625 L16.5,4.0625 C15.982233,4.0625 15.5625,4.48223305 15.5625,5 C15.5625,5.51776695 15.982233,5.9375 16.5,5.9375 L17.75,5.9375 C17.922589,5.9375 18.0625,6.07741102 18.0625,6.25 L18.0625,7.5 C18.0625,8.01776695 18.482233,8.4375 19,8.4375 C19.517767,8.4375 19.9375,8.01776695 19.9375,7.5 L19.9375,6.25 C19.9375,6.07741102 20.077411,5.9375 20.25,5.9375 L21.5,5.9375 Z M5,16 C3.34314575,16 2,17.3431458 2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 C22,17.3431458 20.6568542,16 19,16 L5,16 Z M5,14 L19,14 C21.7614237,14 24,16.2385763 24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 3.38176876e-16,21.7614237 0,19 C-1.2263553e-15,16.2385763 2.23857625,14 5,14 Z"
                          />
                        </svg>
                      </button>
                      <button
                        class="menubar__button ml-3 mr-3"
                        @click="commands.deleteRow"
                      >
                        <icon name="delete_row" />
                      </button>
                      <button
                        class="menubar__button ml-3 mr-3"
                        @click="commands.toggleCellMerge"
                      >
                        <icon name="combine_cells" />
                      </button>
                    </span>

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
                v-if="draftMode"
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
  Table,
  TableHeader,
  TableCell,
  TableRow,
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
            new Table({
              resizable: true,
            }),
            new TableHeader(),
            new TableCell(),
            new TableRow(),
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
      bus.$emit("draft-mode", false);
    },
    setDraftMode() {
      this.draftMode = true;
      bus.$emit("draft-mode", true);
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
  /* display: none; */
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

.editor__content .tableWrapper {
  margin: 1em 0;
  overflow-x: auto;
  margin: 1em 0;
  overflow-x: auto;
}
.editor__content table td,
.editor__content table th {
  min-width: 1em;
  border: 2px solid #ddd;
  padding: 3px 5px;
  vertical-align: top;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  cursor: col-resize;
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
