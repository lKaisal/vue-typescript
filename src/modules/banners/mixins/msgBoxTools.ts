import { Vue } from 'vue-property-decorator'
import { Mixin } from 'vue-mixin-decorator'

@Mixin
export default class msgBoxTools extends Vue {
  msgBoxIsShown: boolean = false
  msgBoxIsLoading: boolean = false

  created() {
    document.addEventListener('keydown', this.keydownHandler)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
  }

  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && this.msgBoxIsShown) this.closeMsgBox()
  }
  onErrorCatch() {
    this.openMsgBox()
    this.msgBoxIsLoading = false
  }
  openMsgBox() {
    document.body.classList.add('modal-open')
    this.msgBoxIsShown = true
  }
  closeMsgBox() {
    document.body.classList.remove('modal-open')
    this.msgBoxIsShown = false
  }
}