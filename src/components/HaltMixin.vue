<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["IsAllPaused", "IsAllDaoPaused", "IsAllCanvasPaused"]),
  },
  methods: {
    isHalt(data) {
      if (this.IsAllPaused !== 0) {
        this.openMessageErr(
          "D4A This function is suspended for security reasons."
        );
        return false;
      }
      if (this.IsAllDaoPaused !== 0) {
        this.openMessageErr(
          `${data.daoName} (D4A@${data.daoNumber}) This function is suspended for security reasons.`
        );

        return false;
      }

      if (this.IsAllCanvasPaused !== 0) {
        this.openMessageErr(
          `${data.canvasName} (D4A@${data.daoNumber}/Canvas*${data.canvasNumber}) This function is suspended for security reasons.`
        );

        return false;
      }
      return true;
    },

    openMessageErr(title) {
      this.$notify({
        position: "bottom-right",
        dangerouslyUseHTMLString: true,
        title: title,
        type: "error",
        offset: 10,
        duration: 10000,
        customClass: "errorcolor",
        message: "",
      });
    },
  },
};
</script>
