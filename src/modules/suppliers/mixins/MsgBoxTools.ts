import Vue from 'vue'
import { Mixin, Mixins } from 'vue-mixin-decorator'
import { RequestStatuses, RequestStatus, RequestType } from '../models'
import { MsgBoxBtns } from '@/models'
import { suppliersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapGetters(['loadingError'])
  }
})

interface IMixinInterface extends MsgBoxToolsApp {}

@Mixin
export default class MsgBoxTools extends Mixins<IMixinInterface>(Mappers, MsgBoxToolsApp) {
  loadingError: string
  requestStatus: RequestStatus = 'failFetchList'
  titles: {[key in RequestType]: string} = { 'success': 'Готово!', 'fail': 'Ошибка!', 'other': 'Хотите продолжить?'}
  statuses: {[key in RequestType]: RequestStatuses[RequestType][]} = {
    success: [ 'successFetchList', 'successEdit', 'successFetchIdentity', 'successResetSmsTryCount', 'successResetSmsSendCount', 'successDeleteIdentity' ],
    fail: [ 'failFetchList', 'failEdit', 'failFetchIdentity', 'failResetSmsTryCount', 'failResetSmsSendCount', 'failDeleteIdentity' ],
    other: [ 'beforeDeleteIdentity' ]
  }
  btns: { [key in RequestStatus]: MsgBoxBtns } = {
    successFetchList: { firstBtn: 'Закрыть' },
    successEdit: { firstBtn: 'Показать карточку', secondBtn: 'Вернуться к списку' },
    successFetchIdentity: { firstBtn: 'Закрыть' },
    successResetSmsTryCount: { firstBtn: 'Закрыть' },
    successResetSmsSendCount: { firstBtn: 'Закрыть' },
    successDeleteIdentity: { firstBtn: 'Закрыть' },
    failFetchList: { firstBtn: 'Повторить попытку', secondBtn: 'К списку разделов' },
    failEdit: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    failFetchIdentity: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    failResetSmsTryCount: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    failResetSmsSendCount: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    failDeleteIdentity: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    beforeDeleteIdentity: { firstBtn: 'Подтвердить', secondBtn: 'Отмена' }
  }
  msgBoxMsgSuccess: {[key in RequestStatuses['success']]: string} = {
    successFetchList: 'Данные успешно загружены', 
    successFetchIdentity: 'Данные успешно загружены', 
    successEdit: 'Телефон успешно изменен',
    successResetSmsTryCount: 'Количество попыток ввода sms успешно сброшено',
    successResetSmsSendCount: 'Количество отправленных sms успешно сброшено',
    successDeleteIdentity: 'Запись успешно удалена'
  }
  msgBoxMsgOther: {[key in RequestStatuses['other']]: string} = {
    beforeDeleteIdentity: 'Данный процесс удалит учетную запись из мобильного приложения'
  }

  get statusType() {
    for (const type in this.statuses) {
      if (this.statuses[type].indexOf(this.requestStatus) >= 0) return type
    }
  }
  get msgBoxTitle() { return this.titles[this.statusType]}
  get msgBoxMsg() {
    if (this.statusType === 'success') return this.msgBoxMsgSuccess[this.requestStatus]
    else if (this.statusType === 'other') return this.msgBoxMsgOther[this.requestStatus]
    else return this.loadingError
  }
  get msgBoxBtns() { return this.btns[this.requestStatus] }
  get msgBoxContent() { return { title: this.msgBoxTitle, msg: this.msgBoxMsg || this.contentDefault, ...this.msgBoxBtns } }
}