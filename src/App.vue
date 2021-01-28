<template>
  <v-app>
    <v-system-bar app>
      <v-spacer></v-spacer>
    </v-system-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      style="width: 210px"
      class="pt-4"
      color="grey lighten-3"
    >
      <v-list dense nav>
        <v-list-item>
          <v-list-tile-content>
            <v-btn text x-large @click="addNew('content')">
              <v-icon class="mr-2">article</v-icon> Content
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn text x-large @click="addNew('image')">
              <v-icon class="mr-2">insert_photo</v-icon> Image
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn text x-large @click="addNew('embed')">
              <v-icon class="mr-2">link</v-icon> Embed
            </v-btn>
          </v-list-tile-content>
        </v-list-item>

        <v-list-item>
          <v-list-tile-content>
            <v-btn text x-large @click="addNew('codeblock')">
              <v-icon class="mr-2">code </v-icon> Code block
            </v-btn>
          </v-list-tile-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
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
  }),

  methods: {
    addNew(type) {
      console.log("type in app", type);
      bus.$emit("addNew", type);
    },
  },
};
</script>
