import Vue from 'vue'
import { Mixin, Mixins } from 'vue-mixin-decorator'
import { RequestStatuses, RequestStatus, RequestType } from '../models'
import { MsgBoxBtns } from '@/models'
import { featuresMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'

const Mappers = Vue.extend({
  computed: {
    ...featuresMapper.mapGetters(['loadingError'])
  }
})

interface IMixinInterface extends MsgBoxToolsApp {}

@Mixin
export default class MsgBoxTools extends Mixins<IMixinInterface>(Mappers, MsgBoxToolsApp) {
  loadingError: string
  requestStatus: RequestStatus = 'failFetchList'
  titles: {[key in RequestType]: string} = { 'success': 'Готово!', 'fail': 'Ошибка!', 'other': 'Вы уверены?' }
  statuses: {[key in RequestType]: RequestStatuses[RequestType][]} = {
    success: [ 'successFetchList', 'successEdit' ],
    fail: [ 'failFetchList', 'failEdit' ],
    other: [ 'beforeEdit' ]
  }
  btns: { [key in RequestStatus]: MsgBoxBtns } = {
    successFetchList: { firstBtn: 'Закрыть' },
    successEdit: { firstBtn: 'Закрыть' },
    failFetchList: { firstBtn: 'Повторить попытку' },
    failEdit: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    beforeEdit: { firstBtn: 'Подтвердить', secondBtn: 'Отмена' }
  }
  msgBoxOtherMsgs: { [key in RequestStatuses['other']]: string } = { beforeEdit: '' }
  beforeEditMsg: { 0: string, 1: string } = {
    0: 'Указанные разделы перестанут отображаться в приложении.<br>Хотите продолжить?',
    1: 'Указанные разделы станут доступны в приложении.<br>Хотите продолжить?'
  }

  get statusType() {
    for (const type in this.statuses) {
      if (this.statuses[type].indexOf(this.requestStatus) >= 0) return type
    }
  }
  get msgBoxTitle() { return this.titles[this.statusType]}
  get msgBoxMsg() {
    if (this.statusType === 'other') return this.msgBoxOtherMsgs[this.requestStatus]
    return this.loadingError
  }
  get msgBoxBtns() { return this.btns[this.requestStatus] }
  get msgBoxContent() { return { title: this.msgBoxTitle, msg: this.msgBoxMsg || this.contentDefault, ...this.msgBoxBtns } }
}