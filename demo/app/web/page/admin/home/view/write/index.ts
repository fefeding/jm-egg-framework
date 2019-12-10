import Vue from 'vue';
import { Getter, Action } from 'vuex-class';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {
    MarkdownEditor: () => import('component/MarkdownEditor/index.vue')
  }
})
export default class Write extends Vue {
  
}