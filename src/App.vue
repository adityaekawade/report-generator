<template>
  <v-app>
    <v-system-bar app color="#330433">
      <v-spacer></v-spacer>
    </v-system-bar>
    <div class="text-center" v-if="!writingMode" style="margin-top: 250px">
      <h1 style="font-size: 50px">
        COMPOSE. PUBLISH. SHARE
      </h1>
      <div class="mt-10">
        <v-btn @click="writingMode = true" color="gray" outlined>
          <v-icon class="mr-2">create</v-icon>Start composing
        </v-btn>
      </div>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      app
      style="width: 205px"
      class="pt-4"
      color="#460e49"
      v-if="writingMode"
    >
      <v-list dense nav>
        <v-list-item>
          <v-list-tile-content>
            <v-btn
              style="color:white; font-size: 20px; font-weight: 600"
              text
              x-large
            >
              iobio.io
            </v-btn>
          </v-list-tile-content>
        </v-list-item>
        <!-- <hr /> -->
        <div style="border-top: 1px solid #aeaeaea6; margin-bottom: 8px"></div>
        <!-- <v-divider></v-divider> -->
        <v-list-item>
          <v-list-tile-content>
            <v-btn style="color:white" text large @click="addNew('content')">
              <v-icon class="mr-2">article</v-icon> Content
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn style="color:white" text large @click="addNew('image')">
              <v-icon class="mr-2">insert_photo</v-icon> Image
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn style="color:white" text large @click="addNew('embed')">
              <v-icon class="mr-2">link</v-icon> Embed
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn style="color:white" text large @click="addNew('codeblock')">
              <v-icon class="mr-2">code </v-icon> Code block
            </v-btn>
          </v-list-tile-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main v-if="writingMode">
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import { bus } from "./main";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: true,
    writingMode: false,
  }),

  mounted() {
    bus.$on("draft-mode", (state) => {
      this.drawer = state;
    });
  },

  methods: {
    addNew(type) {
      console.log("type in app", type);
      bus.$emit("addNew", type);
    },
  },
};
</script>

<style>
.v-application {
  font-family: "Poppins" !important;
}
</style>
