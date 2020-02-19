import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'
import { RequestStatuses, RequestStatus, RequestType, MsgBoxContent, MsgBoxBtns } from '../models'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['loadingError'])
  }
})
@Mixin
export default class msgBoxTools extends Mappers {
  msgBoxIsShown: boolean = false
  requestStatus: RequestStatus = 'failFetchList'
  titles: {[key in RequestType]: string} = { 'success': 'Готово!', 'fail': 'Ошибка!', 'other': null }
  contentDefault: string = 'Похоже, сервер не отвечает'
  statuses: {[key in RequestType]: RequestStatuses[RequestType][]} = {
    success: [ 'successCreate', 'successEdit', 'successDelete' ],
    fail: [ 'failFetchList', 'failFetchBanner', 'failCreate', 'failEdit', 'failDelete', 'failDeactivate', 'failSetAmount' ],
    other: [ 'beforeDelete' ]
  }
  btns: { [key in RequestStatus]: MsgBoxBtns } = {
    successCreate: { firstBtn: 'Отредактировать баннер', secondBtn: 'Вернуться к списку' },
    successEdit: { firstBtn: 'Продолжить редактирование', secondBtn: 'Вернуться к списку' },
    successDelete: { firstBtn: 'Вернуться к списку' },
    failFetchList: { firstBtn: 'Повторить попытку' },
    failFetchBanner: { firstBtn: 'Вернуться к списку' },
    failCreate: { firstBtn: 'Отправить повторно', secondBtn: 'Отменить' },
    failEdit: { firstBtn: 'Отправить повторно', secondBtn: 'Отменить' },
    failDelete: { firstBtn: 'Повторить попытку', secondBtn: 'Отменить' },
    failDeactivate: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    failSetAmount: { firstBtn: 'Повторить попытку', secondBtn: 'Отмена' },
    beforeDelete: { firstBtn: 'Подтвердить', secondBtn: 'Отмена' }
  }
  msgBoxOtherTitles: { [key in RequestStatuses['other']]: string } = { beforeDelete: 'Отправить в архив?' }
  msgBoxSuccessMsgs: { [key in RequestStatuses['success']]: string } = { 'successCreate': 'Баннер успешно сохранен', 'successDelete': 'Баннер перемещен в архив', 'successEdit': 'Данные успешно изменены' }
  msgBoxOtherMsgs: { [key in RequestStatuses['other']]: string } = { beforeDelete: 'После перевода в архив баннер перестанет отображаться в приложении' }

  get statusType() {
    for (const type in this.statuses) {
      if (this.statuses[type].indexOf(this.requestStatus) >= 0) return type
    }
  }
  get msgBoxTitle() { return this.statusType === 'other' ? this.msgBoxOtherTitles[this.requestStatus] : this.titles[this.statusType]}
  get msgBoxMsg() {
    if (this.statusType === 'other') return this.msgBoxOtherMsgs[this.requestStatus]
    else if (this.statusType === 'success') return this.msgBoxSuccessMsgs[this.requestStatus]
    else return this.loadingError
  }
  get msgBoxBtns() { return this.btns[this.requestStatus] }

  get msgBoxContent() { return { title: this.msgBoxTitle, msg: this.msgBoxMsg || this.contentDefault, ...this.msgBoxBtns } }

  created() {
    document.addEventListener('keydown', this.keydownHandler)

    console.log()
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