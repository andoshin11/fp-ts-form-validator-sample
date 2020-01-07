import Vue from "vue";

interface Props {
  json: object;
}

export default Vue.extend<Props>({
  functional: true,
  name: "PrettyJson",
  props: {
    json: {
      type: Object,
      required: true
    }
  },
  render(h, ctx) {
    const { props } = ctx;
    const stringified = JSON.stringify(props.json, null, 2);
    return h("pre", stringified);
  }
});
