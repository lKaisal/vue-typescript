import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'

@Mixin
export default class MsgBoxTools extends Vue {
  msgBoxIsShown: boolean = false
  contentDefault: string = 'Похоже, сервер не отвечает'

  created() {
    document.addEventListener('keydown', this.keydownHandler)
  }

  beforeDestroy() {
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', this.keydownHandler)
  }

  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && this.msgBoxIsShown) this.closeMsgBox()
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