<script>
import { mapMutations, mapState } from "vuex";
import { loginAuth, cookieInfo, logout } from "@/common/api";
import WalletMixin from "@/common/walletService/WalletMixin";
export default {
  mixins: [WalletMixin],
  components: {},
  computed: {
    ...mapState(["MetaMaskAddress", "OriginalText", "User", "IsAcceptSign"]),
    bodyHeight() {
      return this.clientHeight - 60 + "px";
    },
    indexHeight() {
      return this.clientHeight - 240;
    },
  },
  data() {
    return {
      dialogVisible: false,
      clientHeight: 0,
      clientWidth: 0,
    };
  },
  mounted() {
    document.body.clientHeight;
    this.clientHeight = document.body.clientHeight;
    this.clientWidth = document.body.clientWidth;
    // this.loginWallet();
  },
  methods: {
    ...mapMutations(["setUser", "setIsAcceptSign"]),
    async loginWallet() {
      const login = await this.login();
      if (login) {
        this.loginApi();
      }
    },
    async signData() {
      if (!this.User.address) return;
      const sig = await this.getSig(1);
      if (sig) {
        this.getUser();
      }
    },
    async getUser() {
      const user = await cookieInfo();
      this.setUser(user.data);
      // if (this.$route.fullPath === "/login") {
      //   this.$router.push({
      //     path: "/",
      //   });
      // } else {
      //   this.$router.push(this.$route.query.redirect);
      // }
    },
    async loginApi() {
      const loginData = await loginAuth(this.MetaMaskAddress);
      if (!loginData.data) {
        const user = await cookieInfo();
        this.setUser(user.data);
        this.setIsAcceptSign(true);
      } else {
        this.getUser();
      }
    },
    async handleClose() {
      this.setIsAcceptSign(false);
      this.logOut();
      await logout();
      this.setUser({
        name: null,
        address: null,
        avatar: "",
        time: 0,
        token: null,
      });
    },
  },
};
</script>
