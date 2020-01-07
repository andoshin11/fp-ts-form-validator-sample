import Vue, { CreateElement } from "vue";
import PrettyJson from "@/components/PrettyJson";

interface Props {
  data: Record<string, object>;
}

const tableStyle = {
  margin: "24px auto",
  backgroundColor: "#ddd",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "left",
  width: "400px"
};

export default Vue.extend<Props>({
  functional: true,
  name: "RawData",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  render(h, ctx) {
    const { data } = ctx.props;

    const tHead = (_h: CreateElement) =>
      _h("thead", [_h("tr", [_h("th", "Name"), _h("th", "Value")])]);

    const row = (_h: CreateElement, entry: [string, object]) =>
      _h("tr", [
        _h("td", entry[0]),
        _h("td", [_h(PrettyJson, { props: { json: entry[1] } })])
      ]);

    const tBody = (_h: CreateElement) =>
      _h(
        "tbody",
        Object.entries(data).map(entry => row(_h, entry))
      );

    return h("table", { style: tableStyle }, [tHead(h), tBody(h)]);
  }
});
