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
  titles: {[key in RequestType]: string} = { 'success': 'Готово!', 'fail': 'Ошибка!' }
  statuses: {[key in RequestType]: RequestStatuses[RequestType][]} = {
    success: [ 'successFetchList', 'successEdit' ],
    fail: [ 'failFetchList', 'failEdit' ],
  }
  btns: { [key in RequestStatus]: MsgBoxBtns } = {
    successFetchList: { firstBtn: 'Закрыть' },
    successEdit: { firstBtn: 'Закрыть' },
    failFetchList: { firstBtn: 'Повторить попытку' },
    failEdit: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
  }
  // msgBoxSuccessMsgs: { [key in RequestStatuses['success']]: string } = { successCreate: 'Баннер успешно сохранен', successDelete: 'Баннер перемещен в архив', successEdit: 'Данные успешно изменены' }

  get statusType() {
    for (const type in this.statuses) {
      if (this.statuses[type].indexOf(this.requestStatus) >= 0) return type
    }
  }
  get msgBoxTitle() { return this.titles[this.statusType]}
  get msgBoxMsg() {
    // if (this.statusType === 'success') return this.msgBoxSuccessMsgs[this.requestStatus]
    // else return this.loadingError
    return this.loadingError
  }
  get msgBoxBtns() { return this.btns[this.requestStatus] }
  get msgBoxContent() { return { title: this.msgBoxTitle, msg: this.msgBoxMsg || this.contentDefault, ...this.msgBoxBtns } }
}