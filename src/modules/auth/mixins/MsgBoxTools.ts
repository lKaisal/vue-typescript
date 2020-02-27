import Vue from 'vue'
import { Mixin, Mixins } from 'vue-mixin-decorator'
import { RequestStatuses, RequestStatus, RequestType, Form } from '../models'
import { MsgBoxBtns } from '@/models'
import { authMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'

const Mappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['form'])
  }
})

interface IMixinInterface extends MsgBoxToolsApp {}

@Mixin
export default class MsgBoxTools extends Mixins<IMixinInterface>(Mappers, MsgBoxToolsApp) {
  form: Form
  requestStatus: RequestStatus = 'failLogin'
  titles: {[key in RequestType]: string} = { 'success': 'Готово!', 'fail': 'Ошибка!' }
  statuses: {[key in RequestType]: RequestStatuses[RequestType][]} = {
    success: [ 'successLogin' ],
    fail: [ 'failLogin' ]
  }
  btns: { [key in RequestStatus]: MsgBoxBtns } = {
    successLogin: { firstBtn: 'Закрыть' },
    failLogin: { firstBtn: 'Закрыть' },
  }

  get statusType() {
    for (const type in this.statuses) {
      if (this.statuses[type].indexOf(this.requestStatus) >= 0) return type
    }
  }
  get msgBoxTitle() { return this.titles[this.statusType]}
  get msgBoxMsg() { return this.form.error }
  get msgBoxBtns() { return this.btns[this.requestStatus] }
  get msgBoxContent() { return { title: this.msgBoxTitle, msg: this.msgBoxMsg || this.contentDefault, ...this.msgBoxBtns } }
}
